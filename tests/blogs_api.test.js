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
afterAll(() => mongoose.connection.close())