import React from 'react';
import ReactDOM from 'react-dom';
import './css/global.css';
import App from './App';

// ReactDOM.render(<App />, document.getElementById("root"));

ReactDOM.render(
  <React.StrictMode>
    <title>Cosmo</title>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
