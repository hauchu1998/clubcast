import { useCallback } from "react";
import { Web3Storage } from "web3.storage";
import type { CachedConversation } from "@xmtp/react-sdk";
import { useSendMessage as _useSendMessage } from "@xmtp/react-sdk";
import type {
  Attachment,
  RemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import {
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec,
  AttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import Upload from "@/helpers/upload";
import { useInboxStore } from "@/store/inbox";
import { isValidLongWalletAddress } from "@/helpers/address";

const useSendMessageContent = (attachment?: Attachment) => {
  const { sendMessage: _sendMessage, isLoading, error } = _useSendMessage();
  const peerAddress = useInboxStore((state) => state.peerAddress);

  const sendMessageContent = useCallback(
    async (
      conversation: CachedConversation,
      message: string | Attachment,
      type: "text" | "attachment"
    ) => {
      if (!isValidLongWalletAddress(peerAddress)) {
        return;
      }
      if (attachment && type === "attachment") {
        const web3Storage = new Web3Storage({
          token: process.env.VITE_WEB3_STORAGE_TOKEN,
        });

        const encryptedEncoded = await RemoteAttachmentCodec.encodeEncrypted(
          attachment,
          new AttachmentCodec()
        );

        const upload = new Upload(
          "XMTPEncryptedContent",
          encryptedEncoded.payload
        );

        const cid = await web3Storage.put([upload]);
        const url = `https://${cid}.ipfs.w3s.link/XMTPEncryptedContent`;
        const remoteAttachment: RemoteAttachment = {
          url,
          contentDigest: encryptedEncoded.digest,
          salt: encryptedEncoded.salt,
          nonce: encryptedEncoded.nonce,
          secret: encryptedEncoded.secret,
          scheme: "https://",
          filename: attachment.filename,
          contentLength: attachment.data.byteLength,
        };

        void _sendMessage(
          conversation,
          remoteAttachment,
          ContentTypeRemoteAttachment
          // {
          //   contentFallback: `This app does not support ${remoteAttachment.filename} attachments yet.`,
          // }
        );
      } else if (type === "text") {
        void _sendMessage(conversation, message);
      }
    },
    [peerAddress, attachment, _sendMessage]
  );

  return {
    sendMessageContent,
    loading: isLoading,
    error,
  };
};

export default useSendMessageContent;
