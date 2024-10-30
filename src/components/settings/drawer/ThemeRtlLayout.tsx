import {useTheme} from "@mui/material/styles";
import React, {ReactNode, useEffect} from "react";
import createCache from "@emotion/cache";
import {CacheProvider} from "@emotion/react";

type Props = {
  children: ReactNode;
};
export default function ThemeRtlLayout({ children }: Props) {
  const theme = useTheme();

  useEffect(() => {
    document.dir = theme.direction;
  }, [theme.direction]);

  const cacheRtl = createCache({
    key: theme.direction === "rtl" ? "rtl" : "css",
    stylisPlugins: theme.direction === "rtl" ? [] : [],
  });

  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}