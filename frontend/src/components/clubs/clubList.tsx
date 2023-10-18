import { bangers } from "@/styles/fonts";
import { personalClubs, subscribedClubs } from "@/db/clubs";
import ClubCardContent from "./clubCard";
import Link from "next/link";
import { Club } from "@/types/club";

interface ClubListProps {
  section: string;
  clubs: Club[] | undefined;
}

const ClubList = ({ section, clubs }: ClubListProps) => {
  const title = section === "personal" ? "Your Clubs" : "Subscribed Clubs";
  // const clubCards = useGetClientClubs(section)
  // const clubCards = section === "personal" ? personalClubs : subscribedClubs;
  return (
    <div className="h-full">
      <div className="w-full px-5 flex justify-between items-center border-b border-black">
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
        {clubs &&
          clubs.map((club) => {
            return <ClubCardContent key={club.id} club={club} css="" />;
          })}
      </div>
    </div>
  );
};

export default ClubList;
