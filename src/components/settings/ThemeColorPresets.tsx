import React, {ReactNode, useMemo} from "react";
import {alpha, createTheme, ThemeProvider, useTheme} from "@mui/material/styles";
import useSettings from "@/hooks/useSettings";
import ComponentsOverride from "@/theme/overrides";


type Props = {
  children: ReactNode;
};

export default function ThemeColorPresets({children}: Props) {
  const defaultTheme = useTheme();

  const {setColor} = useSettings();

  const themeOptions = useMemo(
    () => ({
      ...defaultTheme,
      palette: {
        ...defaultTheme.palette,
        primary: setColor,
      },
      customShadows: {
        ...defaultTheme.customShadows,
        primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
      },
    }),
    [setColor, defaultTheme]
  );

  const theme = createTheme(themeOptions);

  theme.components = ComponentsOverride(theme);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}