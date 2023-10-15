import { randomBytes } from "crypto";
export const generateRandomNumber = () => randomBytes(16).toString("hex");
