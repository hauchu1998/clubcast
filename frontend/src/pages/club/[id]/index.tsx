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
        <div className="w-[40%] h-full overflow-y-auto">
          <ClubIntro club={club} css="h-3/7 scrollbar" />
          {chain?.id === club.chainId && (isMember || isHost) && (
            <PollController css="h-4/7 scrollbarcd ." />
          )}
        </div>
        <div className="w-[60%] h-full ">
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
            <EpisodeController
              isHost={isHost}
              hostAddress={club.owner}
              episodes={club.episodes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
