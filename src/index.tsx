import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastContainer } from 'react-toastify';
import { AppProvider } from "./services/context/AppContext";
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AppProvider>
      <ToastContainer />
      <App />
    </AppProvider>
  </React.StrictMode>
);
