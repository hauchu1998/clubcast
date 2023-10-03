import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { zillaSlab } from "@/styles/fonts";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "@/config/wagmiConfig";
import { XMTPProvider } from "@xmtp/react-sdk";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <XMTPProvider>
        <main className={zillaSlab.className}>
          <Component {...pageProps} />
        </main>
      </XMTPProvider>
    </WagmiConfig>
  );
}
