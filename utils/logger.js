module.exports = {
  info: (...params) => {
    if (process.env.NODE_ENV !== 'test') console.log(...params)
  },
  error: (...params) => console.error(...params)
}