import express from "express";
import cors from "cors";
import { paymentMiddleware } from "x402-express";

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-payment-request', 'x-payment', 'access-control-expose-headers'],
  exposedHeaders: ['x-payment-response'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(paymentMiddleware(
  "0x133693387D21C1A22C9DDE126CFf2950C485Bded", // your receiving wallet address
  {  // Route configurations for protected endpoints
      "GET /weather": {
        // USDC amount in dollars
        price: "$0.001",
        network: "base-sepolia",
      },
    },
  {
    url: "https://x402.org/facilitator", // Facilitator URL for Base Sepolia testnet.
  }
));

// Implement your route
app.get("/weather", (req, res) => {
  res.send({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});

const server = app.listen(4021, () => {
  console.log(`Server listening at http://localhost:4021`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

