"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { isAddress, isError } from "ethers"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import SpinnerButton from "@/components/ui/spinner-button"
import CopyButton from "@/components/ui/copy-button"
import ConnectButton from "@/components/connect-button"
import Success from "@/app/new-escrow/components/success"

import { useEthereum } from "@/hooks/useEthereum"
import { toast } from "@/components/ui/use-toast"
import { revalidateEscrowsPage } from "@/app/action/revalidateEscrowsPage"
import { useDeployEscrowContract } from "@/hooks/useDeployEscrowContract"

const EthAddressSchema = z.custom<string>(isAddress, "Invalid Address")

const formSchema = z.object({
  arbiterAddr: EthAddressSchema,
  beneficiaryAddr: EthAddressSchema,
  amount: z.string().min(1).max(78),
  arbiterFee: z.coerce
    .number()
    .min(0, { message: "Fee percentage must be greater than or equal to 0" })
    .max(100, { message: "Fee percentage must be less than or equal to 100" }),
})

const NewContract = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { signer, connect, accounts } = useEthereum()
  const {
    contractAddress,
    setContractAddress,
    deployEscrowContract,
    txReceipt,
  } = useDeployEscrowContract()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arbiterAddr: "",
      beneficiaryAddr: "",
      amount: "",
      arbiterFee: 0,
    },
  })

  useEffect(() => {
    if (contractAddress) {
      toast({
        title: "Successfully deployed",
        description: `Address: ${contractAddress}`,
        action: <CopyButton value={contractAddress!} />,
      })
    }
  }, [contractAddress])

  useEffect(() => {
    connect()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (accounts.length) {
      connect()
    }
    // eslint-disable-next-line
  }, [accounts])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const beneficiary = values.beneficiaryAddr
      const arbiter = values.arbiterAddr
      const arbiterFee = values.arbiterFee
      const amount = values.amount

      await deployEscrowContract(arbiter, beneficiary, arbiterFee, amount)
      form.reset()
      revalidateEscrowsPage()
    } catch (error) {
      if (isError(error, "ACTION_REJECTED")) {
        toast({
          variant: "destructive",
          description: "User rejected.",
        })
      } else {
        console.log("Unexpected error:", error)
        toast({
          variant: "destructive",
          title: "Unexpected error.",
          description: "Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!contractAddress ? (
        <Card className="mx-auto border-none shadow-lg bg-gradient-to-br from-card to-background">
          <CardHeader>
            <CardTitle className="pb-2 text-3xl font-semibold tracking-tight text-center transition-colors first:mt-0">
              New Contract
            </CardTitle>
            <CardDescription className="text-sm text-center text-muted-foreground">
              Deploy a new escrow contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <Separator className="mt-5 mb-16" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-16"
              >
                {/* Arbiter Address */}
                <FormField
                  control={form.control}
                  name="arbiterAddr"
                  render={({ field }) => (
                    <FormItem className="md:col-start-1 md:row-start-1">
                      <FormLabel>Arbiter</FormLabel>
                      <FormControl>
                        <Input placeholder="0x0000...000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        The arbiter&apos;s address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="md:col-span-2 md:row-start-2" />

                {/* Beneficiary Address */}
                <FormField
                  control={form.control}
                  name="beneficiaryAddr"
                  render={({ field }) => (
                    <FormItem className="col-start-2 row-start-1">
                      <FormLabel>Beneficiary</FormLabel>
                      <FormControl>
                        <Input placeholder="0x0000...000000" {...field} />
                      </FormControl>
                      <FormDescription>
                        The beneficiary&apos;s address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="md:col-span-2 md:row-start-4" />

                {/* Arbiter Fee */}
                <FormField
                  control={form.control}
                  name="arbiterFee"
                  render={({ field }) => (
                    <FormItem className="row-start-3">
                      <FormLabel>Arbiter Fee %</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <Slider
                            defaultValue={[field.value]}
                            max={25}
                            step={0.5}
                            onValueChange={(value) =>
                              form.setValue("arbiterFee", value[0])
                            }
                            value={[field.value]}
                          />
                          <Input className="w-14" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Fee given to the arbiter
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="md:row-start-3">
                      <FormLabel>Deposit amount</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ethereum amount to deposit into the contract.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {signer && (
                  <SpinnerButton
                    className="mt-5 space-x-2 font-semibold md:mt-0 w-fit md:col-span-2 place-self-center bg-gradient-to-r from-primary to-accent text-accent-foreground"
                    disabled={!signer}
                    loading={isLoading}
                  >
                    Create Escrow
                  </SpinnerButton>
                )}
              </form>
            </Form>
            {!signer && (
              <div className="flex justify-center pt-16 ">
                <ConnectButton />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Success
          address={contractAddress}
          transaction={txReceipt}
          onNewContract={setContractAddress}
        />
      )}
    </>
  )
}
export default NewContract
