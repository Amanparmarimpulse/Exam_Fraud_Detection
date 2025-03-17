const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
const router = require('./routes/index')

dotenv.config()

const PORT = process.env.PORT || 5050

const app = express()

app.use(cors())

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

app.use("/api", router)

// Create public/images/avatar directory if it doesn't exist
const avatarDir = path.join(__dirname, 'public', 'static', 'images', 'avatar')
const fs = require('fs')
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Static files will be served from ${path.join(__dirname, 'public')}`)
})
