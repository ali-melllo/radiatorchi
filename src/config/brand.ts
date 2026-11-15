/**
 * Brand identity. Colors live as CSS variables in src/app/globals.css (single source of truth).
 * Replace the SVG placeholders in public/images/logo with the final PNG/SVG logo and update the paths here.
 * "light" is the logo shown on the LIGHT theme, "dark" the one shown on the DARK theme.
 */
export const brand = {
  name: { fa: "رادیاتورچی", en: "Radiatorchi" },
  logo: {
    icon: { src: "/images/logo/radiatorchi-icon.svg", width: 256, height: 256 },
    light: { src: "/images/logo/radiatorchi-logo-light.svg", width: 240, height: 64 },
    dark: { src: "/images/logo/radiatorchi-logo-dark.svg", width: 240, height: 64 },
  },
  themeColor: { light: "#F01420", dark: "#090A0D" },
} as const;
