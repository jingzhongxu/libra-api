[![Join the chat](https://img.shields.io/discord/590507340399116288.svg)](https://discord.gg/XyS25F6)

# Libra REST API

A REST API for Libra blockchain

### API

#### Get account state
Get the latest state for an account.
 
```
/api/account/state/:address?
```
**Example**
https://librascript.io/api/account/state/435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4

#### Get account transaction
Get the committed transaction by account and sequence number.

```
/api/account/transaction/:address?/:sequenceNumber?/:fetchEvents?
```
**Example**
https://librascript.io/api/account/transaction/435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4/0/true

#### Get events
Get event by account and path.

```
/api/events/:address?/:startEventSeqNum?/:ascending?/:limit?
```
**Example**
https://librascript.io/api/events/435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4/0/true/10

#### Get transactions
Get the committed transaction by range

```
/api/transactions/:startVersion?/:limit?/:fetchEvents?
```
**Example**
https://librascript.io/api/transactions/0/10/true

### Getting help

If you believe you're experiencing a bug with or want to report incorrect documentation, open an issue on our issue tracker. For a more real-time avenue of communication, check out the Discord or Telegram servers. There you'll find community members who can help answer about development questions.

* [Join us on Telegram](https://t.me/joinchat/DAQb4RSNpqEok3p-QdmaKQ)
* [Join us on Discord](https://discord.gg/XyS25F6)

## License

[MIT](LICENSE).
