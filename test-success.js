#!/usr/bin/env node

// This simulates a successful transaction broadcast to test the output format

// Case 1: API returns txid directly
const simulateMempoolSpace = true;
const simulateNoTxidButSuccess = false;

// Different response types
let result;

if (simulateMempoolSpace) {
  // Simulate mempool.space style response (just the txid as a string)
  result = "7b5527ae9fc2b2f0e3e1e4f704b319dcdff9f5d2ae4d665c5f1580a8d733b81d";
} else if (simulateNoTxidButSuccess) {
  // Simulate success without txid (some APIs do this)
  result = { success: true, statusCode: 200 };
} else {
  // Normal response with txid
  result = {
    success: true,
    txid: "7b5527ae9fc2b2f0e3e1e4f704b319dcdff9f5d2ae4d665c5f1580a8d733b81d",
    statusCode: 200
  };
}

const startTime = Date.now() - 123; // Pretend it took 123ms

// Log similar to the CLI
console.log("Sending raw transaction to tbtc4...");

// Always output result
if (typeof result === 'string') {
  // mempool.space style response - just the txid
  console.log(JSON.stringify({ success: true, txid: result, statusCode: 200 }, null, 2));
} else {
  // Normal response format
  console.log(JSON.stringify(result, null, 2));
}

if ((typeof result === 'string') || (result.success && result.txid)) {
  // Success with txid
  const txid = typeof result === 'string' ? result : result.txid;
  console.log(`✓ Transaction broadcast successfully in ${Date.now() - startTime}ms!`);
  console.log(`Transaction ID: ${txid}`);
  // Just the txid as the last line for script capture
  console.log(txid);
} else if (result.success) {
  // Success but no txid
  console.log(`✓ Transaction broadcast successfully in ${Date.now() - startTime}ms!`);
  console.log(`Note: No transaction ID was returned by the API, but the transaction was accepted.`);
  // Output a fallback value that indicates success but no txid
  console.log(`SUCCESS_NO_TXID_${Date.now()}`);
} else {
  // Failed
  console.log(`✗ Failed to broadcast transaction: ${result.error || "Unknown error"}`);
  if (result.errorDetails) {
    console.log(`Error details: ${result.errorDetails}`);
  }
} 