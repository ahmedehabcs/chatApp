import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export function generatePublicKey(){
    return crypto.randomBytes(6).toString("hex");
}
export function generatePrivateKey(){
    return uuidv4();
}