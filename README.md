# Ledger Nano Hardware Interface
Cryptocurrency-oriented communities of both enthusiasts and developers alike have begun to embrace the potential of cold-storage wallets (AKA "hardware wallets") for enacting financial transactions while minimizing the risk of scams. In recognition to that same potential, ARCANE TECHNOLOGIES™ has been in the works for developing special software to interface with the most popular brands of said devices, namely Ledger Nano & Trezor products.

# Libraries
Ever since U2F-Transport was rendered deprecated, alternative technologies were developed for allowing interested programmers to develop and integrate their applications as to communicate with a hardware device. This instance makes use of the Node-HID Transport library to connect native device code with the interface code presented here.

Recommended packages built specifically for supporte cryptocurrencies are featured in code, also note here:
Library                             | In-Code Function
----------------------------------- | ----------------------------------------------------------------------------------
@ledgerhq/hw-transport-node-hid     | Mediates Communication between Device/Interface in most Common Platforms
@ledgerhq/hw-app-btc                | Library for low-level Implementation of the Hardware App for Bitcoin
@ledgerhq/hw-app-eth                | Library for low-level Implementation of the Hardware App for Ethereum
@ledgerhq/hw-app-xrp                | Library for low-level Implementation of the Hardware App for Ripple
ripple-binary-codec                 | Cryptographic Utilities required in Processing Ripple Transactions
arcane-btc-wallet                   | Custom Cryptowallet Software, serving a function for Private BTC Transactions
arcane-bch-wallet                   | Custom Cryptowallet Software, serving a function for Private BCH Transactions
web3.js                             | High-Level ETH Library implementing several useful  Utilities and facilitating the nterfacing with Public Nodes

![Ledger-Desktop Interface](/images/ss1.png)

## Informational Sources
The following sources were also informative and useful in the course of developing this software.
* SLIP-0044               - https://github.com/satoshilabs/slips/blob/master/slip-0044.md
* Electron Documentation  - https://www.electronjs.org/docs
* Ledger Main Repository  - https://github.com/LedgerHQ/ledgerjs
* Ledger Example Programs - https://github.com/LedgerHQ/ledgerjs-examples
