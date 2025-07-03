const Razorpay = require('razorpay');

exports.createOrder = async (req, res) => {
  console.log('🔐 Razorpay ENV CHECK - KEY_ID:', process.env.RAZORPAY_KEY_ID);
  console.log('🔐 Razorpay ENV CHECK - SECRET:', process.env.RAZORPAY_SECRET);

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ message: "Payment order failed", error: err.message });
  }
};
