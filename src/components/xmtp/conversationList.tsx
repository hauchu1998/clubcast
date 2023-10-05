import { type CachedConversation, useConversations } from "@xmtp/react-sdk";
import ChatWrapper from "./chatWrapper";
import { useCallback } from "react";
import { useInboxStore } from "@/store/inbox";

const ConversationList = () => {
  const { conversations } = useConversations();
  const { setMode, setConversationTopic } = useInboxStore((state) => ({
    setMode: state.setMode,
    setConversationTopic: state.setConversationTopic,
  }));
  const handleConversationClick = useCallback(
    (convo: CachedConversation) => {
      setConversationTopic(convo.topic);
      setMode("room");
    },
    [setConversationTopic, setMode]
  );

  return (
    <div className="w-full">
      {conversations.map((conversation) => {
        return (
          <ChatWrapper
            key={conversation.peerAddress}
            conversation={conversation}
            onConversationClick={handleConversationClick}
          />
        );
      })}
    </div>
  );
};

export default ConversationList;
