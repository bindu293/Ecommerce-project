import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Profile() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    api
      .get('/orders?limit=3') // Fetch only the 3 most recent orders
      .then((res) => setOrders(res.data?.data || []))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [user, authLoading])

  if (loading || authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Welcome!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Please log in to view your profile and order history.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Box>
    )
  }

  const recentOrder = orders.length > 0 ? orders[0] : null

  return (
    <Box sx={{ flexGrow: 1, p: 4, backgroundColor: '#f4f6f8' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Welcome, {user.displayName || user.email}!
      </Typography>
      <Grid container spacing={4}>
        {/* Recent Order */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Recent Order
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {recentOrder ? (
                <Box>
                  <Typography variant="body1">
                    <strong>Order ID:</strong> {recentOrder.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total:</strong> ${recentOrder.total.toFixed(2)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> {recentOrder.status}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/orders"
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  You have no recent orders.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Button
                fullWidth
                variant="contained"
                component={RouterLink}
                to="/orders"
                sx={{ mb: 2 }}
              >
                View All Orders
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={RouterLink}
                to="/cart"
              >
                Go to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Order History Preview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order History
              </Typography>
              {orders.length > 0 ? (
                <List>
                  {orders.map((o) => (
                    <ListItem key={o.id} divider>
                      <ListItemText
                        primary={`Order #${o.id}`}
                        secondary={`Status: ${o.status} | Total: $${o.total.toFixed(2)}`}
                      />
                      <Button
                        component={RouterLink}
                        to="/orders"
                        size="small"
                      >
                        Track
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No orders to display.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
