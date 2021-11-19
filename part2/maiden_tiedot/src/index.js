import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <App openweather_api_key={process.env.REACT_APP_OPENWEATHER_API_KEY} />,
  document.getElementById('root')
);
