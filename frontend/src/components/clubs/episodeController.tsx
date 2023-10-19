import { Publication } from "@/types/club";
import EpisodeContent from "./episode";
import { useCallback, useState } from "react";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { useClubCastContract } from "@/hooks/useClubCastContract";
import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import EpisodeUpload from "./episodeUpload";

interface EpisodeControllerProps {
  clubId: string;
  hostAddress: string;
  isHost: boolean;
}

const EpisodeController = ({
  clubId,
  isHost,
  hostAddress,
}: EpisodeControllerProps) => {
  const { address: user } = useAccount();
  const [episodes, setEpisodes] = useState<Publication[]>([]);
  const { clubCastAddress: contractAddress } = useClubCastContract();

  useContractRead({
    address: contractAddress as `0x${string}`,
    enabled: contractAddress ? true : false,
    onSuccess: async (data: Publication[]) => {
      setEpisodes(data);
    },
    abi: ClubCast__factory.abi,
    functionName: "listPublications",
    args: [clubId, user as address],
  });

  return (
    <div className="mt-5 w-full h-full px-3 scrollbar flex justify-center">
      <div className="w-[90%] pr-20">
        {isHost && <EpisodeUpload clubId={clubId} setEpisodes={setEpisodes} />}
        {episodes.map((episode) => (
          <EpisodeContent
            key={episode.videoId}
            videoId={episode.videoId}
            hostAddress={hostAddress}
          />
        ))}
      </div>
    </div>
  );
};

export default EpisodeController;
