const express = require("express");
require("dotenv").config();
const helmet = require('helmet');
const rateLimiting = require("express-rate-limit");
const connectToDb = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/error");
const cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
const photoUpload = require('./middlewares/photoUpload')
const cors = require("cors");
const path = require('path')
// Import routes
const auth = require("./routes/authRoute");
const user = require('./routes/usersRoute')
const password = require("./routes/passwordRoute") 
const product = require('./routes/productRoute')
// const cart = require('./routes/cartRoute')
const category = require('./routes/categoryRoute')
const discountCode = require('./routes/discountRoute')
const order = require('./routes/orderRoute')
const message = require('./routes/messageRoute')
const paymentNote = require('./routes/paymentNoteRoute')
const aph = require('./routes/animatedPhotoRoute')
const FAQ = require("./routes/FAQroute")
const notification = require('./routes/notificationRoute')
const stat = require('./routes/stat')

// Init App

const app = express()

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', 'GET DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'Authorization')
//   next()
// })
 
app.use(helmet());

// Global rate limiter: limits each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});
app.use(limiter);
app.use(cors({
  origin: 'http://localhost:3000 http://localhost:4000' 
}))
// for parsing multipart/form-data
app.use(photoUpload.any()); 
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
  // Connection To Db
connectToDb();
app.use(cookieParser())
// Middlewares
app.use(express.json());

app.use(cors({credentials: true, origin: true, withCredentials: true }))
// Routes

const staticImages = express.static(path.join(path.resolve(), "images"))
app.use("/images", staticImages)
// app.use("/opt/render/project/src/images", express.static(path.join(__dirname, "/images")))

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/password", password); 
app.use("/api/product", product);
// app.use("/api/cart", cart);
app.use("/api/order", order);
app.use("/api/category", category);
app.use("/api/discount", discountCode);
app.use("/api/message", message);
app.use("/api/paymentnote", paymentNote)
app.use("/api/stat", stat)
app.use("/api/aph", aph)
app.use("/api/FAQ", FAQ)
app.use("/api/notification", notification)
app.use("/", (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honey World</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        background-color: #f2e8c3;
      }
      .header {
        height: 100vh;
        background-image: url("https://images.unsplash.com/photo-1579537533965-3875982f3d87?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaW8=&auto=format&fit=crop&w=750&q=80");
        background-size: cover;
        background-position: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .header h1 {
        color: #fff;
        font-size: 5rem;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Welcome To Honey World</h1>
    </div>
  </body>
  </html>
  `)
});
// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
