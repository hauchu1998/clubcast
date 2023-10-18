import { randomBytes } from "crypto";
export const generateRandomId = () => randomBytes(16).toString("hex");
