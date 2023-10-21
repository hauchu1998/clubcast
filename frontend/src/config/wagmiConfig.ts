import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { configureChains, createConfig, createStorage } from "wagmi";
import { EthereumClient, w3mProvider } from "@web3modal/ethereum";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { chains } from "@/constants/networks";
import { InjectedConnector } from "wagmi/connectors/injected";

// Replace the chains and providers with the ones used by your app.
// https://wagmi.sh/react/providers/configuring-chains
const projectId = process.env.NEXT_PUBLIC_WAGMI_PROJECT_ID || "";
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID || "";
const { publicClient } = configureChains(chains, [
  infuraProvider({ apiKey: infuraId }),
  publicProvider(),
]);

export const connectors = [
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "podcast",
    },
  }),
  new MetaMaskConnector({
    chains,
  }),
  //   new WalletConnectConnector({
  //     chains,
  //     options: {
  //       projectId,
  //     },
  //   }),
  //   new InjectedConnector({
  //     chains,
  //     options: {
  //       name: "Injected",
  //       shimDisconnect: true,
  //     },
  //   }),
];

export const noopStorage = {
  getItem: (_key: string) => "",
  setItem: (_key: string, _value: string) => null,
  removeItem: (_key: string) => null,
};

const storage = createStorage({
  storage: noopStorage,
});

export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: connectors,
  publicClient,
  // storage,
});
export const ethereumClient = new EthereumClient(wagmiConfig, chains);
