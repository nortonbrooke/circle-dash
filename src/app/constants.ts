export type User = {
  id: number
  name: string
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  BTC = "BTC",
}

export type Payment = {
  id: string
  date: string
  sender: {
    id: number
    name: string
  }
  receiver: {
    id: number
    name: string
  }
  amount: string
  currency: Currency
  memo: string
}
