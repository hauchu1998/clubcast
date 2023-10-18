import { ZERO_ADDRESS } from "@/constants/networks";
import { type WalletClient, useNetwork, useAccount } from "wagmi";
import { getWalletClient } from "@wagmi/core";
import { providers, Signer } from "ethers";
import { useIsConnected } from "./useIsConnected";
import { useAsync } from "react-async-hook";

const useEtherWalletClient = () => {
  const isConnect = useIsConnected();
  const { address } = useAccount();
  const { chain } = useNetwork();

  function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    const currSigner = provider.getSigner(account.address);
    return currSigner as Signer;
  }

  return useAsync(async () => {
    const walletClient = await getWalletClient({ chainId: chain?.id });
    if (!walletClient) return undefined;
    return walletClientToSigner(walletClient);
  }, [isConnect, chain, address]);
};

export default useEtherWalletClient;
