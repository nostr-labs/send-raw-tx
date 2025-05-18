#!/usr/bin/env node

const testHex = '020000000001010f4d9927c8211eda4bef0477cce76baa1ace5795643d5c00211da5b89036acf10100000000fdffffff0240420f0000000000225120b248d892444f5266cd5105509d600d7f4ad5c03065deb2f4dbf0704822c0675258ca390300000000225120fa0ce4f3e89af473fade21b8a6eefd26a76f9b56b444036058c7529eef552c820140a93f076154be06190592a9af07d6d9b9d1d7478426ec561ebdb9773c098ca2db62086fdad65e7272829c48513b3cab73f25037a36030fbe89a4457ed25a62bde00000000';

console.log('Arguments:', process.argv);
console.log('Test hex length:', testHex.length);
console.log('Test hex is valid hex:', /^[0-9a-fA-F]+$/.test(testHex));

// Simulate manual parsing
if (process.argv.length > 2) {
  const argHex = process.argv[2].replace('--hex=', '').replace('--hex', '');
  console.log('Arg hex:', argHex);
  console.log('Arg hex length:', argHex.length);
  console.log('Arg hex is valid hex:', /^[0-9a-fA-F]+$/.test(argHex));
}

import { isValidTxHex } from './index.js';
console.log('isValidTxHex on test hex:', isValidTxHex(testHex)); 