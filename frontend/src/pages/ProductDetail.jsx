import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Grid, Typography, Rating, TextField, Card, CardContent, Stack } from '@mui/material'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { add } = useCart()
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data))
    // Load reviews from localStorage
    const stored = localStorage.getItem(`reviews:${id}`)
    setReviews(stored ? JSON.parse(stored) : [])
  }, [id])

  if (!product) return <Typography>Loading...</Typography>
  const img = product.image || `https://via.placeholder.com/800x480?text=${encodeURIComponent(product.name)}`
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) : (product.rating || 0)
  const submitReview = () => {
    if (!newRating || !newComment.trim()) return
    const entry = {
      name: user?.displayName || user?.email || 'Anonymous',
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString(),
    }
    const next = [entry, ...reviews]
    setReviews(next)
    localStorage.setItem(`reviews:${id}`, JSON.stringify(next))
    setNewRating(0)
    setNewComment('')
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box component="img" src={img} alt={product.name} sx={{ width: '100%', borderRadius: 1 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h4">{product.name}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>{product.category}</Typography>
        <Typography sx={{ mb: 1 }}>${product.price?.toFixed(2)}</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Rating value={avgRating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary">{avgRating ? avgRating.toFixed(1) : 'No ratings yet'}</Typography>
        </Stack>
        <Typography sx={{ mb: 3 }}>{product.description}</Typography>
        <Button variant="contained" onClick={() => add(product, 1)}>Add to Cart</Button>
      </Grid>

      {/* Reviews Section */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Customer Reviews</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <Rating value={newRating} onChange={(_, v) => setNewRating(v)} />
              <TextField
                fullWidth
                placeholder="Share your experience..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="outlined" onClick={submitReview}>Submit</Button>
            </Stack>
            {reviews.length === 0 ? (
              <Typography color="text.secondary">Be the first to review this product.</Typography>
            ) : (
              <Stack spacing={2}>
                {reviews.map((r, idx) => (
                  <Box key={idx} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Rating value={r.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(r.date).toLocaleDateString()}</Typography>
                    </Stack>
                    <Typography variant="body2">{r.comment}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
