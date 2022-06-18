module.exports = {
  dummy: blogs => 1,
  totalLikes: blogs => {
    const result = blogs.map(blog => blog.likes)
    return result.length === 0 ? 0 : result.reduce((sum, i) => sum + i, 0)
  },
  favoriteBlog: blogs => {
    let favorito = { likes: 0 }
    blogs.forEach( blog => { 
      if( favorito.likes < blog.likes ) favorito = blog 
    })
    return favorito
  },
  mostBlogs: blogs => {
    const authors = blogs.map( blog => blog.author ).sort()
    const repetidos = []
    let cantidad = 1
    for(let i = 0; i < authors.length; i++) {
      if(authors[i] === authors[i+1]) cantidad++
      if(authors[i] != authors[i+1]) {
        repetidos.push([authors[i], cantidad])
        cantidad = 1
      }
    }
    let autorConMasBlogs = [ '', 0 ]
    for(let i = 0; i < repetidos.length; i++) {
      if(autorConMasBlogs[1] < repetidos[i][1]){
        autorConMasBlogs = repetidos[i]
      }
    }
    autorConMasBlogs = {
      author: autorConMasBlogs[0],
      blogs: autorConMasBlogs[1]
    }
    return autorConMasBlogs
  }
}