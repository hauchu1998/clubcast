import { bangers } from "@/styles/fonts";
import { personalClubs, subscribedClubs } from "@/db/clubs";
import ClubCard from "./clubCard";
import Link from "next/link";

interface ClubListProps {
  section: string;
}

const ClubList = ({ section }: ClubListProps) => {
  const title = section === "personal" ? "Your Clubs" : "Subscribed Clubs";
  // const clubCards = useGetClientClubs(section)
  const clubCards = section === "personal" ? personalClubs : subscribedClubs;
  return (
    <div className="relative h-1/2">
      <div className="absolute top-0 w-full px-5 flex justify-between items-center border-b border-black">
        <div className={`text-3xl ${bangers.className}`}>{title}</div>
        {section === "personal" && (
          <Link
            className="px-3 py-0.5 rounded-full bg-black text-white font-bold"
            href="/club/new"
          >
            Create
          </Link>
        )}
      </div>
      <div className="h-full w-full px-5 flex items-center gap-5 overflow-auto">
        {clubCards &&
          clubCards.map((club) => {
            return <ClubCard key={club.id} club={club} css="w-[15%]" />;
          })}
      </div>
    </div>
  );
};

export default ClubList;
