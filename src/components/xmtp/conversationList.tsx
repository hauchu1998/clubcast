import { type CachedConversation, useConversations } from "@xmtp/react-sdk";
import ChatWrapper from "./chatWrapper";
import { useCallback } from "react";
import { useInboxStore } from "@/store/inbox";

const ConversationList = () => {
  const { conversations } = useConversations();
  const { setMode, setConversationTopic, setPeerAddress } = useInboxStore(
    (state) => ({
      setMode: state.setMode,
      setConversationTopic: state.setConversationTopic,
      setPeerAddress: state.setPeerAddress,
    })
  );
  const handleConversationClick = useCallback(
    (convo: CachedConversation) => {
      setPeerAddress(convo.peerAddress);
      setConversationTopic(convo.topic);
      setMode("room");
    },
    [setConversationTopic, setMode, setPeerAddress]
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
