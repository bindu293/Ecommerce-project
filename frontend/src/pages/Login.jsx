import React, { useState } from 'react'
import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const doLogin = async () => {
    setError(null)
    setSuccess(null)
    try { 
      await login(email, password)
      setSuccess('Logged in successfully')
      navigate('/profile')
    } catch (e) { setError(e.message) }
  }
  const doSignup = async () => {
    try {
      // Basic email validation
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address')
        return
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }
      await signup(email, password)
      setSuccess('Signup successful. You are now logged in')
      navigate('/profile')
    } catch (e) { 
      setError(e.message) 
    }
  }

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Login / Signup</Typography>
      <TextField label="Email" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField type="password" label="Password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={doLogin}>Login</Button>
        <Button onClick={doSignup}>Signup</Button>
      </Box>
      {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
      {success && <Alert sx={{ mt: 2 }} severity="success">{success}</Alert>}
    </Box>
  )
}
