import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function IndexPage() {
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      Router.replace("/login");
    } else {
      Router.replace("/dashboard");
    }
  }, [isConnected]);
  return <div>Welcome</div>;
}
