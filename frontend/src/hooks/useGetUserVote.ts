import { address } from "@/types/address";
import { useQuery } from "@tanstack/react-query";
import { fetchUserVote } from "@/firebase/getVotes";
import { getDatabase, ref } from "firebase/database";
import app from "@/firebase";
import { useAccount } from "wagmi";

const useGetUserVote = (governanceAddress: address, proposalId: string) => {
  const { address } = useAccount();
  const defRef = ref(getDatabase(app), `proposals/${governanceAddress}`);
  const enabled =
    governanceAddress !== undefined &&
    defRef !== undefined &&
    address !== undefined;
  return useQuery({
    enabled,
    queryKey: [governanceAddress, proposalId, address, "vote"],
    queryFn: async () => {
      const vote = await fetchUserVote(
        governanceAddress,
        proposalId,
        address as address
      );
      return vote;
    },
  });
};

export default useGetUserVote;
