import { isMessageSupported } from "@/helpers/isMessagerSupported";
import {
  type CachedConversation,
  useMessages,
  useClient,
} from "@xmtp/react-sdk";
import { isSameDay } from "date-fns";
import { useEffect, useRef, useCallback, useMemo, use } from "react";
import { DateDivider } from "./dateDivider";
import MessageController from "./messageController";
import { shortAddress } from "@xmtp/react-components";

interface MessagesProps {
  conversation: CachedConversation;
}

const Messages = (props: MessagesProps) => {
  const { conversation } = props;
  const { client } = useClient();
  const messagesEndRef = useRef<any>(null);
  const lastMessageDateRef = useRef<Date>();
  const renderedDatesRef = useRef<Date[]>([]);

  // XMTP Hooks
  const { messages, isLoading } = useMessages(conversation);
  console.log(messages);

  const messagesWithDates = useMemo(
    () =>
      messages?.map((msg, index) => {
        // if the message content type is not support and has no fallback,
        // disregard it
        if (!isMessageSupported(msg) && !msg.contentFallback) {
          return null;
        }
        if (renderedDatesRef.current.length === 0) {
          renderedDatesRef.current.push(msg.sentAt);
        }
        const lastRenderedDate = renderedDatesRef.current.at(-1) as Date;
        const isFirstMessage = index === 0;
        const isSameDate = isSameDay(lastRenderedDate, msg.sentAt);
        const shouldDisplayDate = isFirstMessage || !isSameDate;

        if (shouldDisplayDate) {
          renderedDatesRef.current.push(msg.sentAt);
        }
        const messageDiv = (
          <div key={msg.uuid}>
            {shouldDisplayDate && (
              <DateDivider date={renderedDatesRef.current.at(-1) as Date} />
            )}
            <MessageController
              message={msg}
              key={msg.xmtpID}
              from={{
                displayAddress: shortAddress(msg.senderAddress),
                isSelf: client?.address === msg.senderAddress,
              }}
              datetime={msg.sentAt}
            />
            {/* <FullMessageController message={msg} /> */}
          </div>
        );
        lastMessageDateRef.current = msg.sentAt;
        return messageDiv;
      }),
    [messages, client]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="">Loading messages...</div>
      </div>
    );
  }
  return (
    <div className="w-full h-full overflow-auto">
      {messagesWithDates}
      <div ref={messagesEndRef} className="h-[8rem] w-full text-center">
        message end
      </div>
    </div>
  );
};

export default Messages;
