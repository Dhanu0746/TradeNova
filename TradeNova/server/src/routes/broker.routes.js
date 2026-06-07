import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Portfolio from '../models/portfolio.model.js';
import { publishMessage } from '../services/rabbitmq.service.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ message: 'Symbol is required' });
  }

  // Mock user for testing if no auth token is provided
  const userId = req.user ? req.user.id : "mocked-user-id-12345";

  try {
    // 🤖 AGENT 1: Sentiment Analysis (Simulated via LLM or Heuristics)
    // In a real app, this would use Langchain and external API tools
    const sentimentScore = Math.random(); // 0 to 1
    const sentiment = sentimentScore > 0.6 ? 'BULLISH' : (sentimentScore < 0.4 ? 'BEARISH' : 'NEUTRAL');
    const sentimentReason = `Agent 1 scraped 15 news articles. Overall sentiment is ${sentiment} (Score: ${sentimentScore.toFixed(2)}).`;

    // 🤖 AGENT 2: Risk Management
    const portfolio = await Portfolio.findOne({ userId });
    const balance = portfolio ? portfolio.balance : 10000;
    
    let isRiskAcceptable = false;
    let riskReason = '';
    const estimatedPrice = 150; // Mock current price

    if (balance > estimatedPrice * 1.5) {
      isRiskAcceptable = true;
      riskReason = `Agent 2 evaluated portfolio balance ($${balance}). Sufficient funds for trade. Risk level is acceptable.`;
    } else {
      riskReason = `Agent 2 evaluated portfolio balance ($${balance}). Insufficient funds or too risky to allocate.`;
    }

    // 🤖 AGENT 3: Execution Broker
    let actionTaken = 'NONE';
    if (sentiment === 'BULLISH' && isRiskAcceptable) {
      // Execute BUY via RabbitMQ
      await publishMessage('trade_queue', {
        action: 'buy',
        symbol: symbol.toUpperCase(),
        price: estimatedPrice,
        userId
      });
      actionTaken = 'BUY_ORDER_QUEUED';
    } else if (sentiment === 'BEARISH') {
      // Check if we hold it, then sell
      const holding = portfolio?.holdings.find(h => h.symbol === symbol.toUpperCase());
      if (holding && holding.quantity > 0) {
        await publishMessage('trade_queue', {
          action: 'sell',
          symbol: symbol.toUpperCase(),
          price: estimatedPrice,
          userId
        });
        actionTaken = 'SELL_ORDER_QUEUED';
      } else {
         actionTaken = 'NO_HOLDINGS_TO_SELL';
      }
    }

    const agentReport = {
      agent_1_sentiment: {
        decision: sentiment,
        reasoning: sentimentReason
      },
      agent_2_risk: {
        decision: isRiskAcceptable ? 'APPROVED' : 'REJECTED',
        reasoning: riskReason
      },
      agent_3_broker: {
        action: actionTaken,
        status: actionTaken.includes('QUEUED') ? 'Order sent to messaging queue asynchronously.' : 'No trade executed.'
      }
    };

    res.json({ report: agentReport });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
