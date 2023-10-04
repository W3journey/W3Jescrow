export const IS_DEV_ENV = process.env.NODE_ENV === "development"

const registry_dev = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"
const registry_prod = "0x3B5Ca35f543181D18E5Ec4863126e5f7A82dB6E8"

export const registryAddress = IS_DEV_ENV
  ? registry_dev
  : (registry_prod as typeof registry_dev)
