import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import {App} from './App.jsx';
import UserProvider from './context/UserProvider.jsx';


createRoot(document.getElementById('root')).render(
  //<StrictMode>
  // <App />
  //</StrictMode>,
  
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
)
