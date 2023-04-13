import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App'
import 'bootstrap/dist/css/bootstrap.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId="586322567827-u5j5onfqtfjr5h89546r2rtajjfiqhpp.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
)
