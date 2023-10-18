import { useAccount, useEnsName } from "wagmi";
import { useRouter } from "next/router";
import Blockies from "react-blockies";
import { isValidLongWalletAddress } from "@/helpers/address";
import { address } from "@/types/address";
import ClubList from "@/components/clubs/clubList";
import {
  useGetUserPersonalClubs,
  useGetUserSubscribedClubs,
} from "@/hooks/useGetClubs";

import { personalClubs as pC, subscribedClubs as sC } from "@/db/clubs";

const Dashboard = () => {
  const { address: walletAddress } = useAccount();
  const { data: ensName } = useEnsName({
    address: walletAddress as address,
    enabled: isValidLongWalletAddress(walletAddress as address),
    chainId: 1,
  });
  const { data: personalClubs } = useGetUserPersonalClubs();
  const { data: subscribedClubs } = useGetUserSubscribedClubs();

  return (
    <div className="w-full py-3">
      <div className="w-full px-10 py-3 flex gap-5 items-center h-32">
        <div data-testid="avatar" className="flex items-center justify-center">
          <Blockies
            data-testid="avatar"
            seed={walletAddress?.toLowerCase() || "default_profile"}
            scale={5}
            size={20}
            className="rounded-full"
          />
        </div>
        <div className="font-bold">
          <div className=" text-2xl">{walletAddress}</div>
          {
            // @ts-ignore
            ensName ? (
              <div className="mt-1 bg-blue-400 px-4 py-1 text-white rounded-full">
                {ensName}
              </div>
            ) : (
              <a
                className="mt-1 bg-blue-400 px-4 py-1 text-white rounded-full"
                href="https://ens.domains/"
                target="_blank"
              >
                register ENS
              </a>
            )
          }
        </div>
      </div>
      <div className="h-[calc(100vh-14rem)] p-3">
        <div className="w-full h-1/2">
          <ClubList section="personal" clubs={personalClubs} />
        </div>
        <div className="w-full h-1/2">
          <ClubList section="subscribed" clubs={subscribedClubs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
