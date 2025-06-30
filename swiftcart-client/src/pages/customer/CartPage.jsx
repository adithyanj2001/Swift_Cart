import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', phone: '', address: '', pin: '', state: '', paymentMethod: 'Cash',
    cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', cvv: ''
  });

  const navigate = useNavigate();

  // Fetch cart 
  useEffect(() => {
    API.get('/cart')
      .then((res) => {
        const validItems = (res.data.items || []).filter(item => item.productId);
        setCartItems(validItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load cart:', err);
        alert('Failed to load cart.');
        setLoading(false);
      });
  }, []);

  // Remove individual item
  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/item/${productId}`);
      setCartItems(prev => prev.filter(item => item.productId?._id !== productId));
      setSelectedItems(prev => prev.filter(id => id !== productId));
    } catch (err) {
      console.error('Remove error:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'Error removing item');
    }
  };

  // Toggle selection
  const toggleSelectItem = (productId) => {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getSelectedTotal = () =>
    cartItems
      .filter(item => selectedItems.includes(item.productId._id))
      .reduce((sum, item) => sum + (item.productId.price * item.qty), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = (() => {
      if (name === 'phone') return value.replace(/\D/g, '').slice(0, 10);
      if (name === 'cvv') return value.replace(/\D/g, '').slice(0, 3);
      if (name === 'cardNumber') return value.replace(/\D/g, '').slice(0, 16);
      return value;
    })();
    setForm(prev => ({ ...prev, [name]: updatedValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim() || form.phone.length !== 10) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.pin.trim()) newErrors.pin = 'PIN Code is required';
    if (!form.state.trim()) newErrors.state = 'State is required';

    if (form.paymentMethod === 'Online') {
      if (!form.cardNumber || form.cardNumber.length < 16) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!form.cardHolderName.trim()) newErrors.cardHolderName = 'Cardholder name is required';
      if (!form.expiryMonth || !form.expiryYear) newErrors.expiry = 'Expiry month and year required';
      if (!form.cvv || form.cvv.length !== 3) newErrors.cvv = 'Enter a valid 3-digit CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order placement
  const handlePayment = async () => {
    if (selectedItems.length === 0) return alert("Please select items to order.");
    if (!validateForm()) return;

    try {
      const res = await API.post('/orders', {
        paymentMethod: form.paymentMethod,
        name: form.name,
        phone: form.phone,
        address: form.address,
        pin: form.pin,
        state: form.state,
        selectedItems
      });

      console.log("Order Response:", res.data);

      // Remove ordered items
   
setCartItems(prev => prev.filter(item => !selectedItems.includes(item.productId._id)));


      setCartItems(prev => prev.filter(item => !selectedItems.includes(item.productId._id)));
      setSelectedItems([]);
      setShowCheckout(false);

      setTimeout(() => {
        alert("Order placed successfully!");
        navigate('/customer/payment-success');
      }, 1000);

    } catch (err) {
      console.error("Order failed:", err);
      alert('Order failed: ' + (err.response?.data?.message || 'Unknown server error'));
    }
  };

  if (loading) return <div className="p-6">Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => {
              if (!item.productId) return null;

              return (
                <div key={item.productId._id} className="flex items-center border p-4 rounded shadow bg-white">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId._id)}
                    onChange={() => toggleSelectItem(item.productId._id)}
                    className="mr-2"
                  />
                  <img src={item.productId.imageUrl} alt={item.productId.name} className="w-24 h-24 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                    <p className="text-sm text-gray-600">{item.productId.category}</p>
                    <p className="font-bold text-green-600">₹{item.productId.price} × {item.qty}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-bold">Selected Total: ₹{getSelectedTotal()}</h3>
            {!showCheckout && (
              <button
                onClick={() => setShowCheckout(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            )}
          </div>

          {showCheckout && (
            <div className="mt-8 border p-6 rounded bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Shipping & Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'phone', 'address', 'pin', 'state'].map((field) => (
                  <div key={field}>
                    <input
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={form[field]}
                      onChange={handleInputChange}
                      className={`border p-2 rounded w-full ${errors[field] ? 'border-red-500' : ''}`}
                    />
                    {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
                  </div>
                ))}
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="Cash">Cash on Delivery</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>

              {form.paymentMethod === 'Online' && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="cardNumber" placeholder="Card Number" value={form.cardNumber}
                    onChange={handleInputChange}
                    className={`border p-2 rounded w-full ${errors.cardNumber ? 'border-red-500' : ''}`}
                  />
                  <input name="cardHolderName" placeholder="Cardholder Name" value={form.cardHolderName}
                    onChange={handleInputChange}
                    className={`border p-2 rounded w-full ${errors.cardHolderName ? 'border-red-500' : ''}`}
                  />
                  <div className="flex gap-2">
                    <select name="expiryMonth" value={form.expiryMonth} onChange={handleInputChange}
                      className="border p-2 rounded w-full">
                      <option value="">Month</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select name="expiryYear" value={form.expiryYear} onChange={handleInputChange}
                      className="border p-2 rounded w-full">
                      <option value="">Year</option>
                      {[...Array(10)].map((_, i) => {
                        const year = new Date().getFullYear() + i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                  {errors.expiry && <p className="text-red-500 text-xs col-span-2">{errors.expiry}</p>}
                  <input
                    name="cvv"
                    placeholder="CVV"
                    value={form.cvv}
                    onChange={handleInputChange}
                    className={`border p-2 rounded w-full ${errors.cvv ? 'border-red-500' : ''}`}
                  />
                  {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                </div>
              )}

              <button
                onClick={handlePayment}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {form.paymentMethod === 'Online' ? 'Pay Now' : 'Order Now'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
