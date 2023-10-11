import { Zilla_Slab, Bangers } from "next/font/google";
export const zillaSlab = Zilla_Slab({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zilla-slab",
});

export const bangers = Bangers({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bangers",
});
