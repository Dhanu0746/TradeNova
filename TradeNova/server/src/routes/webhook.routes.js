import express from 'express';

const router = express.Router();

router.post('/stock-event', (req, res) => {
  console.log('Webhook payload:', req.body);
  res.status(200).json({ received: true });
});

export default router;
