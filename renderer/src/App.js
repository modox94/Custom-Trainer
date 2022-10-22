import logo from './logo.svg';
import './App.css';
import { useGetCadenceQuery } from './api/ipc';

function App() {
  const cadence = useGetCadenceQuery();

  // console.log('cadence', cadence.data);

  // window.electron.ipcRenderer.on('ipc-example', (...args) => {
  //   // eslint-disable-next-line no-console
  //   console.log('ipc-example', ...args);
  // });
  // window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.{cadence?.data}
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
