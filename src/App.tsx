import React from "react";
// import "./App.css";
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import ThemeProvider from './theme/index';
import ThemeSettings from "@/components/settings";
import NotistackProvider from "@/components/NotistackProvider";
import {ProgressBarStyle} from "@/components/ProgressBar";
import ScrollToTop from "@/components/ScrollToTop";
import {AuthProvider} from "@/contexts/JWTContext";
import CategoryProvider from "@/provides/Category";
import SolutionCategoryProvider from "@/provides/SolutionCategory";
import AdvantageProvider from "@/provides/Advantage";
import ServicePackProvider from "@/provides/ServicePack";
import BonusServiceProvider from "@/provides/BonusService";
import Router from "@/routes";

function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <NotistackProvider>
            <ProgressBarStyle/>
            <ScrollToTop/>

            <AuthProvider>
              <CategoryProvider>
                <SolutionCategoryProvider>
                  <AdvantageProvider>
                    {/*<QaAProvider>*/}
                    {/*  <PriceProvider>*/}
                        <ServicePackProvider>
                          <BonusServiceProvider>
                            <Router/>
                          </BonusServiceProvider>
                        </ServicePackProvider>
                      {/*</PriceProvider>*/}
                    {/*</QaAProvider>*/}
                  </AdvantageProvider>
                </SolutionCategoryProvider>
              </CategoryProvider>
            </AuthProvider>
          </NotistackProvider>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}

export default App;
