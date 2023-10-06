import { shortAddress } from "@/helpers/address";
import useSelectedConversation from "@/hooks/xmtp/useSelectedConversation";
import { useInboxStore } from "@/store/inbox";
import { useConversation, useCanMessage } from "@xmtp/react-sdk";
import { useCallback, useState } from "react";
import Blockies from "react-blockies";

const ChatHeader = () => {
  const [isValid, setIsValid] = useState(true);
  const { canMessage } = useCanMessage();
  const { getCachedByPeerAddress } = useConversation();
  const selectedConversation = useSelectedConversation();
  const { mode, setMode, peerAddress, setPeerAddress, setConversationTopic } =
    useInboxStore((state) => ({
      mode: state.mode,
      setMode: state.setMode,
      peerAddress: state.peerAddress,
      setPeerAddress: state.setPeerAddress,
      setConversationTopic: state.setConversationTopic,
    }));

  const handleAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const address = e.target.value;
      setPeerAddress(address);
      setIsValid(false);
      const isOnNetwork = await canMessage(address);
      setIsValid(isOnNetwork);

      if (isValid) {
        const existing = await getCachedByPeerAddress(address);
        if (existing) {
          setConversationTopic(existing.topic);
          setMode("room");
        }
      }
    },
    [
      setPeerAddress,
      canMessage,
      isValid,
      setMode,
      setConversationTopic,
      getCachedByPeerAddress,
    ]
  );

  if (mode === "chats") {
    return (
      <div className="text-3xl text-center font-bold bg-colors">Inbox</div>
    );
  }

  if (mode === "room" && selectedConversation) {
    return (
      <div className="text-center ">
        <div className="flex flex-col items-center justify-center">
          <Blockies
            data-testid="avatar"
            seed={selectedConversation?.peerAddress?.toLowerCase() || ""}
            scale={5}
            size={10}
            className="rounded-full"
          />
          <div className="font-semibold">
            {shortAddress(selectedConversation?.peerAddress || "")}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "new") {
    return (
      <div className="flex gap-2 w-full bg-colors">
        <span className="font-bold text-lg">To:</span>
        <div className="w-full">
          <input
            className="w-full px-1 bg-transparent border-b border-black focus:outline-none focus:border-purple-600"
            value={peerAddress}
            onChange={handleAddressChange}
          />
          <div className={`${!isValid ? "text-red-500" : "hidden"}`}>
            The address is not on XMTP Network
          </div>
        </div>
      </div>
    );
  }
};

export default ChatHeader;
