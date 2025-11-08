// Order Tracking Component
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

const statusColors = {
  pending: { bg: '#fffbe6', text: '#b45309' },
  processing: { bg: '#eef2ff', text: '#4338ca' },
  shipped: { bg: '#f3e8ff', text: '#7e22ce' },
  delivered: { bg: '#f0fdf4', text: '#16a34a' },
  cancelled: { bg: '#fef2f2', text: '#dc2626' },
}

const OrderStatsCard = ({ title, value, icon }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Box>
  </Card>
)

export default function OrderTracking() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderStats, setOrderStats] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    if (authLoading) return
    if (user) {
      fetchOrders()
      fetchOrderStats()
    }
  }, [user, filters, authLoading])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      params.append('page', filters.page)
      params.append('limit', filters.limit)

      const response = await api.get(`/orders?${params}`)
      setOrders(response.data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderStats = async () => {
    try {
      const response = await api.get('/orders/stats')
      setOrderStats(response.data?.data || null)
    } catch (err) {
      // Do not set a visible error for stats, just log it
      console.error('Error fetching order stats:', err)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4">Please Login</Typography>
        <Typography>Login to view your order history.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9fafb' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Orders
      </Typography>

      {/* Order Statistics */}
      {orderStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <OrderStatsCard title="Total Orders" value={orderStats.totalOrders} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <OrderStatsCard
              title="Total Spent"
              value={formatCurrency(orderStats.totalSpent)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <OrderStatsCard
              title="Avg Order Value"
              value={formatCurrency(orderStats.averageOrderValue)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <OrderStatsCard
              title="Delivered"
              value={orderStats.statusCounts?.delivered || 0}
            />
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              onClick={() =>
                setFilters({ status: 'all', startDate: '', endDate: '' })
              }
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Orders List */}
      {error && <Alert severity="error">{error}</Alert>}
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <Box>
          {orders.map((order) => (
            <Accordion key={order.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Order #{order.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(order.total)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box
                      sx={{
                        backgroundColor: statusColors[order.status]?.bg,
                        color: statusColors[order.status]?.text,
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        textAlign: 'center',
                        display: 'inline-block',
                      }}
                    >
                      {order.status}
                    </Box>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: '#fafafa' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order Items
                </Typography>
                {order.items.map((item) => (
                  <Box
                    key={item.productId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      borderBottom: '1px solid #eee',
                      pb: 2,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 60, height: 60, marginRight: 16 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Qty: {item.quantity} @ {formatCurrency(item.price)}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(item.quantity * item.price)}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 2 }}>
                  <Typography>
                    <strong>Shipping Address:</strong> {
                      order.shippingAddress.street
                    }, {order.shippingAddress.city}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  )
}