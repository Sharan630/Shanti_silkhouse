const Razorpay = require('razorpay');

const getRazorpayKeys = () => ({
  keyId: (process.env.RAZORPAY_KEY_ID || '').trim(),
  keySecret: (process.env.RAZORPAY_KEY_SECRET || '').trim()
});

const isRazorpayConfigured = () => {
  const { keyId, keySecret } = getRazorpayKeys();
  return Boolean(
    keyId &&
    keySecret &&
    keyId !== 'rzp_test_placeholder' &&
    keySecret !== 'placeholder_secret' &&
    keyId.startsWith('rzp_')
  );
};

const getRazorpayInstance = () => {
  if (!isRazorpayConfigured()) {
    return null;
  }

  const { keyId, keySecret } = getRazorpayKeys();
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

module.exports = {
  getRazorpayKeys,
  isRazorpayConfigured,
  getRazorpayInstance
};
