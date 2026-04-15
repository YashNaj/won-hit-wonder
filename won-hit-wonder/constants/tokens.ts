export const colors = {
  background: "#010101",
  backgroundAlt: "#0b0a17",
  surface: "#1a1a2e",
  purple: "#742fe5",
  purpleAlt: "#7240ff",
  magenta: "#cd04cf",
  hotPink: "#ff1879",
  red: "#fb0d41",
  deepPink: "#d50066",
  deepPinkAlt: "#d50080",
  blue: "#125efe",
  blueAlt: "#1867ff",
  gold: "#fea713",
  goldAlt: "#d59900",
  white: "#ffffff",
  gray: "#d9d9d9",
  grayDark: "#2a2a2a",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  border: "rgba(255, 255, 255, 0.1)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  hero: { fontSize: 44, fontWeight: "700" as const },
  h1: { fontSize: 36, fontWeight: "700" as const },
  h2: { fontSize: 24, fontWeight: "800" as const },
  h3: { fontSize: 20, fontWeight: "700" as const },
  h4: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 14, fontWeight: "400" as const },
  bodySmall: { fontSize: 12, fontWeight: "400" as const },
  caption: { fontSize: 10, fontWeight: "400" as const },
  button: { fontSize: 16, fontWeight: "600" as const },
  countdown: { fontSize: 14, fontWeight: "700" as const },
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
} as const;
