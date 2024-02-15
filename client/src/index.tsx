import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactGA from 'react-ga'

import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'

// common
import { ChainProvider } from 'common/providers/ChainProvider'
import { ThemeProvider } from 'common/providers/ThemeProvider'
import { WalletProvider } from 'common/providers/WalletProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const TRACKING_ID = 'G-DNQ9MV52RW' // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID)

root.render(
  <React.StrictMode>
    <ChainProvider>
      <ThemeProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </ThemeProvider>
    </ChainProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
