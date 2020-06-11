import __SNOWPACK_ENV__ from '/__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from '/web_modules/react.js';
import ReactDOM from '/web_modules/react-dom.js';
import { SWRConfig } from '/web_modules/swr.js';
import { createMuiTheme, ThemeProvider } from '/web_modules/@material-ui/core/styles.js';
import App from './app.js';
import './index.css.proxy.js';
ReactDOM.render( /*#__PURE__*/React.createElement(ThemeProvider, {
  theme: createMuiTheme({
    overrides: {
      MuiTableCell: {
        head: {
          fontWeight: 600
        }
      }
    }
  })
}, /*#__PURE__*/React.createElement(SWRConfig, {
  value: {
    fetcher: key => fetch(key).then(res => res.json())
  }
}, /*#__PURE__*/React.createElement(App, null))), document.getElementById('root')); // Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement

if (import.meta.hot) {
  import.meta.hot.accept();
}