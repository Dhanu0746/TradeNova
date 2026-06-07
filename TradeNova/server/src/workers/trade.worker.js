import { getChannel } from '../services/rabbitmq.service.js';
import Portfolio from '../models/portfolio.model.js';

export const startTradeWorker = async () => {
  try {
    const channel = getChannel();
    const queue = 'trade_queue';
    
    await channel.assertQueue(queue, { durable: true });
    console.log(`👷 Trade Worker listening on queue: ${queue}`);
    
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const payload = JSON.parse(msg.content.toString());
        console.log(`📥 Received trade request:`, payload);
        
        try {
          const { action, symbol, price, userId } = payload;
          
          let portfolio = await Portfolio.findOne({ userId });
          if (!portfolio) {
             portfolio = await Portfolio.create({ userId, balance: 10000, holdings: [] });
          }

          if (action === 'buy') {
            if (portfolio.balance >= price) {
              portfolio.balance -= price;
              const existing = portfolio.holdings.find(h => h.symbol === symbol);
              if (existing) {
                existing.quantity += 1;
              } else {
                portfolio.holdings.push({ symbol, quantity: 1, avgPrice: price });
              }
              await portfolio.save();
              console.log(`✅ Trade EXECUTED (BUY): ${symbol} for user ${userId}`);
            } else {
              console.log(`❌ Trade FAILED (BUY): Insufficient funds for user ${userId}`);
            }
          } else if (action === 'sell') {
            const existing = portfolio.holdings.find(h => h.symbol === symbol);
            if (existing && existing.quantity > 0) {
              existing.quantity -= 1;
              portfolio.balance += price;
              await portfolio.save();
              console.log(`✅ Trade EXECUTED (SELL): ${symbol} for user ${userId}`);
            } else {
              console.log(`❌ Trade FAILED (SELL): No holdings of ${symbol} to sell`);
            }
          }
          
          channel.ack(msg);
        } catch (err) {
          console.error("Worker processing error:", err.message);
          channel.ack(msg); // ack it to prevent infinite loop on bad data
        }
      }
    });
  } catch (error) {
    console.error("Worker initialization error:", error.message);
  }
};
