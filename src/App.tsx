import React from "react";
// import "./App.css";
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import ThemeProvider from './theme/index';

function App() {

  return (
    <MotionLazyContainer>
      <ThemeProvider></ThemeProvider>
    </MotionLazyContainer>
  );
}

export default App;
