import React, { useState } from 'react'
import { Alert, Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import { useCart } from '../context/CartContext'
import api from '../services/api'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [status, setStatus] = useState(null)

  const submit = async () => {
    try {
      if (!shippingAddress.trim()) {
        setStatus({ ok: false, msg: 'Please enter a shipping address' })
        return
      }
      if (!paymentMethod) {
        setStatus({ ok: false, msg: 'Please select a payment method' })
        return
      }
      // Ensure backend cart has items: sync local items if needed
      try {
        const cartRes = await api.get('/cart')
        const serverItems = cartRes.data?.data?.items || cartRes.data?.items || []
        if ((!serverItems || serverItems.length === 0) && items.length > 0) {
          await Promise.all(items.map(it => (
            api.post('/cart', { productId: String(it.id), quantity: it.qty })
          )))
        }
      } catch (_) { /* ignore cart precheck errors */ }

      // Backend expects shippingAddress and paymentMethod, and reads cart from server-side
      const res = await api.post('/orders', { shippingAddress, paymentMethod })
      const orderId = res.data?.data?.orderId || res.data?.orderId
      setStatus({ ok: true, id: orderId || 'success' })
      clear()
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || e.message
      setStatus({ ok: false, msg })
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Checkout</Typography>
      <Typography sx={{ mb: 2 }}>Total: ${total.toFixed(2)}</Typography>

      <TextField
        label="Shipping Address"
        fullWidth
        multiline
        minRows={2}
        sx={{ mb: 2 }}
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
      />

      <TextField
        label="Payment Method"
        select
        fullWidth
        sx={{ mb: 2 }}
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <MenuItem value="card">Card</MenuItem>
        <MenuItem value="cod">Cash on Delivery</MenuItem>
      </TextField>

      <Button variant="contained" onClick={submit} disabled={!items.length}>Place Order</Button>
      {status && (
        status.ok ? <Alert sx={{ mt: 2 }} severity="success">Order placed! ID: {status.id}</Alert> :
        <Alert sx={{ mt: 2 }} severity="error">{status.msg}</Alert>
      )}
    </Box>
  )
}
