const config = require('./utils/config')
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
	.then(() => logger.info("DB connected"))
	.catch(error => logger.error(error));

app.use(cors())
app.use(express.json())

const blogsRouter = require('./controllers/blogs');
app.use('/api/blogs', blogsRouter);

const PORT = process.env.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
