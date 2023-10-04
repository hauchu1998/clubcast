import { shortAddress } from "@/helpers/address";
import {
  CachedConversation,
  isValidAddress,
  useCanMessage,
} from "@xmtp/react-sdk";
import { useCallback, useState } from "react";
import Blockies from "react-blockies";

interface ChatHeaderProps {
  mode: "chats" | "room" | "new";
  selectedConversation?: CachedConversation;
  newPeerAddress: string;
  onAddressChange: Function;
}

const ChatHeader = (props: ChatHeaderProps) => {
  const { mode, selectedConversation, newPeerAddress, onAddressChange } = props;
  const [isValid, setIsValid] = useState(true);
  const { canMessage } = useCanMessage();

  const handleAddressChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const address = e.target.value;
      onAddressChange(address);
      const isOnNetwork = await canMessage(address);
      setIsValid(isOnNetwork);
    },
    [onAddressChange, canMessage]
  );

  if (mode === "chats") {
    return (
      <div className="text-3xl text-center font-bold bg-colors">Inbox</div>
    );
  }

  if (mode === "room" && selectedConversation) {
    return (
      <div className="text-center bg-colors">
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
            value={newPeerAddress}
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
