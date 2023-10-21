import { useAsync } from "react-async-hook";
import useEtherWalletClient from "./useEtherWalletClient";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { polygonMumbai } from "viem/chains";
import { useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { push } from "firebase/database";

const usePushProtocolAccount = () => {
  const { result: signer } = useEtherWalletClient();
  const { chain } = useNetwork();
  const [pushAccount, setPushAccount] = useState<PushAPI | undefined>(
    undefined
  );

  useEffect(() => {
    const initialize = async () => {
      if (!signer || chain?.id !== polygonMumbai.id) return undefined;
      const pushAccount = await PushAPI.initialize(signer, {
        env: ENV.STAGING,
      });
      setPushAccount(pushAccount);
    };
    initialize();
  }, [signer, chain]);

  pushAccount?.stream.on("STREAM.NOTIF", (data) => {
    console.log(data);
  });

  return { userPushAccount: pushAccount };
};

export default usePushProtocolAccount;
