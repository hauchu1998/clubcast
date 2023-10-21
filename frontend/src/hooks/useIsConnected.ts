import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useIsConnected() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const { isConnected: _isConnected } = useAccount();
  useIsomorphicLayoutEffect(() => {
    setIsConnected(_isConnected);
    if (_isConnected) {
      router.push("/login");
    }
  }, [_isConnected]);

  return isConnected;
}
