import Image from "next/image";
import { ethers, BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
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
import Spinner from "@/components/spinner";
import useEtherWalletClient from "@/hooks/useEtherWalletClient";
import { useRouter } from "next/router";

const defaultImageUrl = [
  "https://cdn.pixabay.com/photo/2022/10/03/12/03/microphone-7495739_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/04/15/14/45/microphone-5046876_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/03/25/20/30/podcast-7876792_640.jpg",
];

// ERC721 = 0xD2E93c19d64B0F6989ed25EEC86Aa4173869C17c
// Governance = 0x7712Fbb7834Ab30e76CA716a451460e6431B0b96

const NewClub = () => {
  const router = useRouter();
  const clubId = useMemo(() => generateRandomId(), []);
  const { address } = useAccount();
  const { result: signer } = useEtherWalletClient();
  const { chain } = useNetwork();
  const [erc721Address, setErc721Address] = useState("");
  const [governanceAddress, setGovernanceAddress] = useState("");
  const [clubName, setClubName] = useState("");
  const [maxMembers, setMaxMembers] = useState<number>();
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // [TODO] change to blob
  const [imageUrl, setImageUrl] = useState(
    defaultImageUrl[Math.floor(Math.random() * defaultImageUrl.length)]
  );
  const [isLoading, setIsLoading] = useState(false);

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

  const deployContract = useCallback(
    async (mode: string) => {
      try {
        if (mode == "erc721") {
          if (!maxMembers) {
            alert("Please fill max members");
            return;
          }
          setIsLoading(true);
          const erc721Factory = new ethers.ContractFactory(
            ERC721Mock__factory.abi,
            ERC721Mock__factory.bytecode,
            signer
          );
          const contract = await erc721Factory.deploy(
            address,
            "ClubCast Fragment",
            "CCF",
            BigNumber.from(maxMembers?.toString())
          );
          await contract.deployed();
          setErc721Address(contract.address);
        } else if (mode == "governance") {
          if (!erc721Address) {
            alert("Please deploy ERC721 contract first");
            return;
          }
          setIsLoading(true);
          const governorFactory = new ethers.ContractFactory(
            ClubCastGovernor__factory.abi,
            ClubCastGovernor__factory.bytecode,
            signer
          );
          const contract = await governorFactory.deploy(
            erc721Address,
            BigNumber.from("0"),
            BigNumber.from("4")
          ); // ERC721, proposal thresold, quorum
          await contract.deployed();
          setGovernanceAddress(contract.address);
        }
        setIsLoading(false);
      } catch (error: any) {
        alert(error.message);
        setIsLoading(false);
      }
    },
    [erc721Address, maxMembers, address, signer]
  );

  const handleCreateClub = useCallback(async () => {
    if (!clubName || !description || !erc721Address || !governanceAddress) {
      alert("Please fill all the fields");
      return;
    }
    try {
      setIsLoading(true);
      // const signer = window.ethereum?.getSigner();
      const club: Club = {
        id: clubId,
        owner: address as address,
        name: clubName,
        description,
        chainId: chain?.id as number,
        image: selectedImage
          ? URL.createObjectURL(selectedImage as Blob)
          : imageUrl,
      };
      writeCreateClub?.();
      await createClubApi(club);
      setIsLoading(false);
      router.push(`/club/${clubId}`);
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  }, [
    clubId,
    clubName,
    description,
    imageUrl,
    address,
    chain?.id,
    writeCreateClub,
    selectedImage,
    erc721Address,
    governanceAddress,
    router,
  ]);

  //text-[#B52F6B]
  return (
    <div className="w-full h-[calc(100vh-5.5rem)] flex flex-col items-center">
      <div className={`mt-5 ${bangers.className} text-5xl text-cyan-500`}>
        Create New Club
      </div>
      <div className="font-semibold">club ID: {clubId}</div>
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
            <div className="text-sm text-pink-500">{`NOTE: Image should < 5MB`}</div>
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
            <div className="mt-5 w-full flex gap-5 items-center">
              <div className={`${bangers.className} text-3xl`}>Chain: </div>
              <ChainDropDown />
            </div>
            <div className="mt-5 w-full flex gap-5 items-center">
              <div className={`${bangers.className} text-3xl`}>
                Member Limit:{" "}
              </div>
              <input
                type="text"
                className="w-20 bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
                placeholder="ex: 10"
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div>
          <div className={`${bangers.className} mt-5 text-3xl`}>
            Description
          </div>
          <textarea
            className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
            placeholder="Enter Club Description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <div className={`w-full ${bangers.className} mt-5 text-3xl`}>
            Fragment Address
          </div>
          <input
            type="text"
            className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
            placeholder="Enter Club Fragment Address (ERC721)"
            value={erc721Address}
            onChange={(e) => setErc721Address(e.target.value)}
          />
          <div className="w-full flex justify-end">
            <button
              className="text-purple-500 underline"
              onClick={() => deployContract("erc721")}
            >
              No ERC721 conteact yet? Let ClubCast deploy for you.
            </button>
          </div>
          {isLoading && !erc721Address && (
            <div className="w-full flex gap-3 justify-center text-xl text-pink-500">
              Loading <Spinner />
            </div>
          )}
        </div>
        <div>
          <div className={`w-full ${bangers.className} mt-5 text-3xl`}>
            Governance Address
          </div>
          <input
            type="text"
            className="w-full bg-transparent px-3 py-1 text-lg border border-black rounded-lg"
            placeholder="Enter Governance Address "
            value={governanceAddress}
            onChange={(e) => setGovernanceAddress(e.target.value)}
          />
          <div className="w-full flex justify-end">
            <button
              className="text-purple-500 underline"
              onClick={() => deployContract("governance")}
            >
              No Governor conteact yet? Let ClubCast deploy for you.
            </button>
          </div>
          {isLoading && erc721Address && !governanceAddress && (
            <div className="w-full flex gap-3 justify-center text-xl text-pink-500">
              Loading <Spinner />
            </div>
          )}
        </div>
      </div>
      <button
        className={`${bangers.className} mt-5 bg-black px-5 py-1.5 text-3xl text-white rounded-lg`}
        onClick={handleCreateClub}
      >
        Create
      </button>
      {isLoading && erc721Address && governanceAddress && (
        <div className="w-full flex gap-3 justify-center text-xl text-pink-500">
          Loading <Spinner />
        </div>
      )}
    </div>
  );
};

export default NewClub;
