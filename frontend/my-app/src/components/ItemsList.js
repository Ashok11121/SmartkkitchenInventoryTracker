export default function ItemList({ items, onDelete }) {
  const today = new Date();

  const daysLeft = (expiry) => Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="inventory-grid">
      {items.map((item) => {
        const expiry = new Date(item.expiryDate);
        const left = daysLeft(item.expiryDate);
        const isExpiring = left <= 3;

        return (
          <div key={item._id} className={`item-card ${isExpiring ? "expiring" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{item.name}</div>
              <div style={{ textAlign: "right", color: isExpiring ? "#dc2626" : "#16a34a", fontWeight: 700 }}>{left < 0 ? "Expired" : `${left}d`}</div>
            </div>
            <div style={{ marginTop: 8, color: "#64748b" }}>Qty: {item.quantity}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={() => onDelete(item._id)} className="delete-btn">Remove</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}