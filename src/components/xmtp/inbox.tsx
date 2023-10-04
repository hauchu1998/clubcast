import { useCallback, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { MdKeyboardBackspace } from "react-icons/md";
import { CachedConversation, useConversations } from "@xmtp/react-sdk";
import ChatWrapper from "./chatWrapper";
import Conversation from "./conversation";
import ChatHeader from "./header";

const Inbox = () => {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"chats" | "room" | "new">("chats");
  const [selectedConversation, setSelectedConversation] = useState<
    CachedConversation | undefined
  >(undefined);
  const [newPeerAddress, setNewPeerAddress] = useState("");
  const { conversations, error, isLoading } = useConversations();

  const handleConversationClick = useCallback((convo: CachedConversation) => {
    setSelectedConversation(convo);
    setMode("room");
  }, []);

  const handleStartNewConversation = useCallback(() => {
    setMode("new");
  }, []);

  const handleStartNewConversationSuccess = useCallback(
    (convo?: CachedConversation) => {
      setSelectedConversation(convo);
      setMode("room");
    },
    []
  );

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
    <div className="fixed top-[4.5rem] right-0 w-[18%] h-[calc(100vh-4.5rem)] border-l border-black py-2">
      <div className="fixed top-[4.5rem] right-0 flex justify-between items-center gap-3 px-3 bg-colors w-[18%] h-[5.5rem] border-l border-black">
        <button
          className={`${mode === "chats" ? "invisible" : "visible"} `}
          onClick={() => setMode("chats")}
        >
          <MdKeyboardBackspace className="text-3xl" />
        </button>
        <ChatHeader
          mode={mode}
          selectedConversation={selectedConversation}
          newPeerAddress={newPeerAddress}
          onAddressChange={setNewPeerAddress}
        />
        <button
          className={`${mode === "chats" ? "visible" : "invisible"} `}
          onClick={handleStartNewConversation}
        >
          <BsPencilSquare className="text-2xl" />
        </button>
      </div>

      <div className="mt-[5.5rem] w-full">
        {mode === "chats" ? (
          conversations.map((conversation) => {
            console.log(conversation);
            return (
              <ChatWrapper
                key={conversation.peerAddress}
                conversation={conversation}
                onConversationClick={handleConversationClick}
              />
            );
          })
        ) : (
          <Conversation
            mode={mode}
            setMode={setMode}
            conversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            peerAddress={newPeerAddress}
            message={message}
            setMessage={setMessage}
          ></Conversation>
        )}
      </div>
    </div>
  );
};

export default Inbox;
