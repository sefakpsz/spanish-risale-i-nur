import React from "react";
import Svg, { Path } from "react-native-svg";

type BookmarkIconProps = {
  color: string;
  size?: number;
  filled?: boolean;
};

/** A restrained ribbon mark that matches the reader's book and folio styling. */
export function BookmarkIcon({ color, size = 24, filled = false }: BookmarkIconProps) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessible={false}>
    <Path
      d="M7.25 3.5h9.5a1.5 1.5 0 0 1 1.5 1.5v15.25L12 16.4l-6.25 3.85V5a1.5 1.5 0 0 1 1.5-1.5Z"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>;
}
