import { useConversation } from "@xmtp/react-sdk";
import type { CachedConversationWithId } from "@xmtp/react-sdk";
import { useEffect, useState } from "react";
import { useInboxStore } from "@/store/inbox";

const useSelectedConversation = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    CachedConversationWithId | undefined
  >();
  const { getCachedByTopic } = useConversation();
  const conversationTopic = useInboxStore((state) => state.conversationTopic);

  useEffect(() => {
    const getSelectedConversation = async () => {
      if (conversationTopic) {
        const conversation = await getCachedByTopic(conversationTopic);
        setSelectedConversation(conversation);
      } else {
        setSelectedConversation(undefined);
      }
    };
    void getSelectedConversation();
  }, [conversationTopic, getCachedByTopic]);

  return selectedConversation;
};

export default useSelectedConversation;
