import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (amount, currency = 'INR', receipt = null) => {
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentId, orderId, signature) => {
  try {
    const crypto = await import('crypto');
    
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const capturePayment = async (paymentId, amount) => {
  try {
    const payment = await razorpay.payments.capture(paymentId, amount * 100);
    return payment;
  } catch (error) {
    console.error('Error capturing payment:', error);
    throw error;
  }
};

export const refundPayment = async (paymentId, amount) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100
    });
    return refund;
  } catch (error) {
    console.error('Error refunding payment:', error);
    throw error;
  }
};