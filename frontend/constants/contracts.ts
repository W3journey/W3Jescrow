import { IS_DEV_ENV } from "@/constants/chains"

const registry_dev = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const registry_prod = "0x3B5Ca35f543181D18E5Ec4863126e5f7A82dB6E8"

export const registryAddress = IS_DEV_ENV
  ? registry_dev
  : (registry_prod as typeof registry_dev)
