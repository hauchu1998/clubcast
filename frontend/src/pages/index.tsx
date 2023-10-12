import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function IndexPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [isConnected, router]);
  return <div>Welcome</div>;
}
