# x402 Payment Example

A test implementation demonstrating the x402 payment protocol for pay-per-request HTTP APIs. This example shows how to set up a resource server that requires micropayments for API access and a client application that automatically handles these payments.

## Overview

The x402 protocol enables HTTP-based micropayments using cryptocurrency. When a client requests a protected resource, the server responds with payment requirements. The client automatically processes the payment and retries the request with proof of payment, receiving the requested data upon successful verification.

This repository contains two main components that work together to demonstrate the protocol:

### Architecture

```
+------------------+          +-------------------+
|   x402_buyer     |          |    x402_seller    |
|   (Client)       |          |    (Server)       |
|                  |          |                   |
|  Frontend        | <------> |  Express Server   |
|  localhost:5174  |   HTTP   |  localhost:4021   |
|                  |          |                   |
|  - Vite Dev      |          |  - CORS Config    |
|  - x402-axios    |          |  - Payment        |
|  - Auto Payment  |          |    Middleware     |
+------------------+          +-------------------+
         |                             |
         |                             |
         +-------------+---------------+
                       |
                 +-----v------+
                 | Facilitator|
                 |  x402.org  |
                 |            |
                 |Base Sepolia|
                 +------------+
```

## Components

### x402_seller (Resource Server)

The server-side application that provides protected API endpoints requiring payment.

**Key Features:**
- Express.js server with x402 payment middleware
- Protected `/weather` endpoint requiring $0.001 USDC per request
- CORS configuration for cross-origin requests
- Integration with Base Sepolia testnet via x402 facilitator

**Technologies:**
- Express.js (v5.1.0)
- x402-express middleware (v0.7.0)
- CORS support

### x402_buyer (Client Application)

The client-side application that automatically handles payment for protected resources.

**Key Features:**
- Vite-based frontend application
- Automatic payment handling via x402-axios interceptors
- Wallet integration using private key authentication
- Response visualization with payment details

**Technologies:**
- Vite development server
- Axios with x402 interceptors (v0.7.0)
- Base Sepolia testnet integration

## How It Works

1. **Client Request**: The frontend makes a GET request to `/weather`
2. **Payment Required**: Server responds with 402 Payment Required status and payment details
3. **Payment Processing**: x402-axios interceptor automatically:
   - Creates payment proof using the configured wallet
   - Signs the payment transaction
   - Retries the request with payment headers
4. **Payment Verification**: Server middleware verifies the payment through the facilitator
5. **Resource Delivery**: Upon successful payment, server returns the requested data
6. **Response Display**: Client receives both the API response and payment confirmation

## Prerequisites

- Node.js (v18 or higher)
- A wallet with Base Sepolia testnet funds
- Private key for payment signing

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd x402_payment_example

# Install seller dependencies
cd x402_seller
npm install

# Install buyer dependencies
cd ../x402_buyer/frontend
npm install
```

### 2. Configure the Seller (Server)

The server is pre-configured in `x402_seller/server.js`:

- **Receiving Wallet**: `0x133693387D21C1A22C9DDE126CFf2950C485Bded`
- **Network**: Base Sepolia testnet
- **Price**: $0.001 USDC per request
- **Port**: 4021

You can modify these settings in [server.js](x402_seller/server.js) if needed.

### 3. Configure the Buyer (Client)

Update the environment variables in `x402_buyer/frontend/.env`:

```env
VITE_RESOURCE_SERVER_URL=http://localhost:4021
VITE_ENDPOINT_PATH=/weather
VITE_PRIVATE_KEY=<your-private-key-here>
```

**Important**: Replace `<your-private-key-here>` with a wallet private key that has Base Sepolia testnet USDC.

### 4. Get Testnet Funds

1. Get Base Sepolia ETH from a faucet (for gas fees)
2. Get Base Sepolia USDC from the appropriate testnet faucet
3. Ensure your wallet has sufficient balance for test transactions

## Running the Example

### Start the Server (Terminal 1)

```bash
cd x402_seller
node server.js
```

You should see:
```
Server listening at http://localhost:4021
```

### Start the Client (Terminal 2)

```bash
cd x402_buyer/frontend
npm run dev
```

You should see:
```
VITE v7.1.7 ready in XXX ms

Local: http://localhost:5174/
```

### Test the Payment Flow

1. Open your browser to `http://localhost:5174`
2. The client will automatically make a request to the `/weather` endpoint
3. Payment will be processed automatically in the background
4. You'll see both the weather data and payment confirmation displayed

## Project Structure

```
x402_payment_example/
├── README.md
├── x402_seller/
│   ├── server.js           # Express server with payment middleware
│   ├── package.json
│   └── node_modules/
└── x402_buyer/
    ├── server.js           # (Optional) Buyer server
    └── frontend/
        ├── src/
        │   ├── client.js   # Payment client implementation
        │   └── style.css
        ├── index.html
        ├── .env            # Environment configuration
        ├── package.json
        └── node_modules/
```

## CORS Configuration

The server includes CORS configuration to allow requests from the client:

- **Allowed Origin**: `http://localhost:5174`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Custom payment headers (`x-payment`, `x-payment-request`)
- **Exposed Headers**: `x-payment-response` (for payment confirmation)

## Troubleshooting

### CORS Errors

If you see CORS-related errors:
1. Ensure the server is running on port 4021
2. Verify the client is accessing from `http://localhost:5174`
3. Check that all required headers are included in the CORS configuration

### Payment Failures

If payments fail:
1. Verify your private key is correct in `.env`
2. Ensure your wallet has sufficient Base Sepolia USDC
3. Check that you have enough ETH for gas fees
4. Confirm you're connected to Base Sepolia testnet

### Server Won't Start

If the server fails to start:
1. Check if port 4021 is already in use: `lsof -i :4021`
2. Kill any existing process: `kill -9 <PID>`
3. Verify all dependencies are installed: `npm install`

## API Endpoint Details

### GET /weather

**Description**: Returns weather information for testing purposes

**Payment Required**: $0.001 USDC on Base Sepolia

**Response**:
```json
{
  "report": {
    "weather": "sunny",
    "temperature": 70
  }
}
```

**Headers**:
- Request: `x-payment` (automatically added by client)
- Response: `x-payment-response` (payment confirmation)

## Security Notes

This is a **test implementation** for educational purposes:

- Private keys are stored in environment variables (not recommended for production)
- Uses testnet cryptocurrencies with no real value
- CORS is configured to allow all methods (should be restricted in production)
- No rate limiting or additional security measures implemented

**Do not use this code in production without proper security hardening.**

## Technologies Used

- **x402 Protocol**: HTTP-based micropayment protocol
- **Express.js**: Web server framework
- **x402-express**: Server-side payment middleware
- **Axios**: HTTP client
- **x402-axios**: Client-side payment interceptors
- **Vite**: Frontend build tool and dev server
- **Base Sepolia**: Ethereum Layer 2 testnet

## Resources

- [x402 Protocol Documentation](https://x402.org)
- [Base Sepolia Testnet](https://base.org)
- [Express.js Documentation](https://expressjs.com)
- [Vite Documentation](https://vitejs.dev)

## License

This is a test implementation for educational purposes. Use at your own risk.
