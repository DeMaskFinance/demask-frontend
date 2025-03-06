import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shorten = (hash: string, head?: number, tail?: number) => {
  const n = hash?.length;

  if (n > 10) {
    return hash?.slice(0, head || 10) + "..." + hash?.slice(n - (tail || 6));
  }

  return hash;
};
