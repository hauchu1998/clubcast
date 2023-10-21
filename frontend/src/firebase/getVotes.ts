import { getDatabase, ref, get } from "firebase/database";
import app from "./index";
import { address } from "@/types/address";

export const fetchUserVote = async (
  governanceAddress: address,
  proposalId: string,
  user: address
) => {
  const db = getDatabase(app);
  const defVoteRef = ref(
    db,
    `votes/${governanceAddress}/${proposalId}/${user}`
  );
  const snapshot = await get(defVoteRef);
  return snapshot.val();
};

export const fetchAllVotes = async (
  governanceAddress: address,
  proposalId: string
) => {
  const db = getDatabase(app);
  const defVoteRef = ref(db, `votes/${governanceAddress}/${proposalId}`);
  const snapshot = await get(defVoteRef);
  return snapshot.val();
};
