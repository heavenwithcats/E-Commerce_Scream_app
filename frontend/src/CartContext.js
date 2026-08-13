    const [orders, setOrders] = useState(() => {
  const savedOrders = localStorage.getItem('stab_past_orders');
  return savedOrders ? JSON.parse(savedOrders) : [];
});