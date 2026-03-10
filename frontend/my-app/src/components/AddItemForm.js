import { useState } from "react";
import { addItem } from "../api/api";

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newItem = await addItem({ name, quantity, expiryDate });
      onAdd(newItem);
      setName("");
      setQuantity(1);
      setExpiryDate("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-bar card" style={{ alignItems: "center" }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name (e.g. Milk)" required />
      <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Qty" required style={{ width: 100 }} />
      <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required style={{ width: 180 }} />
      <button type="submit" className="primary-btn" style={{ width: "auto" }}>+ Add</button>
    </form>
  );
}