import { bangers } from "@/styles/fonts";
import { allClubs } from "@/db/clubs";
import ClubCard from "@/components/clubs/clubCard";
import Link from "next/link";

const Explore = () => {
  return (
    <div className="w-full flex flex-col items-center px-10">
      <div
        className={`mt-10 font-bold text-5xl text-center ${bangers.className}`}
      >
        Discovery
      </div>
      <div className=" text-lg text-gray-600">
        Explore your favorite club in{" "}
        <span className={`${bangers.className} text-purple-500`}>ClubCast</span>{" "}
        Enjoy the exlusive membership content and share your thoughts with the
        creators. Have fun!!
      </div>

      <div className="w-[80%] mt-10 grid grid-cols-5 gap-5">
        {allClubs.map((club) => {
          return (
            <div key={club.id} className="w-full flex justify-center">
              <ClubCard club={club} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
