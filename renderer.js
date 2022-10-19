// const { ipcRenderer } = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
console.log('renderer.js');

const but = document.getElementById('but-test');
const divTest = document.getElementById('div-test');

but.innerText = 'Кнопка';

// MessagePorts are created in pairs. A connected pair of message ports is
// called a channel.
const channel = new MessageChannel();

// The only difference between port1 and port2 is in how you use them. Messages
// sent to port1 will be received by port2 and vice-versa.
const port1 = channel.port1;
const port2 = channel.port2;

// It's OK to send a message on the channel before the other end has registered
// a listener. Messages will be queued until a listener is registered.
port2.postMessage({ answer: 42 });

// Here we send the other end of the channel, port1, to the main process. It's
// also possible to send MessagePorts to other frames, or to Web Workers, etc.
ipcRenderer.postMessage('port', null, [port1]);

but.addEventListener('click', async () => {
  // port2.postMessage(Date.now());

  const result = await ipcRenderer.invoke('test123', Date.now());

  divTest.innerHTML = String(result);
});
