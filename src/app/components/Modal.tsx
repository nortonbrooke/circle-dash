export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "500px",
          zIndex: 1000,
        }}
      >
        {children}
        <div style={{ marginTop: "10px" }}>
          <button className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>
    </>
  )
}
