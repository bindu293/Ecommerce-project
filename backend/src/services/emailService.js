// Email Service
// Handles sending emails for order confirmations and notifications

const transporter = require('../../config/email');

/**
 * Send Order Confirmation Email
 * Sends a professional order confirmation email to customer
 */
const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
  try {
    const { orderId, userName, items, total } = orderDetails;

    // Create items HTML
    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Order Confirmed! 🎉</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hi ${userName},</p>
          
          <p style="font-size: 16px;">Thank you for your order! We're excited to get your items to you soon.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #667eea; margin-top: 0;">Order Details</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #667eea; color: white;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Quantity</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #667eea; font-size: 18px;">$${total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p style="font-size: 14px; color: #666;">We'll send you a shipping confirmation email as soon as your order ships.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #666;">
              Questions? Contact us at <a href="mailto:support@aiecommerce.com" style="color: #667eea;">support@aiecommerce.com</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2025 AI E-Commerce. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"AI E-Commerce" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: htmlContent,
      text: `Order Confirmed! Order ID: ${orderId}. Total: $${total}. Thank you for shopping with us!`,
    });

    console.log('✅ Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send Marketing Email
 * Sends promotional emails to customers
 */
const sendMarketingEmail = async (toEmail, subject, content) => {
  try {
    const info = await transporter.sendMail({
      from: `"AI E-Commerce" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: content,
    });

    console.log('✅ Marketing email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending marketing email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendMarketingEmail,
};
