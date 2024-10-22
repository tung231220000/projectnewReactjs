import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./contexts/SettingContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Create a query client
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </HelmetProvider>
  </QueryClientProvider>
);
