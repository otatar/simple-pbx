export const iconColorMap = {
  blue: "text-app-blue",
  red: "text-app-red",
  green: "text-app-green",
  orange: "text-app-orange",
  yellow: "text-app-yellow",
  violet: "text-app-violet",
  pink: "text-app-pink",
} as const;

// Typescript tip:
export type IconColor = keyof typeof iconColorMap;
