import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoReturnDownBack } from "react-icons/io5";
import {
  CachedConversation,
  useConversations,
  useLastMessage,
} from "@xmtp/react-sdk";
import {
  ConversationList,
  ConversationPreviewCard,
  shortAddress,
} from "@xmtp/react-components";
import { useEnsAvatar, useEnsName } from "wagmi";
import { isValidLongWalletAddress } from "@/helpers/address";

const Inbox = () => {
  const [mode, setMode] = useState<"chats" | "room" | "new">("chats");
  const { conversations, error, isLoading } = useConversations();

  if (error) {
    <div className="fixed top-[4.5rem] right-0 w-[18%] h-[calc(100vh-4.5rem)] border-l border-black px-3 py-2">
      <div className="text-3xl text-center font-bold">Chats</div>
      <div className="text-red-500">
        An error occurred while loading conversations
      </div>
    </div>;
  }

  if (isLoading) {
    <div className="fixed top-[4.5rem] right-0 w-[18%] h-[calc(100vh-4.5rem)] border-l border-black px-3 py-2">
      <div className="text-3xl text-center font-bold">Chats</div>
      <div className="">Loading conversations...</div>
    </div>;
  }

  return (
    <div className="fixed top-[4.5rem] right-0 w-[18%] h-[calc(100vh-4.5rem)] border-l border-black px-3 py-2">
      <button
        className={`${mode === "chats" ? "hidden" : ""} absolute top-4 right-5`}
        onClick={() => setMode("chats")}
      >
        <IoReturnDownBack className="text-xl" />
      </button>
      <div className="text-3xl text-center font-bold">Inbox</div>
      <button
        className={`${mode === "new" ? "hidden" : ""} absolute top-4 right-5`}
        onClick={() => setMode("new")}
      >
        <BsPencilSquare className="text-xl" />
      </button>
      <div className="w-full">
        {mode === "chats" ? (
          conversations.map((conversation) => {
            console.log(conversation);
            return (
              <ChatWrapper
                key={conversation.peerAddress}
                conversation={conversation}
              />
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Inbox;

interface ChatProps {
  conversation: CachedConversation;
  selectedConversation?: CachedConversation;
  onConversationClick?: (conversation: CachedConversation) => void;
}
const ChatWrapper = (props: ChatProps) => {
  const { conversation, selectedConversation, onConversationClick } = props;
  const { peerAddress } = conversation;
  const { data: ensName } = useEnsName({
    address: peerAddress as `0x${string}`,
    enabled: isValidLongWalletAddress(peerAddress),
    staleTime: 10000,
  });

  const lastMessage = useLastMessage(conversation.topic);
  let content = lastMessage?.content
    ? typeof lastMessage.content !== "string"
      ? "Attachment"
      : lastMessage?.content
    : undefined;

  // return (
  //   <div className="py-3 w-full grid grid-cols-5 gap-3">
  //     <div className="flex items-center justify-center">
  //       <div className="w-14 h-14 rounded-full bg-blue-500" />
  //     </div>
  //     <div className="col-span-4 h-full py-1 border-b">
  //       <div className="text-xl font-bold">{ensName || peerAddress || ""}</div>
  //       <div className="text-lg">{messages[-1]}</div>
  //     </div>
  //   </div>
  // );
  return (
    <ConversationPreviewCard
      key={conversation.topic}
      text={content}
      displayAddress={ensName || shortAddress(peerAddress) || peerAddress}
      isSelected={conversation.topic === selectedConversation?.topic}
      onClick={() => {
        if (!!onConversationClick) onConversationClick(conversation);
      }}
      avatarUrl=""
      address={peerAddress}
    />
  );
};
