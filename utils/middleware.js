const { request } = require('http')
const { response } = require('../../notes/back_notes/app')
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
    logger.error(error.message)
    if(error.name === 'CastError'){
      return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError'){
      return response.status(400).json({error: error.message})
    }
    next(error)
  }
}