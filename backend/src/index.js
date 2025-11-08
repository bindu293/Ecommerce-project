import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

// Load products from sample data
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.resolve(__dirname, '../sample-data/products.json')
let products = []
try {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  products = JSON.parse(raw)
} catch (e) {
  console.warn('[startup] Could not read sample products:', e.message)
  products = []
}

const slug = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

// Normalize IDs
products = products.map((p) => ({ ...p, id: p.id || slug(p.name) }))

// In-memory stores
const productMap = new Map(products.map((p) => [p.id, p]))
const carts = new Map() // key: userId (guest for now), value: { items: [{id, qty}] }
const orders = new Map() // key: orderId, value: order

const getUserId = () => 'guest' // Stubbed auth; replace when real auth is added

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Products
app.get('/api/products', (req, res) => {
  res.json(Array.from(productMap.values()))
})

app.get('/api/products/:id', (req, res) => {
  const p = productMap.get(req.params.id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

app.post('/api/products', (req, res) => {
  const { name, price, ...rest } = req.body || {}
  if (!name || typeof price !== 'number') return res.status(400).json({ error: 'name and price required' })
  const id = slug(rest.id || name)
  const created = { id, name, price, ...rest }
  productMap.set(id, created)
  res.status(201).json(created)
})

app.put('/api/products/:id', (req, res) => {
  const id = req.params.id
  const existing = productMap.get(id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const updated = { ...existing, ...req.body, id }
  productMap.set(id, updated)
  res.json(updated)
})

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id
  if (!productMap.has(id)) return res.status(404).json({ error: 'Not found' })
  productMap.delete(id)
  res.status(204).end()
})

// Cart (stubbed auth)
app.get('/api/cart', (req, res) => {
  const uid = getUserId()
  const cart = carts.get(uid) || { items: [] }
  res.json(cart)
})

app.put('/api/cart', (req, res) => {
  const uid = getUserId()
  const items = Array.isArray(req.body?.items) ? req.body.items : []
  const normalized = items.map((it) => ({ id: it.id, qty: Number(it.qty) || 1 }))
  carts.set(uid, { items: normalized })
  res.json({ items: normalized })
})

// Orders (stubbed)
app.post('/api/orders/checkout', (req, res) => {
  const uid = getUserId()
  const cart = carts.get(uid) || { items: [] }
  const orderId = `ord_${Date.now()}`
  const order = { id: orderId, userId: uid, items: cart.items, status: 'placed', createdAt: new Date().toISOString() }
  orders.set(orderId, order)
  carts.set(uid, { items: [] })
  res.status(201).json(order)
})

app.get('/api/orders/mine', (req, res) => {
  const uid = getUserId()
  const mine = Array.from(orders.values()).filter((o) => o.userId === uid)
  res.json(mine)
})

app.get('/api/orders', (req, res) => {
  res.json(Array.from(orders.values()))
})

app.put('/api/orders/:id/status', (req, res) => {
  const o = orders.get(req.params.id)
  if (!o) return res.status(404).json({ error: 'Not found' })
  o.status = req.body?.status || o.status
  orders.set(o.id, o)
  res.json(o)
})

// AI recommendations (stub)
app.post('/api/ai/recommendations', (req, res) => {
  const all = Array.from(productMap.values())
  const top = all.slice(0, 4) // simple placeholder logic
  res.json(top)
})

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})