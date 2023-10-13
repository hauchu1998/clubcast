import Image from "next/image";
import { Club } from "@/types/club";
import { networksIcon } from "@/constants/networks";
import { bangers } from "@/styles/fonts";
import { BiMessageDetail } from "react-icons/bi";
import { TbPigMoney } from "react-icons/tb";
import { MdOutlineReport } from "react-icons/md";
import { IconButton, Tooltip } from "@mui/material";
import { useInboxStore } from "@/store/inbox";
import { useConversation } from "@xmtp/react-sdk";

interface ClubIntroProps {
  club: Club;
  css: string;
}

const ClubIntro = ({ club, css }: ClubIntroProps) => {
  const { getCachedByPeerAddress } = useConversation();
  const { setMode, setPeerAddress, setConversationTopic } = useInboxStore(
    (state) => ({
      setMode: state.setMode,
      setConversationTopic: state.setConversationTopic,
      setPeerAddress: state.setPeerAddress,
    })
  );

  const handleStartConversation = async () => {
    const existing = await getCachedByPeerAddress(club.owner);
    if (existing) {
      setConversationTopic(existing.topic);
      setMode("room");
    } else {
      setMode("new");
      setPeerAddress(club.owner);
    }
  };
  return (
    <div className={`p-5 ${css}`}>
      <div className="flex gap-3 items-center">
        <Image
          className="border-4 border-purple-500"
          src={club.image}
          alt="club profile"
          width={200}
          height={200}
          priority
        />
        <div>
          <div className="flex gap-3">
            <span className={`text-3xl ${bangers.className}`}>{club.name}</span>{" "}
            <Image
              className="w-9 h-9 border border-gray-600 rounded-full"
              src={networksIcon[club.chainId.toString()]}
              alt="network"
              width={30}
              height={30}
            />
          </div>
          <div className="w-72 font-semibold break-words">
            host by: <br />
            <span className="text-cyan-500">{club.owner}</span>
          </div>
          <div className="mt-3 flex">
            <Tooltip title="message">
              <IconButton onClick={handleStartConversation}>
                <BiMessageDetail className="text-blue-500 text-3xl" />
              </IconButton>
            </Tooltip>
            <Tooltip title="tip host">
              <IconButton onClick={() => {}}>
                <TbPigMoney className="text-pink-500 text-3xl" />
              </IconButton>
            </Tooltip>
            <Tooltip title="report">
              <IconButton onClick={() => {}}>
                <MdOutlineReport className="text-orange-500 text-3xl" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="w-full mt-3 text-lg font-semibold">
        {club.description}
      </div>
    </div>
  );
};

export default ClubIntro;
