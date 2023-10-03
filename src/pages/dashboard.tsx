import { useAccount } from "wagmi";
// import { useIsConnected } from "@/hooks/useIsConnected";
import { useEffect } from "react";
import { useRouter } from "next/router";
import BaseApp from "@/components/baseApp";

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  useEffect(() => {
    if (!isConnected) {
      router.replace("/login");
    }
  }, [isConnected, router]);
  return (
    <BaseApp>
      <div className="w-full">asdf</div>
    </BaseApp>
  );
};

export default Dashboard;
