import {
  scrollSepolia,
  sepolia,
  polygonMumbai,
  mainnet,
  baseGoerli,
  mantleTestnet,
} from "@wagmi/chains";

export const SCROLL_ID = 534353;
export const SCROLL_RPC = "https://sepolia-rpc.scroll.io/";
export const SEPOLIA_ID = 11155111;
export const SEPOLIA_RPC = "https://eth-sepolia-public.unifra.io";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const chains = [
  mainnet,
  scrollSepolia,
  sepolia,
  polygonMumbai,
  baseGoerli,
  mantleTestnet,
];

export const networksIcon: { [key: string]: string } = {
  "43114": "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  "11155111":
    "https://img.foresightnews.pro/202302/842-1676968867373.png?x-oss-process=style/article_avatar",
  "5": "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
  "59140":
    "https://pbs.twimg.com/profile_images/1639402103486521344/erDLnbwE_400x400.jpg",
  "80001":
    "https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png",
  "534351":
    "https://img.foresightnews.pro/202302/842-1676968867373.png?x-oss-process=style/article_avatar",
  "5001":
    "https://pbs.twimg.com/profile_images/1597775748580134914/bLhE1aY1_400x400.jpg",
  "84531":
    "data:image/jpeg;base64,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",
};
