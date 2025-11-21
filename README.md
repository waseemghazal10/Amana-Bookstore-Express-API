# Amana Bookstore Express API

A fully functional RESTful API for managing an academic bookstore with books and reviews. Built with Express.js and featuring comprehensive logging and authentication.

## Project Overview

This repository contains the foundational data and structure for developing a modern bookstore API that will serve academic institutions, students, and researchers. The bookstore specializes in high-quality scientific and educational publications from renowned academic publishers.

## Current Project Structure

```
Amana-Bookstore-Express-API/
├── data/
│   ├── books.json          # Sample book catalog with detailed metadata
│   └── reviews.json        # Customer reviews and ratings
├── logging/
│   └── log.txt            # Application logging directory
├── server.js              # Express server entry point (to be developed)
└── README.md              # This file
```

## Sample Data Overview

### Books Dataset (`data/books.json`)

The books dataset contains **3 sample books** with comprehensive metadata including:

- **Academic Focus**: Physics, Quantum Mechanics, and Astrophysics textbooks
- **Detailed Metadata**: ISBN, genre, tags, publication info, pricing
- **Rich Content**: Descriptions, ratings, review counts, stock status
- **Featured Books**: Curated selection for homepage display

**Sample Book Structure:**
```json
{
  "id": "1",
  "title": "Fundamentals of Classical Mechanics",
  "author": "Dr. Ahmad Al-Kindi",
  "description": "A comprehensive introduction to classical mechanics...",
  "price": 89.99,
  "isbn": "978-0123456789",
  "genre": ["Physics", "Textbook"],
  "tags": ["Mechanics", "Physics", "University"],
  "datePublished": "2022-01-15",
  "pages": 654,
  "language": "English",
  "publisher": "Al-Biruni Academic Press",
  "rating": 4.8,
  "reviewCount": 23,
  "inStock": true,
  "featured": true
}
```

### Reviews Dataset (`data/reviews.json`)

The reviews dataset contains **11 sample reviews** with:

- **Verified Reviews**: Academic credibility with verification status
- **Detailed Feedback**: Professional reviews from educators and students
- **Rating System**: 5-star rating with detailed comments
- **Academic Authors**: Reviews from professors, doctors, and students

**Sample Review Structure:**
```json
{
  "id": "review-1",
  "bookId": "1",
  "author": "Dr. Yasmin Al-Baghdadi",
  "rating": 5,
  "title": "Excellent foundation for physics students",
  "comment": "Dr. Al-Kindi has created a comprehensive introduction...",
  "timestamp": "2024-01-15T10:30:00Z",
  "verified": true
}
```

## Planned API Features

Based on this initial dataset, the Express.js API will support:

### Core Functionality
- **Book Catalog Management**: CRUD operations for books
- **Review System**: Customer reviews and ratings
- **Search & Filtering**: By genre, author, price, availability
- **Featured Books**: Curated book recommendations
- **Inventory Management**: Stock tracking and availability

### Advanced Features
- **Academic Focus**: Specialized for educational institutions
- **Publisher Integration**: Support for multiple academic publishers
- **Verification System**: Verified reviews from academic professionals
- **Multi-language Support**: Currently English, expandable
- **Rating Analytics**: Comprehensive rating and review analytics

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Express.js framework

### Development Setup
1. Clone this repository
2. Install dependencies: `npm install express`
3. Develop the Express server in `server.js`
4. Use the sample data in `data/` for testing and development

### Recommended API Endpoints

```
GET    /api/books              # Get all books
GET    /api/books/:id          # Get specific book
GET    /api/books/featured     # Get featured books
GET    /api/books/search       # Search books
POST   /api/books              # Add new book
PUT    /api/books/:id          # Update book
DELETE /api/books/:id          # Delete book

GET    /api/reviews            # Get all reviews
GET    /api/reviews/book/:id   # Get reviews for specific book
POST   /api/reviews            # Add new review
PUT    /api/reviews/:id        # Update review
DELETE /api/reviews/:id        # Delete review
```

## Data Characteristics

### Academic Publishers Featured
- Al-Biruni Academic Press
- Ibn Sina Publications  
- Al-Sufi Astronomical Society

