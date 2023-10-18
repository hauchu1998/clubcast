import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "@/config/wagmiConfig";
import { attachmentContentTypeConfig, XMTPProvider } from "@xmtp/react-sdk";
import BaseApp from "@/components/baseApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DB_VERSION = 1;
const contentTypeConfigs = [attachmentContentTypeConfig];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 2 * 1000, cacheTime: 30 * 60 * 1000 },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
