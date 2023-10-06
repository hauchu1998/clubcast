import React from "react";
import Navbar from "@/components/navbar";
import Inbox from "./xmtp/inbox";

interface BaseAppProps {
  children: React.ReactNode;
}

const BaseApp = (props: BaseAppProps) => {
  return (
    <div className="relative w-full min-h-screen z-10">
      <Navbar />
      <Inbox />
      <div className="w-[82%] mt-16 ">{props.children}</div>
    </div>
  );
};

export default BaseApp;
