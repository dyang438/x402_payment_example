import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse, createSigner } from "x402-axios";

const privateKey = import.meta.env.VITE_PRIVATE_KEY;
const baseURL = import.meta.env.VITE_RESOURCE_SERVER_URL;
const endpointPath = import.meta.env.VITE_ENDPOINT_PATH;

if (!baseURL || !privateKey || !endpointPath) {
  console.error("Missing required environment variables");
  throw new Error("Missing required environment variables");
}

/**
 * This example shows how to use the x402-axios package to make a request to a resource server that requires a payment.
 *
 * To run this example, you need to set the following environment variables:
 * - PRIVATE_KEY: The private key of the signer
 * - RESOURCE_SERVER_URL: The URL of the resource server
 * - ENDPOINT_PATH: The path of the endpoint to call on the resource server
 *
 */
function renderJSON(data, paymentResponse) {
  const container = document.getElementById('output');

  if (!container) {
    console.warn('No element with id="output" found. Outputting to console only.');
    return;
  }

  const responseSection = data ? `
    <div class="response-section">
      <h3>Response Data:</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>
  ` : '';

  const paymentSection = paymentResponse ? `
    <div class="payment-section">
      <h3>Payment Response:</h3>
      <pre>${JSON.stringify(paymentResponse, null, 2)}</pre>
    </div>
  ` : '';

  container.innerHTML = responseSection + paymentSection;
}

async function main() {
  const signer = await createSigner("base-sepolia", privateKey);

  const api = withPaymentInterceptor(
    axios.create({
      baseURL,
    }),
    signer,
  );

  const response = await api.get(endpointPath);
  console.log(response.data);

  const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
  console.log(paymentResponse);

  // Conditionally render to DOM
  renderJSON(response.data, paymentResponse);
}

main();
