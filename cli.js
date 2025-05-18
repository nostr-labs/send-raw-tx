#!/usr/bin/env node

import { sendRawTx, listNetworks, isValidTxHex } from './index.js';

// Parse arguments manually for simplicity
const args = process.argv.slice(2);
let command = null;
const options = {
  hex: null,
  network: 'tbtc4',
  endpoint: null,
  json: false,
  debug: false
};

// Parse command and options
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === 'list-networks') {
    command = 'list-networks';
    continue;
  }

  if (arg === '--json') {
    options.json = true;
    continue;
  }

  if (arg === '--debug') {
    options.debug = true;
    continue;
  }

  // Handle options with values
  if (arg.startsWith('--')) {
    const option = arg.substring(2);

    if (option.includes('=')) {
      // Format: --option=value
      const [name, value] = option.split('=', 2);
      options[name] = value;
    } else if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
      // Format: --option value
      options[option] = args[i + 1];
      i++;
    } else {
      // Flag option
      options[option] = true;
    }
  } else if (!command && !options.hex) {
    // First non-option argument is assumed to be the hex
    options.hex = arg;
  }
}

// Logger function
const log = (message) => {
  if (!options.json) {
    console.log(message);
  }
};

// Debug logger
const debug = (message) => {
  if (options.debug) {
    console.log(`[DEBUG] ${message}`);
  }
};

// Print debug info if debug mode is enabled
debug(`Arguments: ${JSON.stringify(args)}`);
debug(`Parsed options: ${JSON.stringify(options)}`);

// Handle commands
if (command === 'list-networks') {
  const networks = listNetworks();
  console.log('Available networks:');
  networks.forEach(net => console.log(`- ${net}`));
  process.exit(0);
}

// Validate required hex
if (!options.hex) {
  console.error('Error: Transaction hex is required as the first argument');
  console.log(`
Usage: send-raw-tx <transaction_hex> [options]

Options:
  --network <network>  Blockchain network (default: "tbtc4")
  --endpoint <url>     Override endpoint URL
  --json               Output only JSON (no human-readable messages)
  --debug              Enable debug output

Commands:
  list-networks        List all available networks

Examples:
  send-raw-tx 01000000019c2e0f4b740b32a2... --network btc
  send-raw-tx 01000000019c2e0f4b740b32a2... --endpoint https://custom-endpoint.com/api/tx
`);
  process.exit(1);
}

// Validate hex format
if (!isValidTxHex(options.hex)) {
  console.error('Error: Invalid transaction hex format');
  process.exit(1);
}

// Send transaction
(async () => {
  const startTime = Date.now();

  log(`Sending raw transaction to ${options.endpoint || options.network}...`);

  const result = await sendRawTx(options.hex, {
    network: options.network,
    endpoint: options.endpoint,
    debug: options.debug
  });

  // Always output structured JSON
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    log(`✓ Transaction broadcast successfully in ${Date.now() - startTime}ms!`);

    // Handle the case when no txid is available
    if (!result.txid) {
      log(`Note: No transaction ID was returned by the API, but the transaction was accepted.`);
      // Output a fallback value that indicates success but no txid
      console.log(`SUCCESS_NO_TXID_${Date.now()}`);
    } else {
      log(`${result.txid}`);
      // Output just the txid as the last line for easy capture in scripts
      console.log(result.txid);
    }

    process.exit(0); // Success
  } else {
    log(`✗ Failed to broadcast transaction: ${result.error}`);

    // Show detailed error info if available
    if (result.errorDetails) {
      log(`Error details: ${result.errorDetails}`);
    }

    // Set appropriate exit code
    if (result.error.includes('Invalid transaction')) {
      process.exit(1); // Bad input
    } else if (result.error.includes('not found in registry')) {
      process.exit(3); // Network not found
    } else {
      process.exit(2); // Broadcast failed
    }
  }
})(); 