import { useRouter } from "next/router";
// import { club } from "@/db/clubs";
import ProposalController from "@/components/clubs/proposalController";
import EpisodeController from "@/components/clubs/episodeController";
import { useCallback, useMemo, useState } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import SwitchNetworkButton from "@/components/switchNetworkButton";
import ClubIntro from "@/components/clubs/clubIntro";
import { useGetClub } from "@/hooks/useGetClubs";
import { useContractRead } from "wagmi";
import { useClubCastContract } from "@/hooks/useClubCastContract";
import { address } from "@/types/address";
import { ClubCast__factory } from "@/typechain-types";
import Spinner from "@/components/spinner";
import { joinClubApi } from "@/firebase/joinClubs";

const ClubPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { result: club, loading } = useGetClub(id as string);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [isMember, setIsMember] = useState(false);
  const { address: user } = useAccount();
  const { clubCastAddress } = useClubCastContract();
  const [isLoading, setIsLoading] = useState(false);
  const isHost = useMemo(() => {
    if (address && club) {
      return address === club.owner;
    } else {
      return false;
    }
  }, [address, club]);

  useContractRead({
    address: clubCastAddress as address,
    enabled: clubCastAddress ? true : false,
    onSuccess: async ([clubIds, _]: string[]) => {
      const isMember = clubIds.includes(id as string);
      setIsMember(isMember);
    },
    abi: ClubCast__factory.abi,
    functionName: "getUserClubIds",
    args: [user as address],
  });

  const { config, error } = usePrepareContractWrite({
    address: (process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address) || "",
    abi: ClubCast__factory.abi,
    functionName: "joinClub",
    args: [id as string],
  });

  const { write } = useContractWrite(config);

  const handleJoinClub = useCallback(async () => {
    try {
      setIsLoading(true);
      if (id && write) {
        write();
        await joinClubApi(address as string, id as string);
        setIsMember(true);
      } else {
        throw new Error("check if the write function or id is defined");
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }, [id, write, address]);

  if (loading) return <div>Loading...</div>;

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
            <div className="w-full h-full flex justify-start items-center">
              <SwitchNetworkButton chainId={club.chainId} />
            </div>
          ) : isLoading ? (
            <div className="w-full h-full flex justify-start items-center">
              <div className="w-full flex gap-3 justify-center text-xl text-purple-500">
                Loading <Spinner />
              </div>
            </div>
          ) : !isMember && !isHost ? (
            <div className="w-full h-full flex justify-start items-center">
              <button
                className="bg-black text-white px-3 py-1 rounded-lg font-bold text-xl"
                onClick={handleJoinClub}
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
