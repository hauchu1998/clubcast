import { useRouter } from "next/router";
import { club } from "@/db/clubs";
import PollController from "@/components/clubs/pollController";
import EpisodeController from "@/components/clubs/episodeController";
import { useMemo, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import SwitchNetworkButton from "@/components/switchNetworkButton";
import ClubIntro from "@/components/clubs/clubIntro";

const ClubPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [isMember, setIsMember] = useState(true);
  const isHost = useMemo(() => address === club.owner, [address]);

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center">
      <div className="w-full h-full flex">
        <div className="w-[30%] h-full overflow-y-auto">
          <ClubIntro club={club} css="" />
          {chain?.id === club.chainId && (isMember || isHost) && (
            <PollController css="" />
          )}
        </div>
        <div className="w-[70%] h-full px-3">
          {chain?.id !== club.chainId ? (
            <div className="w-full h-full flex justify-center items-center">
              <SwitchNetworkButton chainId={club.chainId} />
            </div>
          ) : !isMember && !isHost ? (
            <div className="w-full h-full flex justify-center items-center">
              <button
                className="bg-black text-white px-3 py-1 rounded-lg font-bold text-xl"
                onClick={() => {}}
              >
                Get Club Fragment
              </button>
            </div>
          ) : (
            <EpisodeController isHost={isHost} episodes={club.episodes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
