import { ClubCast__factory } from "@/typechain-types";
import { address } from "@/types/address";
import { useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const useUpoadEpisode = (clubId: string, videoId: string) => {
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { config } = usePrepareContractWrite({
    address: (process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address) || "",
    abi: ClubCast__factory.abi,
    functionName: "publishVideo",
    args: [clubId, BigInt("10"), ipfsUrl],
    // args: [clubId, BigInt(videoId), ipfsUrl],
  });
  const { data, write: writePublishVideo } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash as `0x${string}`,
  });

  return {
    title,
    setTitle,
    description,
    setDescription,
    ipfsUrl,
    setIpfsUrl,
    writePublishVideo,
    isSuccess,
  };
};

export default useUpoadEpisode;
