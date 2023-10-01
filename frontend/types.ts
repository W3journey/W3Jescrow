export interface EscrowContract {
  address: string
  arbiter: string
  beneficiary: string
  depositor: string
  escrowAmount: string
  feeBps: string
  isApproved: boolean
}

export type PromiseResult<T> =
  | {
      status: "fulfilled"
      value: T
    }
  | {
      status: "rejected"
      reason: any
    }

export type ValidRoleQuery = keyof EscrowContract

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}
