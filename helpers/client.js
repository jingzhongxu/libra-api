const { Client } = require('libra-grpc');

const client = new Client(process.env.ADDRESS || 'ac.testnet.libra.org:8000');

module.exports = client;
