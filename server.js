const express = require('express')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

const app = express()
const port = 3000

// Load data
const booksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'books.json'), 'utf8'))
const reviewsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8'))

// Create a write stream for logging
const logStream = fs.createWriteStream(path.join(__dirname, 'logging', 'log.txt'), { flags: 'a' })

// Middleware
app.use(express.json())

// Morgan logging middleware - logs all requests to log.txt
app.use(morgan('combined', { stream: logStream }))

// Also log to console for development
app.use(morgan('dev'))

// GET route - Display all books
app.get('/books', (req, res) => {
  res.json(booksData.books)
})

// GET route - Display books published between a date range
// Usage: /books/date-range/search?start=2022-01-01&end=2023-12-31
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
app.get('/books/top-rated', (req, res) => {
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
app.get('/books/featured-list', (req, res) => {
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

// GET route - Display a single book by ID (MUST be last among /books routes)
app.get('/books/:id', (req, res) => {
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

// Authentication Middleware
const authenticatedUsers = ['admin123', 'editor456', 'manager789'] // Simple authentication tokens

const authenticate = (req, res, next) => {
  const authToken = req.headers['authorization']
  
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized - No authentication token provided' })
  }
  
  if (!authenticatedUsers.includes(authToken)) {
    return res.status(403).json({ error: 'Forbidden - Invalid authentication token' })
  }
  
  next()
}

// POST route - Add a new book to the catalogue (requires authentication)
app.post('/books', authenticate, (req, res) => {
  const newBook = req.body
  
  // Validate required fields
  if (!newBook.title || !newBook.author || !newBook.price) {
    return res.status(400).json({ error: 'Missing required fields: title, author, and price are required' })
  }
  
  // Generate new ID
  const maxId = Math.max(...booksData.books.map(b => parseInt(b.id)))
  newBook.id = String(maxId + 1)
  
  // Set defaults for optional fields
  newBook.rating = newBook.rating || 0
  newBook.reviewCount = newBook.reviewCount || 0
  newBook.inStock = newBook.inStock !== undefined ? newBook.inStock : true
  newBook.featured = newBook.featured !== undefined ? newBook.featured : false
  newBook.datePublished = newBook.datePublished || new Date().toISOString().split('T')[0]
  
  // Add book to array
  booksData.books.push(newBook)
  
  // Save to file
  fs.writeFileSync(
    path.join(__dirname, 'data', 'books.json'),
    JSON.stringify(booksData, null, 2),
    'utf8'
  )
  
  res.status(201).json({
    message: 'Book added successfully',
    book: newBook
  })
})

// POST route - Add a new review (requires authentication)
app.post('/reviews', authenticate, (req, res) => {
  const newReview = req.body
  
  // Validate required fields
  if (!newReview.bookId || !newReview.author || !newReview.rating || !newReview.comment) {
    return res.status(400).json({ 
      error: 'Missing required fields: bookId, author, rating, and comment are required' 
    })
  }
  
  // Check if book exists
  const book = booksData.books.find(b => b.id === newReview.bookId)
  if (!book) {
    return res.status(404).json({ error: 'Book not found' })
  }
  
  // Validate rating
  if (newReview.rating < 1 || newReview.rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' })
  }
  
  // Generate new review ID
  const maxId = Math.max(...reviewsData.reviews.map(r => {
    const id = r.id.split('-')[1]
    return parseInt(id)
  }))
  newReview.id = `review-${maxId + 1}`
  
  // Set defaults
  newReview.timestamp = newReview.timestamp || new Date().toISOString()
  newReview.verified = newReview.verified !== undefined ? newReview.verified : false
  
  // Add review to array
  reviewsData.reviews.push(newReview)
  
  // Update book's review count and rating
  const bookReviews = reviewsData.reviews.filter(r => r.bookId === newReview.bookId)
  book.reviewCount = bookReviews.length
  book.rating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length
  book.rating = Math.round(book.rating * 10) / 10 // Round to 1 decimal
  
  // Save both files
  fs.writeFileSync(
    path.join(__dirname, 'data', 'reviews.json'),
    JSON.stringify(reviewsData, null, 2),
    'utf8'
  )
  
  fs.writeFileSync(
    path.join(__dirname, 'data', 'books.json'),
    JSON.stringify(booksData, null, 2),
    'utf8'
  )
  
  res.status(201).json({
    message: 'Review added successfully',
    review: newReview,
    updatedBookRating: book.rating,
    updatedReviewCount: book.reviewCount
  })
})

// Start server
app.listen(port, () => {
  console.log(`Amana Bookstore API is running on http://localhost:${port}`)
  console.log(`\nAuthenticated users: ${authenticatedUsers.join(', ')}`)
  console.log('Use these tokens in the Authorization header for POST requests')
})