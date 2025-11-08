import React from 'react'
import { Box, Typography, Link } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} AI E-commerce. Built with React, Express, and Firestore.
      </Typography>
      <Typography variant="caption">
        <Link href="https://openai.com/" target="_blank" rel="noreferrer">AI by OpenAI</Link>
      </Typography>
    </Box>
  )
}
