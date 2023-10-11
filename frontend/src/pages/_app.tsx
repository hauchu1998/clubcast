import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "@/config/wagmiConfig";
import { attachmentContentTypeConfig, XMTPProvider } from "@xmtp/react-sdk";
import BaseApp from "@/components/baseApp";

const DB_VERSION = 1;
const contentTypeConfigs = [attachmentContentTypeConfig];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <XMTPProvider
        contentTypeConfigs={contentTypeConfigs}
        dbVersion={DB_VERSION}
      >
        <BaseApp>
          <Component {...pageProps} />
        </BaseApp>
      </XMTPProvider>
    </WagmiConfig>
  );
}
