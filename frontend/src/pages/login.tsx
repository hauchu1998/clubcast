import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useConnect } from "wagmi";
import { useIsConnected } from "@/hooks/useIsConnected";
import { Client } from "@xmtp/xmtp-js";
import useEtherWalletClient from "@/hooks/useEtherWalletClient";
import { useClient } from "@xmtp/react-sdk";
import { getAppVersion } from "@/helpers/appVersion";

const icons = ["/wallet_icons/coinbase.svg", "/wallet_icons/metamask.png"];

const Login = () => {
  const router = useRouter();
  const [steps, setSteps] = useState<number>(0);
  const isConnected = useIsConnected();
  const { result: signer } = useEtherWalletClient();
  const { initialize } = useClient();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const handleInitXmtp = useCallback(async () => {
    if (!signer || !isConnected) return;
    const keys = await Client.getKeys(signer!);
    try {
      await initialize({
        keys,
        signer,
        options: {
          // persistConversations: false,
          env: "production",
          appVersion: getAppVersion(),
        },
      });
      setSteps(2);
      router.replace("/dashboard");
    } catch (e) {
      console.log(e);
    }
  }, [initialize, signer, isConnected, router]);

  const walletConnect = (connector: any) => {
    connect({ connector });
    setSteps(1);
  };

  return (
    <div
      className={`fixed top-0 left-0 flex w-screen h-screen flex-col items-center justify-center p-24 z-50 bg-color`}
    >
      <Image
        src="/logo4.png"
        alt="PodCast Logo"
        width={800}
        height={200}
        priority
      />
      {steps === 0 ? (
        <div className="mt-12 grid grid-rows-4 gap-4 w-64">
          {connectors.map((connector, index) => (
            <button
              className="bg-black text-xl text-white font-bold py-2 px-4 rounded-full flex items-center gap-4"
              // disabled={!connector.ready}
              key={connector.id}
              onClick={() => walletConnect(connector)}
            >
              <Image
                src={icons[index]}
                alt={`${connector.name} Logo`}
                width={32}
                height={32}
              />
              <div className="w-full text-center">
                {connector.name}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  " (connecting)"}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <button
          className="mt-12 w-64 bg-black text-xl text-white font-bold py-2 px-4 rounded-full"
          onClick={handleInitXmtp}
        >
          Connected to XMTP
        </button>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-lg">{error.message}</div>
      )}
    </div>
  );
};

export default Login;
