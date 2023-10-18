import Image from "next/image";
import { ethers } from "ethers";
import { useCallback, useMemo, useRef, useState } from "react";
import { generateRandomId } from "@/helpers/random";
import {
  ClubCast__factory,
  ClubCastGovernor__factory,
  ERC721Mock__factory,
} from "@/typechain-types";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { address } from "@/types/address";
import { Club } from "@/types/club";
import { createClubApi } from "@/firebase/createClubs";
import { bangers } from "@/styles/fonts";
import ChainDropDown from "@/components/chainDropDown";

const defaultImageUrl = [
  "https://cdn.pixabay.com/photo/2022/10/03/12/03/microphone-7495739_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/04/15/14/45/microphone-5046876_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/03/25/20/30/podcast-7876792_640.jpg",
];

const NewClub = () => {
  const clubId = useMemo(() => generateRandomId(), []);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [erc721Address, setErc721Address] = useState("");
  const [governanceAddress, setGovernanceAddress] = useState("");
  const [clubName, setClubName] = useState("");
  const [maxMembers, setMaxMembers] = useState(0);
  const [nftSymbol, setNftSymbol] = useState("");
  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // [TODO] change to blob
  const [imageUrl, setImageUrl] = useState(
    defaultImageUrl[Math.floor(Math.random() * defaultImageUrl.length)]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSuceess, setIsSuccess] = useState(false);

  const [steps, setSteps] = useState<number>(0);

  const { config, error } = usePrepareContractWrite({
    address: (process.env.NEXT_PUBLIC_SCROLL_CLUBCAST_ADDRESS as address) || "",
    abi: ClubCast__factory.abi,
    functionName: "createClub",
    args: [clubId, erc721Address as address, governanceAddress as address],
  });

  const { write: writeCreateClub } = useContractWrite(config);

  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(e.target.files?.[0] || null);
  };

  const deployContract = useCallback(async () => {
    setIsLoading(true);
    if (steps === 0) {
      //   const signer = window.ethereum?.getSigner();
      const erc721Factory = new ethers.ContractFactory(
        ERC721Mock__factory.abi,
        ERC721Mock__factory.bytecode
      );
      const contract = await erc721Factory.deploy(
        address,
        nftName,
        nftSymbol,
        maxMembers
      );
      await contract.deployed();
      setErc721Address(contract.address);
    } else if (steps === 1) {
      const governorFactory = new ethers.ContractFactory(
        ClubCastGovernor__factory.abi,
        ClubCastGovernor__factory.bytecode
      );
      const contract = await governorFactory.deploy(erc721Address, 0, 4); // ERC721, proposal thresold, quorum
      await contract.deployed();
      setGovernanceAddress(contract.address);
    }
    setIsLoading(false);
  }, [steps, erc721Address, maxMembers, nftName, nftSymbol, address]);

  const createClub = useCallback(async () => {
    setIsLoading(true);
    setIsSuccess(false);
    // const signer = window.ethereum?.getSigner();
    const club: Club = {
      id: clubId,
      owner: address as address,
      name: clubName,
      description,
      chainId: chain?.id as number,
      image: imageUrl || URL.createObjectURL(selectedImage as Blob),
    };
    writeCreateClub?.();
    await createClubApi(club);
    setIsLoading(false);
    setIsSuccess(true);
  }, [
    clubId,
    clubName,
    description,
    imageUrl,
    address,
    chain?.id,
    writeCreateClub,
    selectedImage,
  ]);
  console.log(selectedImage && URL.createObjectURL(selectedImage));
  //text-[#B52F6B]
  return (
    <div className="w-full h-[calc(100vh-5.5rem)] flex flex-col items-center">
      <div className={`mt-5 ${bangers.className} text-5xl text-cyan-500`}>
        Create New Club
      </div>
      <div>club ID: {clubId}</div>
      <div className="mt-10 w-[50%]">
        <div className="w-full flex gap-5">
          <div className="flex flex-col items-center">
            <Image
              src={
                selectedImage ? URL.createObjectURL(selectedImage) : imageUrl
              }
              alt="club image"
              className="w-52 h-52 border-2 border-purple-50 object-cover"
              width={200}
              height={200}
            />
            <div className="text-sm text-red-500">{`NOTE: Image should < 5MB`}</div>
            <input
              className="w-52 truncate"
              type="file"
              id="club-image"
              onChange={handleImageUploaded}
              aria-label={"File picker"}
              accept="image/*"
            />
          </div>
          <div className="w-full ">
            <div className={`${bangers.className} text-3xl`}>Club Name</div>
            <input
              type="text"
              className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
              placeholder="Enter Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
            <div className="flex gap-5 items-center">
              <div className={`${bangers.className} text-3xl`}>Chain: </div>
              <ChainDropDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewClub;
