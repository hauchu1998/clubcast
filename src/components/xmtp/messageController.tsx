import { useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import type { KeyboardEventHandler } from "react";
import {
  useResendMessage,
  type CachedMessageWithId,
  ContentTypeId,
  ContentTypeText,
} from "@xmtp/react-sdk";
import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import { DateDivider } from "./dateDivider";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import TextContent from "./textContent";
import AttachmentContent from "./attachmentContent";

interface MessageSender {
  displayAddress: string;
  isSelf?: boolean;
}

type MessageContentProps = {
  message: CachedMessageWithId;
  from: MessageSender;
  datetime: Date;
  showDateDivider?: boolean;
};

const incomingMessageBackgroundStyles = "bg-black text-[#fff7e8] rounded-br-lg";
const outgoingMessageBackgroundStyles = "bg-colors text-black rounded-bl-lg";
const errorMessageBackgroundStyles =
  "bg-transparent rounded-bl-lg border-gray-200 border";

const MessageController = ({
  message,
  from,
  datetime,
  showDateDivider = false,
}: MessageContentProps) => {
  const contentType = ContentTypeId.fromString(message.contentType);
  const { resend, cancel } = useResendMessage();

  const handleResend = useCallback(() => {
    void resend(message);
  }, [message, resend]);

  const handleResendKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    (e) => {
      if (e.key === "Enter") {
        void handleResend();
      }
    },
    [handleResend]
  );

  const handleCancel = useCallback(() => {
    void cancel(message);
  }, [message, cancel]);

  const handleCancelKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    (e) => {
      if (e.key === "Enter") {
        void handleCancel();
      }
    },
    [handleCancel]
  );

  const messageBackgroundStyles = useMemo(() => {
    if (message.hasLoadError) {
      return errorMessageBackgroundStyles;
    }
    if (from.isSelf) {
      return outgoingMessageBackgroundStyles;
    }
    return incomingMessageBackgroundStyles;
  }, [from.isSelf, message.hasLoadError]);

  return (
    <div
      data-testid="message-tile-container"
      className={`flex flex-col w-full px-4 md:px-8 ${
        from.isSelf ? "items-end" : "items-start"
      } `}
    >
      <div
        className={`flex flex-col max-w-[80%] md:max-w-[60%] w-fit ${
          from.isSelf ? "justify-end" : "justify-start"
        }`}
      >
        <div className="flex flex-col max-w-full">
          <div
            className={`p-2 px-3 rounded-tl-xl rounded-tr-xl border border-black break-words ${messageBackgroundStyles}`}
          >
            {contentType.sameAs(ContentTypeText) ? (
              <TextContent content={message.content} />
            ) : contentType.sameAs(ContentTypeRemoteAttachment) ? (
              <AttachmentContent message={message} />
            ) : (
              <span>{message.contentFallback}</span>
            )}
          </div>
          <div
            className={`text-xs text-gray-500 w-full flex mb-4 ${
              from.isSelf ? "justify-end" : "justify-start"
            }`}
          >
            {message.hasSendError ? (
              <div className="text-red-600 flex align-center font-bold gap-1">
                <div>message fail delivered</div>
                <div>&bull;</div>
                <div
                  role="button"
                  tabIndex={0}
                  className="underline"
                  onKeyDown={handleResendKeyDown}
                  onClick={handleResend}
                >
                  retry message
                </div>
                <div>&bull;</div>
                <div
                  role="button"
                  tabIndex={0}
                  className="underline"
                  onKeyDown={handleCancelKeyDown}
                  onClick={handleCancel}
                >
                  cancel message
                </div>
              </div>
            ) : (
              datetime.toLocaleTimeString()
            )}
          </div>
        </div>
      </div>
      {showDateDivider && <DateDivider date={datetime} />}
    </div>
  );
};

export default MessageController;
