import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const { user } = useAuth()

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + qty } : p)
      return [...prev, { ...product, qty }]
    })
    // Sync to backend cart if authenticated
    if (user && product?.id) {
      api.post('/cart', { productId: String(product.id), quantity: qty }).catch(() => {})
    }
  }
  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id))
  const updateQty = (id, qty) => setItems((prev) => prev.map((p) => p.id === id ? { ...p, qty } : p))
  const clear = () => setItems([])

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items])

  // When user logs in, sync local cart with backend and/or load server cart
  useEffect(() => {
    const syncOnLogin = async () => {
      if (!user) return
      try {
        const res = await api.get('/cart')
        const serverItems = res.data?.data?.items || res.data?.items || []
        if (serverItems && serverItems.length > 0) {
          // Prefer server cart to avoid duplication
          setItems(serverItems.map(si => ({
            id: si.productId,
            name: si.name,
            price: si.price,
            image: si.image,
            qty: si.quantity,
          })))
        } else if (items.length > 0) {
          // Push local items to backend if server cart is empty
          await Promise.all(items.map(it => (
            api.post('/cart', { productId: String(it.id), quantity: it.qty })
          )))
        }
      } catch (_) { /* ignore sync errors */ }
    }
    syncOnLogin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, total }}>
      {children}
    </CartCtx.Provider>
  )
}

export function useCart() { return useContext(CartCtx) }
