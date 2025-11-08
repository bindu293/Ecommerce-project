# 📧 Email Notification Setup Guide

## Status
✅ Email code is **ready and working**  
⚠️ Just needs Gmail configuration

## How to Enable Email Notifications

### Step 1: Get Gmail App Password

1. Go to your **Google Account**: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Scroll down to **App passwords**
5. Click **App passwords**
6. Select:
   - App: **Mail**
   - Device: **Other (Custom name)** → Enter "AI E-commerce"
7. Click **Generate**
8. Copy the **16-character password** (format: xxxx xxxx xxxx xxxx)

### Step 2: Update .env File

Edit `backend/.env` and add your credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 3: Restart Backend Server

```powershell
cd C:\Users\hp\ai-ecommerce\backend
npm start
```

### Step 4: Test Email

1. Open: http://localhost:8080/test-ai.html
2. Login with your account
3. Click "Test Order (Triggers Email)"
4. Check your email inbox!

## What Triggers Email Notifications?

📧 **Order Confirmation Email** - Sent automatically when:
- User places an order (checkout)
- Email includes:
  - Order ID
  - Product list with quantities and prices
  - Total amount
  - Beautiful HTML template with your brand colors

## Email Template Preview

The email looks like this:

```
┌─────────────────────────────────────┐
│   Order Confirmed! 🎉               │  <- Purple gradient header
├─────────────────────────────────────┤
│ Hi [User Name],                     │
│                                     │
│ Thank you for your order!           │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Order Details               │   │
│ │ Order ID: ABC123            │   │
│ │                             │   │
│ │ Product          Qty  Price │   │
│ │ Smart Watch       1  $299.99│   │
│ │ Wireless Mouse    2   $49.98│   │
│ │                             │   │
│ │ Total:            $349.97   │   │
│ └─────────────────────────────┘   │
│                                     │
│ We'll send shipping confirmation    │
│ soon!                               │
│                                     │
│ Questions? support@aiecommerce.com  │
└─────────────────────────────────────┘
```

## Backend Console Messages

When email works, you'll see:
```
✅ Order confirmation email sent: <message-id>
```

When email fails (no config), you'll see:
```
❌ Email sending failed: [error details]
```

**Note:** Order will still be created even if email fails!

## Troubleshooting

### "Invalid credentials"
- Make sure you're using **App Password**, not your regular Gmail password
- Remove any spaces from the app password in .env

### "Less secure app access"
- You **must** use App Passwords (requires 2-Step Verification)
- Don't use "Allow less secure apps" option (deprecated by Google)

### Email not received
- Check spam folder
- Verify EMAIL_USER matches your Gmail address
- Check backend console for email sending logs

## Alternative: Use Other Email Services

Instead of Gmail, you can use:

### SendGrid (Free 100 emails/day)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun (Free 5,000 emails/month)
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

## Testing Without Email

If you don't want to set up email now, you can:
1. Check backend console logs - it will show "Email sending failed" but order still works
2. Test all other features (AI recommendations work independently!)
