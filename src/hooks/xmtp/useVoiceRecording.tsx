import type { Attachment } from "@xmtp/content-type-remote-attachment";
import { useReactMediaRecorder } from "react-media-recorder-2";
import { useInboxStore } from "@/store/inbox";
import { MAX_FILE_SIZE } from "@/constants/attachmentSize";

interface useVoiceRecordingProps {
  setAttachment: (attachment: Attachment | undefined) => void;
  setAttachmentPreview: (url: string | undefined) => void;
}

const fileType = "audio/wav";

export const useVoiceRecording = ({
  setAttachment,
  setAttachmentPreview,
}: useVoiceRecordingProps) => {
  const setAttachmentError = useInboxStore((state) => state.setAttachmentError);

  const { status, startRecording, stopRecording, mediaBlobUrl, error } =
    useReactMediaRecorder({
      audio: true,
      onStop: (blobUrl, blob) => {
        setAttachmentPreview(blobUrl);
        const file = new File([blob], "audio", { type: fileType });

        if (file.size > MAX_FILE_SIZE) {
          setAttachmentError("File too large");
        }

        const fr = new FileReader();
        fr.readAsArrayBuffer(file);

        fr.addEventListener("load", () => {
          const result = fr.result as ArrayBuffer;

          if (!(result instanceof ArrayBuffer)) {
            return;
          }

          const newAttachment = {
            filename: "VoiceRecording.wav",
            mimeType: fileType,
            data: new Uint8Array(result),
          };

          setAttachment(newAttachment);
        });
      },
      askPermissionOnMount: false,
    });

  return {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    error,
  };
};
