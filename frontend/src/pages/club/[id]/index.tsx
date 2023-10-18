import { useRouter } from "next/router";
import { club } from "@/db/clubs";
import ProposalController from "@/components/clubs/proposalController";
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
    <div className="w-full h-[calc(100vh-5.5rem)] flex flex-col items-center">
      <div className="w-full h-full flex">
        <div className="w-[40%] h-full">
          <ClubIntro club={club} css="h-[40%] scrollbar " />
          {chain?.id === club.chainId && (isMember || isHost) && (
            <ProposalController css="h-[60%]" />
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
              clubId={id as string}
              isHost={isHost}
              hostAddress={club.owner}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
