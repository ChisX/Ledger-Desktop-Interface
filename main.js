// Imports
require("babel-polyfill")
let {app,BrowserWindow,ipcMain} = require("electron")
let Transport = require("@ledgerhq/hw-transport-node-hid").default
// Add my Own BTC/BCH Wallet Modules
let AppBtc    = require("@ledgerhq/hw-app-btc").default
let AppEth    = require("@ledgerhq/hw-app-eth").default
let AppXrp    = require("@ledgerhq/hw-app-xrp").default
let encode    = require('ripple-binary-codec').encode
let WEB3      = require('web3')

function createWindow() {
  mainWindow = new BrowserWindow({width:800,height:600})
  mainWindow.loadFile('index.html')
  mainWindow.on('closed',() => {mainWindow = null})

  // Event Listeners
  ipcMain.on("getPublicKey",(event,arg) => getPubKey(...arg).then(res => mainWindow.webContents.send("getPublicKey",res)))
  ipcMain.on("makePayments",(event,arg) => sendFunds(...arg).then(res => mainWindow.webContents.send("makePayments",res)))
}

function getPubKey(coin='btc') {
  return Transport.open('').then(transport => {
    transport.setDebugMode(true)
    let crypto,method,path
    switch (coin) {
      case 'btc':
        crypto = new AppBtc(transport)
        method = 'getWalletPublicKey'
        path   = "44'/0'/0'/0/0"
        break
      case 'bch':
        crypto = new AppBtc(transport)
        method = 'getWalletPublicKey'
        path   = "44'/145'/0'/0/0"
        break
      case 'eth':
        crypto = new AppEth(transport)
        method = 'getAddress'
        path   = "44'/60'/0'/0/0"
        break
      case 'xrp':
        crypto = new AppXrp(transport)
        method = 'getAddress'
        path   = "44'/144'/0'/0/0"
        break
      default: return 'ERROR: Currency not Supported'
    }

    return crypto[method](path).then(r => transport.close().catch(e => {}).then(() => r))
  }).catch(err => console.error(err))
}

function sendFunds(coin='btc',amount,dest,privateKey) {
  return Transport.open('').then(async transport => {
    transport.setDebugMode(true)
    let crypto,method,path,params
    switch (coin) {
      case 'btc': return BTC.sendBTC(amount,dest,privateKey)
      case 'bch': return BCH.sendBCH(privateKey,dest,amount)
      case 'eth':
        crypto = new AppEth(transport)
        method = 'signTransaction'
        path   = "44'/60'/0'/0/0"
        params = rawTxHex(amount,dest)
        break
      case 'xrp':
        crypto = new AppXrp(transport)
        method = 'signTransaction'
        path   = "44'/144'/0'/0/0"
        let info = await getPubKey('xrp')
        params = encode({
          TransactionType: "Payment", Account: info.address,
          Destination: dest,Amount: amount,
          Fee: feeXRP,Flags: 2147483648,Sequence: '123',
          SigningPubKey: info.publicKey.toUpperCase()
        })
        break
      default: return 'ERROR: Currency not Supported'
    }
    
    return crypto[method](path,params).then(r => transport.close().catch(e => {}).then(() => r))
  }).catch(err => console.error(err))
}

// Helper Functions
  // Returns the Raw ETH TX-Hex from a TX-Object
async function rawTxHex(TxAmount,ReceiveAddress) {
  let SenderAddress = await getPubKey('eth')
  return new Promise((resolve,reject) => {
    try {
      web3.eth.getTransactionCount(SenderAddress,(err,txcount) => {
        if (err) reject(err)
        this.getGasPrices().then(gasPrices => {
          // Prepare Transaction Object
          let TxObject = {
            nonce: WEB3.utils.toHex(txcount),
            to: ReceiveAddress,
            value: WEB3.utils.toHex(WEB3.utils.toWei(TxAmount.toString(),'ether')),
            gasLimit: WEB3.utils.toHex(21000),
            gasPrice: WEB3.utils.toHex(WEB3.utils.toWei('10','gwei'))
          }

          // Serialize Transaction
          let tx = new Tx(TxObject,{'chain':'main'})
          let serializedTx = tx.serialize()
          let RawT = '0x' + serializedTx.toString('hex')
          resolve(RawT)
        })
      })
    } catch (err) { reject(err) }
  })
}
