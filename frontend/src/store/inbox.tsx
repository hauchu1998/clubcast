import { address } from "@/types/address";
import { create } from "zustand";

interface InboxState {
  mode: "chats" | "room" | "new";
  setMode: (mode: "chats" | "room" | "new") => void;
  peerAddress: string | address;
  setPeerAddress: (peerAddress: string | address) => void;
  conversationTopic?: string;
  setConversationTopic: (conversationTopic?: string) => void;
  startedFirstMessage: boolean;
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
  attachmentError: string;
  setAttachmentError: (attachmentError: string) => void;
  resetInboxState: () => void;
}

export const useInboxStore = create<InboxState>((set) => ({
  mode: "chats",
  setMode: (mode) => set({ mode }),
  peerAddress: "",
  setPeerAddress: (peerAddress) => set({ peerAddress }),
  conversationTopic: "",
  setConversationTopic: (conversationTopic) => set({ conversationTopic }),
  startedFirstMessage: false,
  setStartedFirstMessage: (startedFirstMessage) => set({ startedFirstMessage }),
  attachmentError: "",
  setAttachmentError: (attachmentError) => set({ attachmentError }),
  resetInboxState: () =>
    set({
      mode: "chats",
      peerAddress: "",
      conversationTopic: "",
      startedFirstMessage: false,
      attachmentError: "",
    }),
}));
