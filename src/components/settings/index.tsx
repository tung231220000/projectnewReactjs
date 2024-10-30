import React, {ReactNode} from "react";
import ThemeColorPresets from "@/components/settings/ThemeColorPresets";
import ThemeContrast from "@/components/settings/drawer/ThemeContrast";
import ThemeRtlLayout from "@/components/settings/drawer/ThemeRtlLayout";


type Props = {
  children: ReactNode;
};

export default function ThemeSettings({children}: Props) {
  return (
    <ThemeColorPresets>
      <ThemeContrast>
        <ThemeRtlLayout>
          {children}
          {/* <SettingsDrawer /> */}
        </ThemeRtlLayout>
      </ThemeContrast>
    </ThemeColorPresets>
  );
}