const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async ({params}, response) => {
  const blog = await Blog.findById(params.id)
    blog ?
    response.json(blog) :
    response.status(404).end()
})

blogsRouter.post('/', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET) //convierte el token en el objeto que era antes de ser tokenizado, verify hace lo inverso a sign
  if (!request.token || !decodedToken.id) return response.status(401).json({ error: 'token missing or invalid' }) //si no se obtiene el token o no se obtiene el id del objeto destokenizado devuelve un error

  const user = await User.findById(decodedToken.id)

  const body = request.body
  const blog = new Blog({ 
    title: body.title, 
    author: body.author, 
    url: body.url, 
    likes: body.likes || 0, 
    user: user._id
  })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET) //convierte el token en el objeto que era antes de ser tokenizado, verify hace lo inverso a sign
  if (!request.token || !decodedToken.id) return response.status(401).json({ error: 'token missing or invalid' }) //si no se obtiene el token o no se obtiene el id del objeto destokenizado devuelve un error

  const user = await User.findById(decodedToken.id)
  if ( !user ) return response.status(404).json({ error: 'El usuario no existe' }) 

  const blog = await Blog.findById(request.params.id)
  if ( !blog ) return response.status(404).json({ error: 'El blog no existe' }) 

  if ( blog.user.toString() === user._id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(404).json({ error: 'El blog no pertenece a este usuario' })
  }
})

blogsRouter.put('/:id', (request, response, next) => {

  Blog.findByIdAndUpdate(request.params.id, 
    { 
      title: request.body.title, 
      author: request.body.author, 
      url: request.body.url, 
      likes: request.body.likes
    }, 
    { new: true }
  )
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter