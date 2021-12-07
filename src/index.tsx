/* eslint-disable import/first */

// import font-awesome css manually to prevent violating the CSP
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "../node_modules/@fortawesome/fontawesome-svg-core/styles.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AuthProvider } from "./providers/Auth";
import { ToastProvider } from "./providers/Toasts";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
