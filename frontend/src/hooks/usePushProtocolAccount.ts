import { useAsync } from "react-async-hook";
import useEtherWalletClient from "./useEtherWalletClient";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { polygonMumbai } from "viem/chains";
import { useNetwork } from "wagmi";

const usePushProtocolAccount = () => {
  const { result: signer } = useEtherWalletClient();
  const { chain } = useNetwork();
  return useAsync(async () => {
    if (!signer || chain?.id !== polygonMumbai.id) return undefined;
    const pushAccount = await PushAPI.initialize(signer, { env: ENV.STAGING });
    return pushAccount;
  }, [signer]);
};
export default usePushProtocolAccount;
