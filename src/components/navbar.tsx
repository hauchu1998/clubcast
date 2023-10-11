import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAccount, useDisconnect } from "wagmi";
import { bangers } from "@/styles/fonts";
import { type Signer, useClient } from "@xmtp/react-sdk";
import { useEffect } from "react";
import { useInboxStore } from "@/store/inbox";
import { useIsConnected } from "@/hooks/useIsConnected";

const Navbar = () => {
  const router = useRouter();
  const isConnected = useIsConnected();
  const { signer: xmtpSigner, disconnect } = useClient();
  const { address: walletAddress } = useAccount();
  const resetInboxState = useInboxStore((state) => state.resetInboxState);
  const { disconnect: wagmiDisconnect, reset: wagmiReset } = useDisconnect();
  const { pathname } = router;
  const handleDisconnect = () => {
    disconnect();
    router.replace("/login");
  };

  useEffect(() => {
    const checkSigners = async () => {
      const address1 = await (xmtpSigner as Signer)?.getAddress();
      const address2 = walletAddress;
      // addresses must be defined before comparing
      if (address1 && address2 && address1 !== address2) {
        resetInboxState();
        void disconnect();
        wagmiDisconnect();
        wagmiReset();
      }
    };
    void checkSigners();
  }, [
    xmtpSigner,
    walletAddress,
    disconnect,
    resetInboxState,
    wagmiDisconnect,
    wagmiReset,
  ]);

  return (
    <div className="fixed top-0 w-full flex justify-between items-center gap-5 px-10 text-xl border-b border-black h-[4.5rem] bg-colors">
      <Image
        src="/logo4.png"
        alt="Padcast Logo"
        width={150}
        height={30}
        priority
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-10 text-3xl ${bangers.className}`}
      >
        <Link
          href="/about"
          className={`${
            pathname == "/about" ? "font-bold text-purple-600" : ""
          } hover:text-cyan-400`}
        >
          About
        </Link>
        <Link
          href="/dashboard"
          className={`${
            pathname == "/dashboard" ? "font-bold text-purple-600" : ""
          } hover:text-cyan-400`}
        >
          Dashboard
        </Link>
        <Link
          href="/explore"
          className={`${
            pathname == "/explore" ? "font-bold text-purple-600" : ""
          } hover:text-cyan-400`}
        >
          Explore
        </Link>
      </div>
      <button
        className={`${
          isConnected ? "visible" : "invisible"
        } bg-black text-white font-bold px-4 rounded-full py-2 hover:text-orange-400`}
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
    </div>
  );
};

export default Navbar;
