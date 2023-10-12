import { ClubCard } from "@/types/club";

export const personalClubs: ClubCard[] = [
  {
    id: "asdfasdf",
    name: "Scroll",
    description:
      "Scroll is a decentralized social media platform built on Ethereum.",
    image: "https://www.iab.com/wp-content/uploads/2020/05/iab-podcasts.png",
  },
  {
    id: "gjitsknksad",
    name: "Sepolia",
    description:
      "Sepolia is a decentralized social media platform built on Ethereum.",
    image:
      "https://www.ojp.gov/sites/g/files/xyckuh241/files/images/2022-04/JusticeToday_logo_1400x1400.png",
  },
];

export const subscribedClubs: ClubCard[] = [
  {
    id: "tiskdnfa",
    name: "iPodcast",
    description:
      "iPodcast is a decentralized social media platform built on Ethereum.",
    image:
      "https://media.istockphoto.com/id/1283532997/vector/podcast-concept-thin-line-icon-abstract-icon-abstract-gradient-background-modern-sound-wave.jpg?s=612x612&w=0&k=20&c=YLg7rHeSuYqeIuGRAcvf2a7J8X8Sx-IkmqYHXIJGPYQ=",
  },
  {
    id: "gdogowvms",
    name: "Around NFL",
    description:
      "Around NFL is a decentralized social media platform built on Ethereum.",
    image:
      "https://static.www.nfl.com/image/private/f_auto/league/whc8rsfa68onzz0nn7xj",
  },
];

export const allClubs: ClubCard[] = [...personalClubs, ...subscribedClubs];
