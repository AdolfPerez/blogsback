const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../tests/test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})
test('blogs are returned as json', async () =>
  await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/))
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})
test('verificar que la propiedad de identificador se llame id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
  //body contiene un arreglo que proviene de los blogs almacenados en la base de datos
  //se accede al elemento con la posicion cero y a la vez a la propiedad id de dicho elemento, si el resultado es undefined no pasa la prueba, si el elemento tiene la propiedad id pasa la prueba
})
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Funciona el metodo post',
    author: 'Alguien',
    url: 'post.com',
    likes: 1
  }
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect({...newBlog, id: blogsAtEnd[blogsAtEnd.length - 1].id }).toEqual(blogsAtEnd[blogsAtEnd.length - 1])
})
test('verificar que la propiedad likes tenga valor cero por defecto', async () => {  
  const newBlog = {
    title: 'No tiene likes',
    author: 'nadie',
    url: 'likespost.com'
  }
  await api
  .post('/api/blogs')
  .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
})
test('verificar que la respuesta es 400 si faltan las propiedades title y url', async () => {  
  const newBlog = {
    author: 'nadie'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})
afterAll(() => mongoose.connection.close())