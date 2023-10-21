import { address } from "@/types/address";
import { useQuery } from "@tanstack/react-query";
import { fetchAllVotes } from "@/firebase/getVotes";
import { getDatabase, ref } from "firebase/database";
import app from "@/firebase";
import { useAccount } from "wagmi";

const useGetAllVotes = (governanceAddress: address, proposalId: string) => {
  const { address } = useAccount();
  const defRef = ref(getDatabase(app), `proposals/${governanceAddress}`);
  const enabled =
    governanceAddress !== undefined &&
    defRef !== undefined &&
    address !== undefined;
  return useQuery({
    enabled,
    queryKey: [governanceAddress, proposalId, "all", "vote"],
    queryFn: async () => {
      const votes = await fetchAllVotes(governanceAddress, proposalId);
      let proposalVotes = [0, 0, 0];
      Object.keys(votes).forEach((key) => {
        proposalVotes[votes[key]] += 1;
      });
      return proposalVotes;
    },
  });
};

export default useGetAllVotes;
