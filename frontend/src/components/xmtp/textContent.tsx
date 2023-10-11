import { de } from "date-fns/locale";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import type { MouseEvent } from "react";
import { CachedMessageWithId, ContentTypeId } from "@xmtp/react-sdk";

interface TextContentProps {
  content: string;
}

const TextContent = (props: TextContentProps) => {
  const content = props.content;
  const [, source] = useEmojiData({
    compact: false,
    shortcodes: ["emojibase"],
  });
  return (
    <span data-testid="message-tile-text">
      <Interweave
        content={content}
        newWindow
        escapeHtml
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        matchers={[
          new UrlMatcher("url"),
          new EmojiMatcher("emoji", {
            convertEmoticon: true,
            convertShortcode: true,
            renderUnicode: true,
          }),
          // Commenting out email matching until this issue is resolved: https://github.com/milesj/interweave/issues/201
          // In the meantime, the experience still properly displays emails, just doesn't link to the expected `mailto:` view.
          // new EmailMatcher("email"),
        ]}
        emojiSource={source}
      />
    </span>
  );
};

export default TextContent;
