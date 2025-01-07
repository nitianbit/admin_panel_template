import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastContainer } from 'react-toastify';
import { AppProvider } from "./services/context/AppContext";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
      <AppProvider>
        <ToastContainer />
        <App />
      </AppProvider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);
