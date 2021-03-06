const logger = require('./logger')
module.exports = {
  requestLogger: (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('---')
    next()
  },
  unknownEndpoint: (request, response) => response.status(404).send({error: 'unknown endpoint'}),
  errorHandler: (error, request, response, next) => {
    if (error.name === 'CastError') {
      return response.status(400).send({
        error: 'malformatted id'
      })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({
        error: error.message 
      })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: 'invalid token'
      })
    } 
    logger.error(error.message) 
    next(error)
  },
  tokenExtractor: (request, response, next) => {
    const authorization = request.get('authorization')
    request.token = authorization && authorization.toLowerCase().startsWith('bearer ') ? authorization.substring('bearer '.length) : null
    next()
  }
}