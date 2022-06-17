require('dotenv').config()
const mongoose = require('mongoose')

module.exports = mongoose.model('Blog', new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
}))