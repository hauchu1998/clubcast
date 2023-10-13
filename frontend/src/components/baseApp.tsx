import React from "react";
import Navbar from "@/components/navbar";
import Inbox from "./xmtp/inbox";
import { useIsConnected } from "@/hooks/useIsConnected";
import { zillaSlab } from "@/styles/fonts";
import { useClient } from "@xmtp/react-sdk";

interface BaseAppProps {
  children: React.ReactNode;
}

const BaseApp = (props: BaseAppProps) => {
  const isConnected = useIsConnected();
  const { client } = useClient();
  return (
    <div className={`h-screen w-full z-10 ${zillaSlab.className}`}>
      <Navbar />
      {isConnected && client && <Inbox width="w-[20%]" />}
      <div className="h-16"></div>
      <div className="w-[80%]">{props.children}</div>
    </div>
  );
};

export default BaseApp;
