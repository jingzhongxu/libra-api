require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { utils } = require('libra-grpc');
const { has, at } = require('lodash');
const client = require('./helpers/client');

const app = express();
const port = process.env.PORT || 3000;

app.enable('trust proxy');
app.disable('x-powered-by');

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cors());

app.get('/api/account/state/:address?', (req, res) => {
  const address = req.params.address || '435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4';
  const params = { address: Buffer.from(address, 'hex') };
  client.request('get_account_state', params, (error, result) => {
    if (error) return res.json({ error });
    res.json({ result });
  });
});

app.get('/api/account/transaction/:address?/:sequenceNumber?/:fetchEvents?', (req, res) => {
  const address = req.params.address || '435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4';
  const sequenceNumber = req.params.sequenceNumber || 0;
  const fetchEvents = req.params.fetchEvents !== 'false';
  const params = {
    account: Buffer.from(address, 'hex'),
    sequence_number: parseInt(sequenceNumber, 10),
    fetch_events: fetchEvents,
  };
  client.request('get_account_transaction_by_sequence_number', params, (error, result) => {
    if (error) return res.json({ error });
    res.json({ result });
  });
});

app.get('/api/events/:address?/:startEventSeqNum?/:ascending?/:limit?', (req, res) => {
  const address = req.params.address || '435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4';
  const startEventSeqNum = req.params.startEventSeqNum || 0;
  const ascending = req.params.ascending !== 'false';
  const limit = req.params.limit || 10;
  const params = {
    access_path: { address: Buffer.from(address, 'hex') },
    start_event_seq_num: parseInt(startEventSeqNum, 10),
    ascending,
    limit: parseInt(limit, 10),
  };
  client.request('get_events_by_event_access_path', params, (error, result) => {
    if (error) return res.json({ error });
    res.json({ result });
  });
});

app.get('/api/transactions/:startVersion?/:limit?/:fetchEvents?', (req, res) => {
  const { scope } = req.query;
  const startVersion = req.params.startVersion || 0;
  const limit = req.params.limit || 10;
  const fetchEvents = req.params.fetchEvents !== 'false';
  const params = {
    start_version: startVersion,
    limit: parseInt(limit, 10),
    fetch_events: fetchEvents,
  };
  client.request('get_transactions', params, (error, result) => {
    if (error) return res.json({ error });
    const transactions = [];
    result.txn_list_with_proof.transactions.forEach(tx => {
      const decodedTx = { raw_txn: utils.deserializeRawTxnBytes(tx.raw_txn_bytes), ...tx };
      transactions.push(decodedTx);
    });
    result.txn_list_with_proof.transactions = transactions;
    if (scope && has(result, scope))
      return res.json(at(result, scope));
    res.json({ result });
  });
});

app.get('/*', (req, res) => {
  res.json({
    error: "This page isn't available",
    examples: [
      'https://librascript.io/api/account/state/435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4',
      'https://librascript.io/api/account/transaction/435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4/0/true',
      'https://librascript.io/api/events/435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4/0/true/10',
      'https://librascript.io/api/transactions/0/10/true',
      'https://librascript.io/api/transactions/0/10/true?scope=txn_list_with_proof.transactions[0].raw_txn',
    ],
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
