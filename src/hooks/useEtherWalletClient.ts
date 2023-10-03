import { ZERO_ADDRESS, SCROLL_ID, SEPOLIA_ID } from "@/constants/networks";
import { useWalletClient } from "wagmi";

const useEtherWalletClient = () => {
  const { data, isLoading, error } = useWalletClient({ chainId: SCROLL_ID });

  const ethersWalletClient = {
    getAddress: async () => {
      const address = data?.account.address || ZERO_ADDRESS;
      return address;
    },
    signMessage: async (message: any) => {
      const signature = await data?.signMessage(message);
      return signature || "";
    },
  };

  const { signMessage, ...rest } = data || {};
  const mergedWalletClient = {
    data: {
      ...ethersWalletClient,
      ...rest,
    },
  };

  return { signer: mergedWalletClient.data, isLoading, error };
};

export default useEtherWalletClient;
