const SESSION_ID_LENGTH = 32;
import { randomBytes } from "crypto";

export const generateSessionId = () => {
  // add checking to ensure unique
  return randomBytes(SESSION_ID_LENGTH).toString("hex");
};