### Subject Areas
- Classical Mechanics
- Quantum Physics
- Astrophysics and Astronomy
- Advanced Physics

### Price Range
- $89.99 - $125.50 (Academic textbook pricing)

## Next Steps

1. **Server Development**: Implement Express.js server with routing
2. **Database Integration**: Migrate JSON data to MongoDB/PostgreSQL
3. **Authentication**: Add user authentication and authorization
4. **API Documentation**: Create comprehensive API documentation
5. **Testing**: Implement unit and integration tests
6. **Deployment**: Configure for production deployment

## Running the API

```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints Implemented

### GET Routes (Public - No Authentication)

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /books` | Get all books | `curl http://localhost:3000/books` |
| `GET /books/:id` | Get single book by ID | `curl http://localhost:3000/books/1` |
| `GET /books/date-range/search?start=YYYY-MM-DD&end=YYYY-MM-DD` | Get books published between dates | `curl "http://localhost:3000/books/date-range/search?start=2022-01-01&end=2023-12-31"` |
| `GET /books/top/rated` | Get top 10 rated books (rating × reviewCount) | `curl http://localhost:3000/books/top/rated` |
| `GET /books/featured/list` | Get all featured books | `curl http://localhost:3000/books/featured/list` |
| `GET /books/:id/reviews` | Get all reviews for a specific book | `curl http://localhost:3000/books/1/reviews` |

### POST Routes (Authentication Required)

| Endpoint | Description | Headers Required |
|----------|-------------|------------------|
| `POST /books` | Add a new book | `Authorization: admin123`<br>`Content-Type: application/json` |
| `POST /reviews` | Add a new review | `Authorization: admin123`<br>`Content-Type: application/json` |

## Authentication

POST requests require authentication token in header:

```
Authorization: admin123
```

**Valid tokens:** `admin123`, `editor456`, `manager789`

## Example POST Requests

### Add a New Book

```bash
curl -X POST http://localhost:3000/books \
  -H "Authorization: admin123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Data Science",
    "author": "Dr. Sarah Ahmed",
    "price": 79.99,
    "description": "A comprehensive guide to data science",
    "isbn": "978-1234567890",
    "genre": ["Computer Science", "Data Science"],
    "tags": ["Data", "Analytics"],
    "pages": 450,
    "language": "English",
    "publisher": "Tech Books Publishing"
  }'
```

### Add a Review

```bash
curl -X POST http://localhost:3000/reviews \
  -H "Authorization: admin123" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "1",
    "author": "John Doe",
    "rating": 5,
    "title": "Excellent book!",
    "comment": "Very informative and well-written."
  }'
```

## Logging with Morgan

All HTTP requests are automatically logged to `logging/log.txt` using Morgan middleware.

**Log format:** Combined (Apache combined log format)
- Includes: IP, timestamp, method, URL, status code, response time
- Also logs to console in development mode

**Example log entry:**
```
::1 - - [21/Nov/2025:10:30:45 +0000] "GET /books HTTP/1.1" 200 1234 "-" "PostmanRuntime/7.26.8"
```

## Deploying on Railway

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Complete Express API with logging"
git push origin main
```

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `Amana-Bookstore-Express-API` repository
6. Railway auto-detects Express and deploys automatically

### Step 3: Configure (Optional)

Railway auto-configures, but you can add environment variables:

1. Go to your project dashboard
2. Click **"Variables"** tab
3. Add variables if needed:
   - `PORT` (Railway sets this automatically)
   - `AUTH_TOKENS` (if you want to use env vars)

### Step 4: Test Your Live API

Your API will be at: `https://your-project.railway.app`

Test it:
```bash
curl https://your-project.railway.app/books
curl https://your-project.railway.app/books/1
curl https://your-project.railway.app/books/top/rated
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Morgan** - HTTP request logging middleware
- **File System (fs)** - Data persistence in JSON files

## Features Implemented

✅ 6 GET routes for retrieving books and reviews  
✅ 2 POST routes for adding books and reviews  
✅ Token-based authentication middleware  
✅ Morgan logging to file and console  
✅ Data validation and error handling  
✅ Auto-updating book ratings when reviews are added  
✅ JSON file persistence  

## Contributing

This is a bootcamp project for Amana Bootcamp.

## License

ISC