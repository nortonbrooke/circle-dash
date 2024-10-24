"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Payment } from "@/app/constants"
import PaymentForm from "./components/PaymentForm"

import styles from "./page.module.css"
import Modal from "./components/Modal"

export default function Home() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] =
    useState<boolean>(false)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://localhost:8080/payments")
        const { data } = await response.json()
        setPayments((prevPayments) => [
          ...prevPayments,
          {
            id: data.id,
            sender: data.sender,
            receiver: data.receiver,
            amount: data.amount,
            currency: data.currency,
            date: data.date,
            memo: data.memo,
          },
        ])
      } catch (error) {
        console.error("Error fetching payments:", error)
      }
    }

    // Fetch payments every second
    const interval = setInterval(fetchPayments, 1000)

    // Cleanup on unmount
    return () => clearInterval(interval)
  }, [])

  const filteredPayments = useMemo(() => {
    const searchQueryLower = searchQuery.toLowerCase()
    return payments
      .filter(
        (payment: Payment) =>
          payment.id.includes(searchQuery) ||
          payment.sender.id.toString().includes(searchQuery) ||
          payment.receiver.id.toString().includes(searchQuery) ||
          payment.sender.name.toLowerCase().includes(searchQueryLower) ||
          payment.receiver.name.toLowerCase().includes(searchQueryLower) ||
          payment.amount.includes(searchQuery) ||
          payment.currency.toLowerCase().includes(searchQueryLower) ||
          payment.date.toLowerCase().includes(searchQueryLower) ||
          payment.memo.toLowerCase().includes(searchQueryLower)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 25)
  }, [searchQuery, payments])

  const onNewPayment = useCallback((newPayment: Payment) => {
    setPayments((prevPayments) => [...prevPayments, newPayment])
    setIsNewPaymentModalOpen(false)
  }, [])

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {isNewPaymentModalOpen && (
          <Modal onClose={() => setIsNewPaymentModalOpen(false)}>
            <PaymentForm onSuccess={onNewPayment} />
          </Modal>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div>
            <button onClick={() => setIsNewPaymentModalOpen(true)}>
              New Payment
            </button>
          </div>
        </div>
        <h1>Payments</h1>
        <div>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                alignItems: "center",
                gap: "10px",
                borderBottom: "1px solid #e0e0e0",
                padding: "20px 0",
              }}
            >
              <b>Sender</b>
              <b>Receiver</b>
              <b>Amount</b>
              <b>Currency</b>
              <b>Date</b>
              <b>Memo</b>
            </div>
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  alignItems: "center",
                  gap: "10px",
                  borderBottom: "1px solid #e0e0e0",
                  padding: "20px 0",
                }}
              >
                <div>{payment.sender.name}</div>
                <div>{payment.receiver.name}</div>
                <div>{payment.amount}</div>
                <div>{payment.currency}</div>
                <div>{new Date(payment.date).toLocaleString()}</div>
                <div>{payment.memo}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
