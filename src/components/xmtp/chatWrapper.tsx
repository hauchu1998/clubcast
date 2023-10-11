import { CachedConversation, useLastMessage } from "@xmtp/react-sdk";
import { useEnsName } from "wagmi";
import { isValidLongWalletAddress, shortAddress } from "@/helpers/address";
import Blockies from "react-blockies";
import { address } from "@/types/address";

interface ChatWrapperProps {
  conversation: CachedConversation;
  onConversationClick?: (conversation: CachedConversation) => void;
}
const ChatWrapper = (props: ChatWrapperProps) => {
  const { conversation, onConversationClick } = props;
  const { peerAddress } = conversation;
  const { data: ensName } = useEnsName({
    address: peerAddress as address,
    enabled: isValidLongWalletAddress(peerAddress),
    chainId: 1,
  });

  const lastMessage = useLastMessage(conversation.topic);
  let content = lastMessage?.content
    ? typeof lastMessage.content !== "string"
      ? "Attachment"
      : lastMessage?.content
    : "";

  return (
    <div
      key={conversation.topic}
      className="py-3 w-full grid grid-cols-5 gap-3 cursor-pointer px-2"
      onClick={() => onConversationClick?.(conversation)}
    >
      <div data-testid="avatar" className="flex items-center justify-center">
        <Blockies
          data-testid="avatar"
          seed={peerAddress?.toLowerCase() || ""}
          scale={5}
          size={9}
          className="rounded-full"
        />
      </div>
      <div className="col-span-4 h-full py-1 border-b">
        <div className="text-lg font-bold">
          {shortAddress(peerAddress) || peerAddress}
        </div>
        <div className="truncate">{content}</div>
      </div>
    </div>
  );
};

export default ChatWrapper;
