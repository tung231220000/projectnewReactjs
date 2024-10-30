import React from "react";
// import "./App.css";
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import ThemeProvider from './theme/index';
import ThemeSettings from "@/components/settings";
import NotistackProvider from "@/components/NotistackProvider";
import {ProgressBarStyle} from "@/components/ProgressBar";
import ScrollToTop from "@/components/ScrollToTop";

function App() {

  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <NotistackProvider>
            <ProgressBarStyle />
            <ScrollToTop />
          </NotistackProvider>
        </ThemeSettings>
      </ThemeProvider>

    </MotionLazyContainer>
  );
}

export default App;
