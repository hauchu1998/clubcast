import { useMemo } from "react";
import { useSwitchNetwork } from "wagmi";

interface SwitchNetworkButtonProps {
  chainId: number;
}

const SwitchNetworkButton = ({ chainId }: SwitchNetworkButtonProps) => {
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const targetChain = useMemo(() => {
    return chains?.filter((x) => x.id === chainId)[0];
  }, [chainId, chains]);

  if (targetChain === undefined)
    return <div className="text-center text-red-500">errors</div>;

  return (
    <div className="flex flex-col items-center ">
      <button
        className="bg-black text-white px-3 py-1 rounded-lg font-bold text-xl"
        disabled={!switchNetwork}
        onClick={() => switchNetwork?.(targetChain.id)}
      >
        Switch to {targetChain.name}
        {isLoading && pendingChainId === targetChain.id && " (switching)"}
      </button>

      <div className="text-red-500">{error && error.message}</div>
    </div>
  );
};

export default SwitchNetworkButton;
