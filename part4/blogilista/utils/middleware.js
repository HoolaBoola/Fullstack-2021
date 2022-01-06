const logger = require('./logger');
const jwt = require('jsonwebtoken');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {    
    return response.status(401).json({error: 'invalid token'});
  } else if (error.message === "Token missing") {
    return response.status(401).json({error: 'token missing'});
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }

  next();
}

const User = require('../models/user');
const mongoose = require('mongoose');
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return next();
  }


  let decodedToken = null;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch(err) {
    logger.error(err);
    return next();
  }
  const userid = decodedToken.id;
  if (!mongoose.isValidObjectId(userid)) {
    return next();
  }

  request.user = await User.findById(userid);
  next();
}

module.exports = {
  userExtractor,
  tokenExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler
}
