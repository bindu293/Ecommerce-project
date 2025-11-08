import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Button, TextField } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { items } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const count = items.reduce((sum, it) => sum + it.qty, 0)
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          AI E-commerce
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/?q=${encodeURIComponent(searchTerm)}`)
              }
            }}
            sx={{ width: 240, backgroundColor: 'white', borderRadius: 1 }}
          />
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
              <Button color="inherit" component={RouterLink} to="/orders">Orders</Button>
              <Button color="inherit" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          )}
          <IconButton color="inherit" component={RouterLink} to="/wishlist">
            <Badge badgeContent={wishlistCount} color="error">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" component={RouterLink} to="/cart">
            <Badge badgeContent={count} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
