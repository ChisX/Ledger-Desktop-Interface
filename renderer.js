// Imports
  // DOM Selections
let log = document.getElementById('log')
let btn1 = document.getElementById('get-address')
let btn2 = document.getElementById('sign-tx')
let inp1 = document.getElementById('tx-amount')
let inp2 = document.getElementById('tx-target')
let inp3 = document.getElementById('tx-prvkey')
let currency = document.getElementById('coin')
let sheen = document.getElementsByClassName('sheen')[0]
  // Modules
let {ipcRenderer} = require('electron')

// Event Listeners -- FROM: Main Window
currency.addEventListener('change',() => {
  sheen.classList.toggle('active')
  setTimeout(() => sheen.classList.toggle('active'),1000)
})

btn1.onclick = () => ipcRenderer.send('getPublicKey',[currency.value])
btn2.onclick = () => ipcRenderer.send('makePayments',[currency.value,inp1.value,inp2.value,inp3.value])

// Event Listeners -- FROM: Main Process
ipcRenderer.on('getPublicKey',(event,arg) => {printLog(`Your Address: ${JSON.stringify(arg)}`)})
ipcRenderer.on('makePayments',(event,arg) => {printLog(`Your TX ID: ${JSON.stringify(arg)}`)})

// Helper Functions
function printLog(data) {
  log.value = JSON.stringify(data)
}