export function formatPrice(value) {
  const number = Number(value) || 0;
  return `₹${Math.round(number).toLocaleString('en-IN')}`;
}

export function generateOrderId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `MSY-${random}`;
}
