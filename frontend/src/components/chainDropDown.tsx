import Image from "next/image";
import { networksIcon } from "@/constants/networks";
import { useMemo, useState } from "react";
import { set } from "date-fns";
import { useNetwork, useSwitchNetwork } from "wagmi";

const ChainDropDown = () => {
  const [isShow, setIsShow] = useState(false);
  const { chain } = useNetwork();
  const icon = useMemo(() => {
    if (!chain) return networksIcon["80001"];
    return networksIcon[chain.id];
  }, [chain]);
  const { switchNetwork } = useSwitchNetwork();

  const handleChainChange = (chainId: string) => {
    if (chain?.id !== Number(chainId)) {
      switchNetwork?.(Number(chainId));
    }
    setIsShow(false);
  };
  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-color px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-black"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <Image
            className="rounded-full"
            src={icon}
            alt="selected-chain"
            width={30}
            height={30}
          />
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            onClick={() => setIsShow(!isShow)}
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isShow && (
        <div className="absolute right-0 z-50 mt-2 rounded-md bg-color ring-2">
          <div className="py-1 flex flex-col items-center" role="none">
            {Object.keys(networksIcon).map((key) => {
              return (
                <button
                  key={key}
                  className="px-4 py-2 bg-color"
                  id={key}
                  onClick={() => handleChainChange(key)}
                >
                  <Image
                    className="rounded-full"
                    src={networksIcon[key]}
                    alt="selected-chain"
                    width={30}
                    height={30}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChainDropDown;
