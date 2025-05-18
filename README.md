# send-raw-tx

A command-line tool and JavaScript library for sending raw transactions to UTXO-based blockchains.

## Features

- Send raw hexadecimal transactions to any UTXO-based blockchain (Bitcoin, Litecoin, Dogecoin, etc.)
- Chain-agnostic with configurable endpoints
- Built-in registry of popular blockchain networks
- Simple API and CLI interface
- Input validation and clear error reporting
- Structured JSON output

## Installation

### Global Installation (for CLI usage)

```bash
npm install -g send-raw-tx
```

### Local Installation (for use in a project)

```bash
npm install send-raw-tx
```

## Usage

### Command Line Interface

```bash
# Send a transaction to Bitcoin Testnet4 (default network)
send-raw-tx 01000000019c2e0f4b740b32a2754c670d98774da3ee336c72ee65058d57d7c8b1afedb79f0000000000ffffffff0200e1f505000000001976a9144c9c3dfac4207d5d8cb89df5722cb3d712385e3f88ac00e1f505000000001976a9147c686ceef66cb71a3733d71643ccbc849a6e695e88ac00000000

# Send to Bitcoin mainnet
send-raw-tx 01000000019c2e0f4b740b32a2... --network btc

# Send to a specific network
send-raw-tx 01000000019c2e0f4b740b32a2... --network ltc

# Use a custom endpoint
send-raw-tx 01000000019c2e0f4b740b32a2... --endpoint https://custom-endpoint.com/api/tx

# List all available networks
send-raw-tx list-networks

# Output only JSON (for scripting)
send-raw-tx 01000000019c2e0f4b740b32a2... --json

# Enable debug output for troubleshooting
send-raw-tx 01000000019c2e0f4b740b32a2... --debug

# Capture just the transaction ID in a script
TXID=$(send-raw-tx 01000000019c2e0f4b740b32a2... | tail -1)
```

> **Note:** You can run the command using `node cli.js` instead of `send-raw-tx` if you haven't installed the package globally.
>
> **Note:** On successful transaction broadcast, the transaction ID is output as the last line, making it easy to capture in scripts. If no transaction ID is available but the broadcast was successful, a special string in the format `SUCCESS_NO_TXID_${timestamp}` will be output instead.

### Exit Codes

- `0`: Success - Transaction was broadcast successfully
- `1`: Bad input - Invalid transaction hex format
- `2`: Broadcast failed - Failed to broadcast the transaction
- `3`: Network not found - Specified network not found in registry

### JavaScript API

```javascript
import { sendRawTx, listNetworks } from 'send-raw-tx'

// Send a transaction with default options (Bitcoin Testnet4)
const result = await sendRawTx('01000000019c2e0f4b740b32a2...')
console.log(result)
// { success: true, txid: '7b5527ae9fc2b2f0e3e1e4f704b319dcdff9f5d2ae4d665c5f1580a8d733b81d', statusCode: 200 }

// Send to Bitcoin mainnet
const result = await sendRawTx(hexTransaction, { network: 'btc' })

// Send to a specific network
const result = await sendRawTx(hexTransaction, { network: 'tltc' })

// Use a custom endpoint
const result = await sendRawTx(hexTransaction, {
  endpoint: 'https://custom-endpoint.com/api/tx'
})

// Enable debug output for troubleshooting
const result = await sendRawTx(hexTransaction, {
  network: 'tbtc4',
  debug: true
})

// List all available networks
const networks = listNetworks()
```

## Response Format

The response object has the following structure:

```javascript
{
  "success": true|false,      // Whether the transaction was broadcast successfully
  "txid": "txid_string",      // Transaction ID if successful
  "error": "error_message",   // Error message if unsuccessful
  "statusCode": 200           // HTTP status code from the API
}
```

## Network Identifiers

The package uses short identifiers for network names:

| Network          | Identifier |
| ---------------- | ---------- |
| Bitcoin Mainnet  | `btc`      |
| Bitcoin Testnet  | `tbtc3`    |
| Bitcoin Testnet4 | `tbtc4`    |
| Bitcoin Signet   | `sbtc`     |
| Litecoin Mainnet | `ltc`      |
| Litecoin Testnet | `tltc`     |
| Vertcoin         | `vtc`      |
| Liquid Network   | `liquid`   |
| Liquid Testnet   | `tliquid`  |

These identifiers can be used with the `--network` option or the `network` parameter in the JavaScript API.

## Adding Custom Networks

You can add custom networks to the registry by editing the `endpoints.json` file:

```json
{
  "mycoin-mainnet": "https://mycoin-explorer.com/api/tx"
}
```

Alternatively, you can always override the endpoint using the `--endpoint` CLI option or the `endpoint` parameter in the JavaScript API.

## Supported Networks

- Bitcoin (Mainnet `btc`, Testnet `tbtc3`/`tbtc4`, Signet `sbtc`)
- Litecoin (Mainnet `ltc`, Testnet `tltc`)
- Vertcoin (Mainnet `vtc`)
- Liquid Network (Mainnet `liquid`, Testnet `tliquid`)

## License

MIT
