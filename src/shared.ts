import type { AppContext } from "./context";

export const Categories = [
  { key: "encdec", label: "Encoders / Decoders" },
  // { key: "token", label: "Tokens" },
] as const;

// export type CategoryKey = typeof Categories[number]["key"];
export type CategoryKey = string;

export interface Category {
  key: CategoryKey;
  label: string;
}

export const Tools = [
  { key: "home", label: "Home", title: "Home" },
  { key: "base64", label: "Base 64", title: "Base 64 Decoder and Encoder", category: "encdec" },
  { key: "url", label: "URL", title: "URL Decoder and Encoder", category: "encdec" },
  { key: "html", label: "HTML", title: "HTML Decoder and Encoder", category: "encdec" },
  { key: "jwt", label: "JWT", title: "JWT Decoder", category: "encdec" },
] as const;

// export type ToolKey = typeof Tools[number]["key"];
export type ToolKey = string;

export interface Tool {
  key: ToolKey;
  title: string;
  label: string;
  category?: CategoryKey;
}

export type { AppContext };
