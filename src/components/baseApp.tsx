import React from "react";
import Navbar from "@/components/navbar";
import Inbox from "./xmtp/inbox";
import { useIsConnected } from "@/hooks/useIsConnected";
import { isStringObject } from "util/types";
import { useClient } from "@xmtp/react-sdk";

interface BaseAppProps {
  children: React.ReactNode;
}

const BaseApp = (props: BaseAppProps) => {
  const isConnected = useIsConnected();
  const { client } = useClient();
  return (
    <div className="relative w-full min-h-screen z-10">
      <Navbar />
      {isConnected && client && <Inbox />}

      <div className="w-[82%] mt-16 ">{props.children}</div>
    </div>
  );
};

export default BaseApp;
