const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => Blog.find({}).then(blogs => response.json(blogs)))

blogsRouter.get('/:id', ({params}, response, next) => Blog.findById(params.id).then(blog => blog ? response.json(blog) : response.status(404).end()).catch(error => next(error)))

blogsRouter.post('/', ({body}, response, next) => new Blog({ title: body.title, author: body.author, url: body.url, likes: body.likes }).save().then(savedBlog => response.json(savedBlog)).catch(error => next(error)))

module.exports = blogsRouter