import { useCallback, useState } from "react";
import {
  CachedConversation,
  isValidAddress,
  useSendMessage,
  useStartConversation,
} from "@xmtp/react-sdk";
import { BsImages, BsFillSendFill, BsCameraVideo } from "react-icons/bs";
import { BiMicrophone } from "react-icons/bi";
import { AiOutlineFile } from "react-icons/ai";

interface ConversationProps {
  mode: "chats" | "room" | "new";
  setMode: Function;
  conversation: CachedConversation | undefined;
  setSelectedConversation: Function;
  message: string;
  setMessage: Function;
  peerAddress?: string;
  children?: React.ReactNode;
}
const Conversation = (props: ConversationProps) => {
  const {
    mode,
    setMode,
    conversation,
    setSelectedConversation,
    peerAddress,
    message,
    setMessage,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { startConversation } = useStartConversation();
  const { sendMessage } = useSendMessage();

  const handleMessageChange = useCallback(
    (e: any) => {
      setMessage(e.target.value);
    },
    [setMessage]
  );

  const handleStartConversation = useCallback(async () => {
    if (peerAddress && message) {
      setIsLoading(true);
      const conversation = await startConversation(peerAddress, message);
      setSelectedConversation(conversation);
      setIsLoading(false);
      setMode("room");
    }
  }, [
    message,
    peerAddress,
    startConversation,
    setSelectedConversation,
    setMode,
  ]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (mode === "new") {
        await handleStartConversation();
      } else if (mode === "room") {
        if (
          peerAddress &&
          isValidAddress(peerAddress) &&
          message &&
          conversation
        ) {
          setIsLoading(true);
          await sendMessage(conversation, message);
          setIsLoading(false);
        }
      }
    },
    [
      mode,
      message,
      peerAddress,
      sendMessage,
      conversation,
      handleStartConversation,
    ]
  );

  return (
    <div className="w-full relative">
      {props.children}
      <div className="fixed bottom-0 right-0 gap-5 px-5 py-2  bg-black w-[18%]">
        <textarea
          name="textmessage"
          placeholder="..."
          value={message}
          // rows={1}
          className="rounded-lg px-3 py-1 w-full bg-white "
          onChange={handleMessageChange}
        />
        <div className="mt-1 flex justify-between">
          <div className="flex gap-3">
            <BsImages className="text-white text-2xl" />
            <BsCameraVideo className="text-white text-2xl" />
            <AiOutlineFile className="text-white text-2xl" />
            <BiMicrophone className="text-white text-2xl" />
          </div>
          <button className="text-white text-xl" onClick={handleSendMessage}>
            <BsFillSendFill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
