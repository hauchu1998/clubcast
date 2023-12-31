import { BsPencilSquare } from "react-icons/bs";
import { MdKeyboardBackspace } from "react-icons/md";
import { useConversations } from "@xmtp/react-sdk";
import ChatHeader from "./header";
import Conversation from "./conversation";
import Messages from "./messages";
import useSelectedConversation from "@/hooks/xmtp/useSelectedConversation";
import ConversationList from "./conversationList";
import { useInboxStore } from "@/store/inbox";

interface InboxProps {
  width: string;
}

const Inbox = ({ width }: InboxProps) => {
  const { mode, setMode, setConversationTopic, setPeerAddress } = useInboxStore(
    (state) => ({
      mode: state.mode,
      setMode: state.setMode,
      setConversationTopic: state.setConversationTopic,
      setPeerAddress: state.setPeerAddress,
    })
  );
  const selectedConversation = useSelectedConversation();
  const { error, isLoading } = useConversations();

  const handleBackToInbox = () => {
    setMode("chats");
    setConversationTopic("");
  };

  const handleNewConversation = () => {
    setMode("new");
    setPeerAddress("");
  };
  if (error) {
    <div
      className={`fixed top-[4.5rem] right-0 ${width} h-[calc(100vh-4.5rem)] border-l border-black px-3 py-2`}
    >
      <div className="text-3xl text-center font-bold">Chats</div>
      <div className="text-red-500">
        An error occurred while loading conversations
      </div>
    </div>;
  }

  if (isLoading) {
    <div
      className={`fixed top-[4.5rem] right-0 ${width} h-[calc(100vh-4.5rem)] border-l border-black px-3 py-2`}
    >
      <div className="text-3xl text-center font-bold">Chats</div>
      <div className="">Loading conversations...</div>
    </div>;
  }

  return (
    <div
      className={`fixed top-[4.5rem] right-0 ${width} h-[calc(100vh-4.5rem)] border-l border-black py-2`}
    >
      <div
        className={`fixed top-[4.5rem] right-0 flex justify-between items-center gap-3 px-3 bg-color ${width} h-[5.5rem] border-l border-b border-black`}
      >
        <button
          className={`${mode === "chats" ? "invisible" : "visible"} `}
          onClick={handleBackToInbox}
        >
          <MdKeyboardBackspace className="text-3xl" />
        </button>
        <ChatHeader />
        <button
          className={`${mode === "chats" ? "visible" : "invisible"} `}
          onClick={handleNewConversation}
        >
          <BsPencilSquare className="text-2xl" />
        </button>
      </div>
      <div className="h-[4.5rem] w-full" />
      {mode === "chats" ? (
        <ConversationList />
      ) : (
        <Conversation width={width}>
          {selectedConversation && (
            <Messages conversation={selectedConversation} />
          )}
        </Conversation>
      )}
    </div>
  );
};

export default Inbox;
