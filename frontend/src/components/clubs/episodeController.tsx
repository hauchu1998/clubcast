import { Episode } from "@/types/club";
import EpisodeContent from "./episode";
import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { useClubCastContract } from "@/hooks/useClubCastContract";
import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import EpisodeUpload from "./episodeUpload";

interface EpisodeControllerProps {
  clubId: string;
  clubName: string;
  hostAddress: string;
  isHost: boolean;
}

const EpisodeController = ({
  clubId,
  clubName,
  isHost,
  hostAddress,
}: EpisodeControllerProps) => {
  const { address: user } = useAccount();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const { clubCastAddress: contractAddress } = useClubCastContract();

  useContractRead({
    address: contractAddress as `0x${string}`,
    enabled: contractAddress ? true : false,
    onSuccess: async (data: Episode[]) => {
      setEpisodes(data);
    },
    abi: ClubCast__factory.abi,
    functionName: "getClubEpisodes",
    args: [clubId, user as address],
  });

  return (
    <div className="mt-5 w-full h-full px-3 scrollbar flex justify-center">
      <div className="w-[90%] pr-20">
        {isHost && (
          <EpisodeUpload
            clubId={clubId}
            clubName={clubName}
            setEpisodes={setEpisodes}
          />
        )}
        {episodes.map((episode) => (
          <EpisodeContent
            key={episode.id}
            episode={episode}
            hostAddress={hostAddress}
          />
        ))}
      </div>
    </div>
  );
};

export default EpisodeController;
