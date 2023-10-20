import { getDatabase, set, ref } from "firebase/database";
import { Proposal } from "@/types/club";
import app from "./index";

export const createProposalApi = async (proposal: Proposal) => {
  const db = getDatabase(app);
  const newClubRef = ref(db, "proposals/" + proposal.id);
  await set(newClubRef, proposal);
};
