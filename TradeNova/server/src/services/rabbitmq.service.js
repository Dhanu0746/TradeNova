import amqp from 'amqplib';
import { EventEmitter } from 'events';

let connection = null;
let channel = null;

// ─── In-Memory Queue (used when RabbitMQ is not available) ───────────────────
class InMemoryChannel extends EventEmitter {
  constructor() {
    super();
    this._queues = {}; // queueName → [messages]
    this._consumers = {}; // queueName → handler fn
  }

  assertQueue(queue) {
    if (!this._queues[queue]) this._queues[queue] = [];
    return Promise.resolve();
  }

  sendToQueue(queue, buffer, _opts) {
    const msg = { content: buffer };
    console.log(`[IN-MEMORY QUEUE] 📤 → ${queue}:`, buffer.toString());

    if (this._consumers[queue]) {
      // Deliver immediately to registered consumer
      setImmediate(() => this._consumers[queue](msg));
    } else {
      // Park the message until a consumer registers
      if (!this._queues[queue]) this._queues[queue] = [];
      this._queues[queue].push(msg);
    }
  }

  consume(queue, handler) {
    this._consumers[queue] = handler;
    console.log(`[IN-MEMORY QUEUE] 👂 Consumer registered on: ${queue}`);

    // Drain any messages that arrived before the consumer registered
    const pending = this._queues[queue] || [];
    this._queues[queue] = [];
    pending.forEach(msg => setImmediate(() => handler(msg)));

    return Promise.resolve();
  }

  ack(_msg) {
    // No-op — no broker to acknowledge to
  }

  nack(_msg) {
    // No-op
  }
}

// ─── Connect ─────────────────────────────────────────────────────────────────
export const connectRabbitMQ = async () => {
  try {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log('🐇 RabbitMQ connected');
    return channel;
  } catch (error) {
    console.warn('⚠️  RabbitMQ not available — using in-memory queue (trades will still execute).');
    channel = new InMemoryChannel();
    return channel;
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
};

export const publishMessage = async (queue, message) => {
  try {
    if (!channel) await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  } catch (error) {
    console.error(`Error publishing to queue ${queue}:`, error.message);
  }
};
