import { IconType } from "react-icons"
import { RxSun, RxMoon, RxTwitterLogo, RxGithubLogo } from "react-icons/rx"
import { IconBaseProps } from "react-icons/lib"
import Image from "next/image"

export type Icon = IconType

export const Icons = {
  sun: RxSun,
  moon: RxMoon,
  twitter: RxTwitterLogo,
  logo: () => (
    <Image
      src="/Web3Journey-256.png"
      alt="Logo"
      width={32}
      height={32}
      priority
      className="object-fit"
    />
  ),
  gitHub: RxGithubLogo,
}
