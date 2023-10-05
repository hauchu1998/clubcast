export function classNames(...classes: (string | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const recipientPillInputStyle = (userIsSender: boolean) =>
  classNames(
    "rounded-2xl",
    "p-1",
    "border",
    "text-md",
    "focus:outline-none",
    "focus:ring-0",
    "font-bold",
    "font-mono",
    "overflow-visible",
    "text-center",
    "select-none",
    "border-black",
    userIsSender ? "bg-colors" : "bg-black",
    userIsSender ? "text-black" : "text-[#fff7e8]"
  );
