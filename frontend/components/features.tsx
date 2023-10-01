import {
  FaFingerprint,
  FaSistrix,
  FaGlobe,
  FaArrowTrendDown,
} from "react-icons/fa6"

const featuresConfig = [
  {
    icon: <FaFingerprint className="text-blue-600 w-9 h-9" />,
    header: "Security",
    text: `Smart contracts are built on blockchain technology, which provides a
    high level of security. Funds or assets held in the escrow are protected
    from fraud or unauthorized access.`,
  },
  {
    icon: <FaSistrix className="text-amber-500 w-9 h-9" />,
    header: "Transparency",
    text: `The blockchain ledger is publicly accessible and transparent. Users can verify the status and history of the escrow contract, ensuring transparency in the transaction process.`,
  },
  {
    icon: <FaGlobe className="text-green-500 w-9 h-9" />,
    header: "Global Access",
    text: `Smart contracts operate on a decentralized blockchain, providing access to users worldwide, regardless of their location or banking system.`,
  },
  {
    icon: <FaArrowTrendDown className="text-green-600 w-9 h-9" />,
    header: "Lower Costs",
    text: `By eliminating intermediaries, such as banks or payment processors, users can save on transaction fees and administrative costs.`,
  },
]

interface FeatureIconProps {
  icon: React.ReactNode
  header: string
  text: string
}
const Feature: React.FC<FeatureIconProps> = ({ icon, header, text }) => {
  return (
    <div>
      <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-secondary">
        {icon}
      </div>
      <h3 className="mt-8 text-xl font-semibold tracking-tight">{header}</h3>
      <p className="mt-4 text-sm font-medium">{text}</p>
    </div>
  )
}
const Features = () => {
  return (
    <div className="grid grid-cols-1 mt-24 text-center gap-y-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
      {featuresConfig.map((feature) => (
        <Feature
          key={feature.header}
          header={feature.header}
          text={feature.text}
          icon={feature.icon}
        />
      ))}
    </div>
  )
}
export default Features
