import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useConnect } from "wagmi";
import { useIsConnected } from "@/hooks/useIsConnected";
import { Client } from "@xmtp/xmtp-js";
import useEtherWalletClient from "@/hooks/useEtherWalletClient";
import { useClient } from "@xmtp/react-sdk";

const icons = ["/wallet_icons/coinbase.svg", "/wallet_icons/metamask.png"];

const Login = () => {
  const router = useRouter();
  const [steps, setSteps] = useState<number>(0);
  const isConnected = useIsConnected();
  const { signer } = useEtherWalletClient();
  const { initialize } = useClient();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const handleInitXmtp = useCallback(async () => {
    const keys = await Client.getKeys(signer);
    await initialize({
      keys,
      signer,
      options: {
        env: "production",
      },
    });
    setSteps(2);
  }, [initialize, signer]);

  const walletConnect = (connector: any) => {
    connect({ connector });
    setSteps(1);
  };

  useEffect(() => {
    // console.log(isConnected, steps);
    if (isConnected && steps === 0) {
      setSteps(1);
    }
    if (isConnected && steps === 2) {
      router.replace("/dashboard");
    }
  }, [isConnected, router, steps]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <Image
        src="/logo.png"
        alt="Wagmi Logo"
        width={800}
        height={200}
        priority
      />
      {steps === 0 ? (
        <div className="grid grid-rows-4 gap-4 w-64">
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
          className="w-64 bg-black text-xl text-white font-bold py-2 px-4 rounded-full"
          onClick={handleInitXmtp}
        >
          Connected to XMTP
        </button>
      )}

      {error && (
        <div className="mt-4 text-red-500 text-lg">{error.message}</div>
      )}
    </main>
  );
};

export default Login;
