import { useCallback, useRef, useState } from "react";
import {
  CachedConversation,
  isValidAddress,
  useSendMessage,
  useStartConversation,
} from "@xmtp/react-sdk";
import { BsImages, BsFillSendFill, BsCameraVideo } from "react-icons/bs";
import { BiMicrophone } from "react-icons/bi";
import { AiOutlineFile } from "react-icons/ai";
import { useInboxStore } from "@/store/inbox";
import useSelectedConversation from "@/hooks/useSelectedConversation";

interface ConversationProps {
  children?: React.ReactNode;
}
const Conversation = (props: ConversationProps) => {
  const [message, setMessage] = useState("");
  const { mode, setMode, peerAddress, setConversationTopic } = useInboxStore(
    (state) => ({
      mode: state.mode,
      setMode: state.setMode,
      peerAddress: state.peerAddress,
      setPeerAddress: state.setPeerAddress,
      setConversationTopic: state.setConversationTopic,
    })
  );
  const selectedConversation = useSelectedConversation();
  const { startConversation } = useStartConversation();
  const { sendMessage } = useSendMessage();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleMessageChange = useCallback(
    (e: any) => {
      setMessage(e.target.value);
    },
    [setMessage]
  );

  const handleStartConversation = useCallback(async () => {
    if (peerAddress && message) {
      const { cachedConversation } = await startConversation(
        peerAddress,
        message
      );
      if (cachedConversation) {
        setConversationTopic(cachedConversation.topic);
        setMode("room");
      }
    }
  }, [message, peerAddress, startConversation, setConversationTopic, setMode]);

  const handleSendMessage = useCallback(async () => {
    if (mode === "new") {
      await handleStartConversation();
    } else if (mode === "room") {
      if (
        selectedConversation?.peerAddress &&
        isValidAddress(selectedConversation?.peerAddress) &&
        message &&
        selectedConversation
      ) {
        const res = await sendMessage(selectedConversation, message);
      }
    }
    setMessage("");
  }, [
    mode,
    message,
    sendMessage,
    selectedConversation,
    handleStartConversation,
    setMessage,
  ]);

  return (
    <div className="w-[18%] fixed top-[10rem] right-0 h-[calc(100vh-10rem)]">
      {props.children}
      <div className="w-[18%] fixed bottom-0 right-0 gap-5 px-5 py-2 bg-black">
        <textarea
          id="chat"
          name="textmessage"
          ref={textAreaRef}
          data-testid="message-input"
          placeholder="..."
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSendMessage();
            }
          }}
          rows={1}
          className={`rounded-lg px-3 py-1 w-full bg-white ${
            textAreaRef?.current?.scrollHeight &&
            textAreaRef?.current?.scrollHeight <= 32
              ? "max-h-8"
              : "max-h-40"
          } min-h-8 outline-none border-none focus:ring-0 resize-none`}
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
