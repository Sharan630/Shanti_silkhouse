const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendOrderConfirmationEmail = async (email, order, cartItems) => {
  try {
    // Only attempt to send if credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Skipping order confirmation email.');
      return false;
    }

    const transporter = createTransporter();

    // Create a nice HTML table of the ordered items
    const itemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || item.product_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px; background-color: #d4af37; color: white;">
          <h1 style="margin: 0;">Shanti Silk House</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #d4af37; margin-top: 0;">Order Confirmation</h2>
          <p>${(order.payment_method === 'cod' || order.paymentMethod === 'cod') ? `Cash on Delivery &mdash; pay ₹${order.total_amount || order.totalAmount} upon delivery.` : 'Thank you for your order! Your order has been successfully placed.'}</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary</h3>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Payment Method:</strong> ${order.payment_method || order.paymentMethod}</p>
          </div>

          <table style="width: 100%; background-color: white; border-collapse: collapse; border-radius: 5px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f1f1f1;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #d4af37;">₹${order.total_amount || order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 20px; background-color: white; padding: 15px; border-radius: 5px;">
            <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Shipping Details</h3>
            <p style="line-height: 1.5; margin: 0;">
              ${order.shipping_address || order.shippingAddress}
            </p>
          </div>
          
          <p style="margin-top: 30px; font-size: 0.9em; color: #666; text-align: center;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: \`"Shanti Silk House" <\${process.env.EMAIL_USER}>\`,
      to: email,
      subject: \`Order Confirmation - Order #\${order.id}\`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail
};
