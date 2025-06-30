import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Checkout() {
  const navigate = useNavigate();

  const handlePayment = () => {
    //  payment success delay
    setTimeout(() => {
      alert('Payment successful!');
      navigate('/customer/orders');
    }, 2000);
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Processing Payment...</h1>
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
    </div>
  );
}

export default Checkout;
