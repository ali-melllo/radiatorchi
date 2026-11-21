import type fa from "../../messages/fa.json";

export type NavKey = keyof (typeof fa)["nav"];

export type NavLink = { href: string; key: NavKey };

export const headerLinks: NavLink[] = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  // { href: "/categories", key: "categories" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/faq", key: "faq" },
];

export const exploreLinks: NavLink[] = [
  { href: "/products", key: "products" },
  { href: "/categories", key: "categories" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/faq", key: "faq" },
];

export const legalLinks: NavLink[] = [
  { href: "/ordering-guide", key: "ordering" },
  { href: "/privacy-policy", key: "privacy" },
  { href: "/terms", key: "terms" },
];
