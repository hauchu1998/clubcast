import { useEnsName } from "wagmi";
import {
  isValidAddress,
  useStartConversation,
  useCanMessage,
} from "@xmtp/react-sdk";
import { useCallback, useState } from "react";

interface ConversationProps {
  mode: "chats" | "room" | "new";
  setMode: Function;
  recipient: string;
}
const Conversation = (props: ConversationProps) => {
  const [peerAddress, setPeerAddress] = useState("");
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const ensName = useEnsName({
    address: props.recipient as `0x${string}`,
    staleTime: 10000,
  });
  const { canMessage } = useCanMessage();
  const { startConversation } = useStartConversation();

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPeerAddress(e.target.value);
    },
    []
  );

  const handleCheckAddress = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidAddress(peerAddress)) {
        setIsLoading(true);
        setIsOnNetwork(await canMessage(peerAddress));
        setIsLoading(false);
      } else {
        setIsOnNetwork(false);
      }
    },
    [peerAddress, canMessage]
  );

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleStartConversation = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (peerAddress && message) {
        setIsLoading(true);
        const conversation = await startConversation(peerAddress, message);
        setIsLoading(false);
      }
    },
    [message, peerAddress, startConversation]
  );

  return (
    <form onSubmit={handleCheckAddress}>
      <div className="w-full">
        <input
          name="addressInput"
          type="text"
          onChange={handleAddressChange}
          value={peerAddress}
          disabled={isLoading || props.mode === "room"}
        />
        {!isOnNetwork && peerAddress !== "" && (
          <div>
            <div className="text-red-500">Address is not on XMTP network</div>
          </div>
        )}
      </div>

      <div className="w-full"></div>
      <input
        name="messageInput"
        type="text"
        onChange={handleMessageChange}
        value={message}
        disabled={isLoading || !isValidAddress(peerAddress)}
      />
    </form>
  );
};

export default Conversation;
