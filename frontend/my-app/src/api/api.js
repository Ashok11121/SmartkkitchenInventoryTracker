const API_URL = "http://localhost:5000/api/items";

export const getItems = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addItem = async (item) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const deleteItem = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
const PRODUCT_API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const res = await fetch(PRODUCT_API_URL);
  return res.json();
};

export const getProductsByCategory = async (category) => {
  const res = await fetch(`${PRODUCT_API_URL}/category/${category}`);
  return res.json();
};