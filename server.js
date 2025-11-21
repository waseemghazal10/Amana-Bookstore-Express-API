const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3000

// Load data
const booksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'books.json'), 'utf8'))
const reviewsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8'))

// Middleware
app.use(express.json())

// GET route - Display all books
app.get('/books', (req, res) => {
  res.json(booksData.books)
})

// GET route - Display a single book by ID
app.get('/books/:id', (req, res) => {
  const book = booksData.books.find(b => b.id === req.params.id)
  if (!book) {
    return res.status(404).json({ error: 'Book not found' })
  }
  res.json(book)
})

// GET route - Display books published between a date range
// Usage: /books/date-range?start=2022-01-01&end=2023-12-31
app.get('/books/date-range/search', (req, res) => {
  const { start, end } = req.query
  
  if (!start || !end) {
    return res.status(400).json({ error: 'Please provide both start and end dates' })
  }
  
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  const filteredBooks = booksData.books.filter(book => {
    const publishDate = new Date(book.datePublished)
    return publishDate >= startDate && publishDate <= endDate
  })
  
  res.json(filteredBooks)
})

// GET route - Display top 10 rated books (rating * reviewCount)
app.get('/books/top/rated', (req, res) => {
  const booksWithScore = booksData.books.map(book => ({
    ...book,
    score: book.rating * book.reviewCount
  }))
  
  const topBooks = booksWithScore
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
  
  res.json(topBooks)
})

// GET route - Display featured books
app.get('/books/featured/list', (req, res) => {
  const featuredBooks = booksData.books.filter(book => book.featured === true)
  res.json(featuredBooks)
})

// GET route - Get all reviews for a specific book
app.get('/books/:id/reviews', (req, res) => {
  const bookId = req.params.id
  
  // Check if book exists
  const book = booksData.books.find(b => b.id === bookId)
  if (!book) {
    return res.status(404).json({ error: 'Book not found' })
  }
  
  // Get all reviews for this book
  const bookReviews = reviewsData.reviews.filter(review => review.bookId === bookId)
  
  res.json({
    bookId: bookId,
    bookTitle: book.title,
    totalReviews: bookReviews.length,
    reviews: bookReviews
  })
})

// Start server
app.listen(port, () => {
  console.log(`Amana Bookstore API is running on http://localhost:${port}`)
})