const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.insertMany(helper.initialUsers)
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
    const users = await helper.usersInDb()
    const newBlog = {
      title: 'Funciona el metodo post',
      author: 'Alguien',
      url: 'post.com',
      likes: 1,
      user: users[0].id
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect({...newBlog, id: blogsAtEnd[blogsAtEnd.length - 1].id }).toEqual({...blogsAtEnd[blogsAtEnd.length - 1], user: blogsAtEnd[blogsAtEnd.length - 1].user.toString()})
  })

  test('verificar que la propiedad likes tenga valor cero por defecto', async () => {
    const users = await helper.usersInDb()
    const newBlog = {
      title: 'No tiene likes',
      author: 'nadie',
      url: 'likespost.com',
      user: users[0].id
    }
    await api
    .post('/api/blogs')
    .send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('verificar que la respuesta es 400 si faltan las propiedades title y url', async () => {
    const users = await helper.usersInDb()  
    const newBlog = {
      author: 'nadie',
      user: users[0].id
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    for(let blog of blogsAtEnd) {
      expect(blog).not.toEqual(blogToDelete)
    }
  })

  test('verificar que actualiza el blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes += 1

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogToUpdate.likes).toBe(blogsAtEnd[0].likes)
    //se espera que los likes del objeto enviado al servidor sean iguales que los del objeto recibido del servidor
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('verificar que no se creen usuarios no validos', async () => {
    await api
      .post('/api/users')
      .send({username: 'Ad', password: 'sekret'})
      .expect(400)
      .expect({ error: 'User validation failed: username: Path `username` (`Ad`) is shorter than the minimum allowed length (3).' })
      
    await api
      .post('/api/users')
      .send({password: 'contrasena'})
      .expect(400)
      .expect({ error: 'User validation failed: username: Path `username` is required.' })

    await api
      .post('/api/users')
      .send({username: 'Adolfo', password: 'se'})
      .expect(400)
      .expect({ error: `User validation failed: password: Path 'password' (se) is shorter than the minimum allowed length (3).` })
      
    await api
      .post('/api/users')
      .send({username: 'Adolfo'})
      .expect(400)
      .expect({ error: 'User validation failed: password: Path `password` is required.' })
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => mongoose.connection.close())