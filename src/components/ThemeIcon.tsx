import React from "react";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

type ThemeIconProps = {
  mode: "system" | "light" | "dark";
  color: string;
};

export function ThemeIcon({ mode, color }: ThemeIconProps) {
  return <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" accessible={false}>
    {mode === "system" ? <>
      <Rect x={3.25} y={4.5} width={17.5} height={13} rx={2} stroke={color} strokeWidth={1.7} />
      <Line x1={9} y1={20.25} x2={15} y2={20.25} stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Line x1={12} y1={17.5} x2={12} y2={20.25} stroke={color} strokeWidth={1.7} />
    </> : mode === "light" ? <>
      <Circle cx={12} cy={12} r={3.5} stroke={color} strokeWidth={1.7} />
      <Path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28l1.42 1.42m10.6 10.6 1.42 1.42M18.72 5.28 17.3 6.7M6.7 17.3l-1.42 1.42" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </> : <Path d="M20.2 14.7A8.5 8.5 0 0 1 9.3 3.8a8.5 8.5 0 1 0 10.9 10.9Z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />}
  </Svg>;
}
