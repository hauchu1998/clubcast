import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { isValidAddress, useStartConversation } from "@xmtp/react-sdk";
import useSelectedConversation from "@/hooks/xmtp/useSelectedConversation";
import { typeLookup, type contentTypes } from "@/helpers/attachments";
import { useAttachmentChange } from "@/hooks/xmtp/useAttachmentChange";
import { BsImages, BsFillSendFill, BsCameraVideo } from "react-icons/bs";
import { BiMicrophone } from "react-icons/bi";
import { AiOutlineFile } from "react-icons/ai";
import { useInboxStore } from "@/store/inbox";
import { useVoiceRecording } from "@/hooks/xmtp/useVoiceRecording";
import { useRecordingTimer } from "@/hooks/xmtp/useRecordingTimer";
import { Attachment } from "@xmtp/content-type-remote-attachment";
import useSendMessageContent from "@/hooks/xmtp/useSendMessageContent";

interface ConversationProps {
  children: React.ReactNode;
}
const Conversation = (props: ConversationProps) => {
  const [message, setMessage] = useState("");
  const [acceptedTypes, setAcceptedTypes]: [
    string | string[] | undefined,
    Dispatch<SetStateAction<string | string[] | undefined>>
  ] = useState();

  const [isDragActive, setIsDragActive] = useState(false);
  const [attachment, setAttachment]: [
    Attachment | undefined,
    (attachment: Attachment | undefined) => void
  ] = useState();
  const [attachmentPreview, setAttachmentPreview]: [
    string | undefined,
    (url: string | undefined) => void
  ] = useState();

  const {
    mode,
    setMode,
    peerAddress,
    conversationTopic,
    setConversationTopic,
  } = useInboxStore((state) => ({
    mode: state.mode,
    setMode: state.setMode,
    peerAddress: state.peerAddress,
    setPeerAddress: state.setPeerAddress,
    conversationTopic: state.conversationTopic,
    setConversationTopic: state.setConversationTopic,
  }));
  const conversation = useSelectedConversation();
  const { startConversation } = useStartConversation();
  const { sendMessageContent } = useSendMessageContent();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleMessageChange = useCallback(
    (e: any) => {
      setMessage(e.target.value);
    },
    [setMessage]
  );

  const onButtonClick = (contentType: contentTypes) => {
    // For document view, we want to accept all file types, even if we can't gracefully render them on the UI.
    if (contentType === "application") {
      setAcceptedTypes("all");
    } else {
      const acceptedFileTypeList = Object.keys(typeLookup).reduce(
        (acc: string[], key: string) => {
          if (typeLookup[key] === contentType) acc.push(`.${key}`);
          return acc;
        },
        []
      );
      setAcceptedTypes([...acceptedFileTypeList]);
    }
  };

  // For attachments from file reader
  const { onAttachmentChange } = useAttachmentChange({
    setAttachment,
    setAttachmentPreview,
    setIsDragActive,
  });

  // For voice recording
  // const { status, startRecording, stopRecording, mediaBlobUrl, error } =
  //   useVoiceRecording({
  //     setAttachment,
  //     setAttachmentPreview,
  //   });

  // const { start, pause, reset, recordingValue } = useRecordingTimer({
  //   stopRecording,
  //   status,
  // });

  const handleSendMessage = useCallback(async () => {
    const text = message;
    const attach = attachment;

    setMessage("");
    setAttachment(undefined);
    setAttachmentPreview(undefined);

    if (mode === "new") {
      if (peerAddress && text) {
        const { cachedConversation } = await startConversation(
          peerAddress,
          text
        );
        if (attach && cachedConversation) {
          await sendMessageContent(cachedConversation, attach, "attachment");
        }
        if (cachedConversation) {
          setConversationTopic(cachedConversation.topic);
          setMode("room");
        }
      }
    } else if (mode === "room") {
      if (
        conversation?.peerAddress &&
        isValidAddress(conversation?.peerAddress) &&
        conversation
      ) {
        if (attach && conversation) {
          console.log(attach);
          await sendMessageContent(conversation, attach, "attachment");
        }
        if (message && conversation) {
          await sendMessageContent(conversation, message, "text");
        }
      }
    }
  }, [
    mode,
    message,
    attachment,
    peerAddress,
    sendMessageContent,
    conversation,
    setMessage,
    setConversationTopic,
    setMode,
    startConversation,
  ]);

  useEffect(() => {
    if (conversationTopic) {
      textAreaRef.current?.focus();
    }
    setMessage("");
    setAttachmentPreview(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  useEffect(() => {
    if (acceptedTypes) {
      inputFileRef?.current?.click();
    }
  }, [acceptedTypes]);
  const extension = attachment?.mimeType.split("/")?.[1] || "";
  return (
    <div className="w-[18%] fixed top-[10rem] right-0 h-[calc(100vh-10rem)]">
      {props.children}
      <div className="w-[18%] fixed bottom-0 right-0 gap-5 px-5 py-2 bg-black">
        <input
          type="file"
          id="file"
          ref={inputFileRef}
          onChange={onAttachmentChange}
          aria-label={"File picker"}
          accept={
            Array.isArray(acceptedTypes) ? acceptedTypes.join(",") : undefined
          }
          hidden
        />
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

        {attachmentPreview && (
          <div className="relative m-8 w-fit">
            {typeLookup[extension] === "video" ? (
              <video width="320" height="240" controls autoPlay>
                <source src={attachmentPreview} type="video/mp4" />
                Your browser does not support the video tag
              </video>
            ) : typeLookup[extension] === "application" ? (
              <object
                data={attachmentPreview}
                type="application/pdf"
                width="100%"
                height="500px"
              >
                <p>Unable to display attachment</p>
              </object>
            ) : typeLookup[extension] === "image" ? (
              <Image
                src={attachmentPreview || ""}
                alt="uploaded image"
                className="relative w-95/100 max-h-80 rounded-xl overflow-auto border border-cyan-400"
                width={150}
                height={100}
                priority
              />
            ) : (
              <div className="flex text-blue-600 font-bold">
                <a
                  href={attachmentPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {attachment?.filename}
                </a>
              </div>
            )}
            <button
              className="text-gray-600 underline"
              onClick={() => {
                setAttachmentPreview(undefined);
                setAttachment(undefined);
              }}
            >
              remove
            </button>
          </div>
        )}
        <div className="mt-1 flex justify-between">
          <div className="flex gap-3">
            <BsImages
              className="text-white text-xl hover:text-orange-400"
              onClick={() => onButtonClick("image")}
            />
            <BsCameraVideo
              className="text-white text-xl hover:text-orange-400"
              onClick={() => onButtonClick("video")}
            />
            <AiOutlineFile
              className="text-white text-xl hover:text-orange-400"
              onClick={() => onButtonClick("application")}
            />
            <BiMicrophone // hidden so far
              className="hidden text-white text-2xl"
              onClick={() => onButtonClick("image")}
            />
          </div>
          <button
            className="text-white text-xl hover:text-orange-400"
            onClick={handleSendMessage}
          >
            <BsFillSendFill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;

// typeLookup[extension] === "audio" ? (
//   <audio controls src={mediaBlobUrl}>
//     <a href={mediaBlobUrl}>{t("attachments.unable_to_display")}</a>
//   </audio>
// ) :
