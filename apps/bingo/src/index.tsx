/*
 * Bingo Game
 * Copyright © 2026 Scott Reinhart. All Rights Reserved.
 * PROPRIETARY & CONFIDENTIAL
 * Unauthorized reproduction, distribution, or use is strictly prohibited.
 * See LICENSE file for full terms and conditions.
 */

import './styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { SoundProvider, ThemeProvider } from '@/app'
import { ErrorBoundary } from '@/ui/atoms'
import { App } from '@/ui/organisms'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SoundProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
