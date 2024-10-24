import React, { useState, useEffect, useRef } from "react"
import { Currency, Payment, User } from "@/app/constants"

export default function PaymentForm({
  onSuccess,
}: {
  onSuccess: (newPayment: Payment) => void
}) {
  const [users, setUsers] = useState<User[]>([])
  const [senderId, setSenderId] = useState<string>("")
  const [receiverId, setReceiverId] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [currency, setCurrency] = useState<Currency>(Currency.USD)
  const [memo, setMemo] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const isRetrying = useRef(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/users")
        const { data } = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const submitPayment = async () => {
    const data = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sender: {
        id: parseInt(senderId),
        name: users.find((user) => user.id.toString() === senderId)?.name ?? "",
      },
      receiver: {
        id: parseInt(receiverId),
        name:
          users.find((user) => user.id.toString() === receiverId)?.name ?? "",
      },
      amount,
      currency,
      memo,
    }

    try {
      setIsLoading(true)
      setError("")
      const response = await fetch("http://localhost:8080/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.status === 201) {
        onSuccess(data)
      } else if (response.status === 503) {
        // Retry after 1 second
        console.log("Retrying payment...")
        isRetrying.current = true
        setTimeout(submitPayment, 1000)
      } else if (response.status === 409) {
        setError("Payment already exists.")
      } else if (response.status === 400) {
        const { error } = await response.json()
        setError(`Invalid payment data: ${error}.`)
      } else {
        setError("Unexpected error, please try again.")
        console.error("Unexpected error:", response.status)
      }
    } catch (error) {
      setError("Unexpected error, please try again.")
      console.error("Error submitting payment:", error)
    } finally {
      if (!isRetrying.current) {
        setIsLoading(false)
      }
    }
  }

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
      onSubmit={(e) => {
        e.preventDefault()
        submitPayment()
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label>Sender</label>
        <select
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          required
        >
          <option value="">Select Sender</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label>Receiver</label>
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
        >
          <option value="">Select Receiver</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label>Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          required
        >
          {Object.values(Currency).map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label>Memo</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Optional memo"
        />
      </div>
      <button type="submit">
        {isLoading ? "Submitting..." : "Submit Payment"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  )
}
