import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDisconnect } from "wagmi";
import { bangers } from "@/styles/fonts";

const Navbar = () => {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { pathname } = router;
  const handleDisconnect = () => {
    disconnect();
    router.replace("/login");
  };
  return (
    <div className="fixed top-0 w-full flex justify-between items-center gap-5 px-10 text-xl border-b border-black h-[4.5rem] bg-colors">
      <Image src="/logo.png" alt="Padcast Logo" width={200} height={50} />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-10 text-3xl ${bangers.className}`}
      >
        <Link
          href="/about"
          className={pathname == "/about" ? "font-bold text-purple-600" : ""}
        >
          About
        </Link>
        <Link
          href="/dashboard"
          className={
            pathname == "/dashboard" ? "font-bold text-purple-600 " : ""
          }
        >
          Dashboard
        </Link>
        <Link
          href="/explore"
          className={pathname == "/explore" ? "font-bold text-purple-600" : ""}
        >
          Explore
        </Link>
      </div>
      <button
        className="bg-black text-white font-bold px-4 rounded-full py-2"
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
    </div>
  );
};

export default Navbar;
