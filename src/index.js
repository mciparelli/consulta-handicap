import React from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import App from './app';
import './index.css';

ReactDOM.render(
  <ThemeProvider
    theme={createMuiTheme({
      overrides: {
        MuiTableCell: {
          head: {
            fontWeight: 600,
          },
        },
      },
    })}
  >
    <SWRConfig
      value={{ fetcher: (key) => fetch(key).then((res) => res.json()) }}
    >
      <App />
    </SWRConfig>
  </ThemeProvider>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
