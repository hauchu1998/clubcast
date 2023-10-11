import Image from "next/image";
import { clubCard } from "@/types/club";
import Link from "next/link";

interface ClubCardProps {
  club: clubCard;
  css?: string;
}

const ClubCard = ({ club, css }: ClubCardProps) => {
  return (
    <Link
      className={`${css} h-[75%] flex flex-col items-center`}
      href={`/club/${club.id}`}
    >
      <Image
        src={club.image}
        alt="Club Logo"
        className="w-full"
        width={250}
        height={250}
      />
      <div className="px-2">
        <div className="w-full mt-1 font-bold text-xl">{club.name}</div>
        <div className="mt-1 font-semibold break-words">{club.description}</div>
      </div>
    </Link>
  );
};

export default ClubCard;
