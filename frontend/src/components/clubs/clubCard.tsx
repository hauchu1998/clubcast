import Image from "next/image";
import { type ClubCard } from "@/types/club";
import Link from "next/link";

interface ClubCardProps {
  club: ClubCard;
  css?: string;
}

const ClubCardContent = ({ club, css }: ClubCardProps) => {
  return (
    <Link
      className={`${css} h-[70%] flex flex-col items-center`}
      href={`/club/${club.id}`}
    >
      <Image
        src={club.image}
        alt="Club Logo"
        className="w-full"
        width={200}
        height={200}
      />
      <div className="px-2">
        <div className="w-full mt-1 font-bold text-xl">{club.name}</div>
        <div className="w-full h-16 mt-1 font-semibold break-words scrollbar">
          {club.description}
        </div>
      </div>
    </Link>
  );
};

export default ClubCardContent;
