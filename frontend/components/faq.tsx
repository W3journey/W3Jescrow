import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Typography } from "@/components/ui/typography"

const questionsAndAnswers = [
  {
    question: "How Do I Create an Escrow Contract?",
    answer: `Simply select who you want as an arbiter, who the beneficiary should
    be, the fee (if any) for the arbiter, and the amount you would like
    to deposit. We take care of the rest.`,
  },
  {
    question: "What Cryptocurrencies Are Supported?",
    answer: `Ethereum.`,
  },
  {
    question: "How Are Fees Calculated?",
    answer: `Arbiter fee is the only fee, and you decide what you want it to be.`,
  },
  {
    question: "Are There Any Geographic Restrictions?",
    answer: `Our service is available for anyone with an Ethereum wallet.`,
  },
  {
    question: "Is My Personal Information Secure?",
    answer: `We do not collect any personal information.`,
  },
]

const Faq = () => {
  return (
    <div className="mt-24 space-y-12">
      <Typography
        as="h2"
        variant="h2"
        className="max-w-2xl mx-auto border-b-0 lg:text-center"
      >
        Frequently Asked Questions
      </Typography>
      <Accordion type="single" collapsible className="">
        {questionsAndAnswers.map((item, index) => (
          <AccordionItem
            value={`item-${index}`}
            key={item.question}
            className="px-10 py-2 my-2 border rounded shadow-lg"
          >
            <AccordionTrigger className="text-lg font-semibold tracking-tight min-w-[250px]">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm font-medium">
              <div className="flex flex-wrap max-w-[250px]">{item.answer}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
export default Faq
