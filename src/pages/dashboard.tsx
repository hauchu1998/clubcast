import { useAccount } from "wagmi";
import { useEnsName } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import BaseApp from "@/components/baseApp";
import type { address } from "@/types/address";
import Blockies from "react-blockies";

const Dashboard = () => {
  const { address: walletAddress, isConnected } = useAccount();
  const { data: ensName } = useEnsName({
    address: walletAddress as address,
  });
  const router = useRouter();
  useEffect(() => {
    if (!isConnected) {
      router.replace("/login");
    }
  }, [isConnected, router]);
  return (
    <BaseApp>
      <div className="w-full py-3">
        <div className="w-full px-10 py-3 flex gap-5 items-center">
          <div
            data-testid="avatar"
            className="flex items-center justify-center"
          >
            <Blockies
              data-testid="avatar"
              seed={walletAddress?.toLowerCase() || "default_profile"}
              scale={5}
              size={20}
              className="rounded-full"
            />
          </div>
          <div className="font-bold">
            <div className=" text-2xl">{walletAddress}</div>
            <button className="mt-1 bg-blue-400 px-4 py-1 text-white rounded-full">
              {ensName ?? "register ENS"}
            </button>
          </div>
        </div>
      </div>
    </BaseApp>
  );
};

export default Dashboard;
