require('dotenv').config()
const express = require('express')
const app = express()
require('express-async-errors')

// ConnectDB
const connectDB = require('./db/connect')

// Extra Packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

// router
const authRouter = require('./routes/auth')

// middlewares
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const port = process.env.PORT || 5001

app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))

// Routes
app.use('/api/v1/auth', authRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`server listening on port: ${port}`))
  } catch (error) {
    console.log('error: ', error)
  }
}

start()
