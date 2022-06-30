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
    const extraccionYOrdenamientoDeAutoresDeCadaBlog = blogs.map( blog => blog.author ).sort()
    const autoresSinRepeticionYSuCantidadRespectivaDeBlogs = []
    let cantidadDeBlogs = 1
    for(let i = 0; i < extraccionYOrdenamientoDeAutoresDeCadaBlog.length; i++) {
      if(extraccionYOrdenamientoDeAutoresDeCadaBlog[i] === extraccionYOrdenamientoDeAutoresDeCadaBlog[i+1]) cantidadDeBlogs++
      if(extraccionYOrdenamientoDeAutoresDeCadaBlog[i] != extraccionYOrdenamientoDeAutoresDeCadaBlog[i+1]) {
        autoresSinRepeticionYSuCantidadRespectivaDeBlogs.push([extraccionYOrdenamientoDeAutoresDeCadaBlog[i], cantidadDeBlogs])
        cantidadDeBlogs = 1
      }
    }
    let autorConMasBlogs = [ '', 0 ]
    for(let i = 0; i < autoresSinRepeticionYSuCantidadRespectivaDeBlogs.length; i++) {
      if(autorConMasBlogs[1] < autoresSinRepeticionYSuCantidadRespectivaDeBlogs[i][1]){
        autorConMasBlogs = autoresSinRepeticionYSuCantidadRespectivaDeBlogs[i]
      }
    }
    let autorConMasBlogsObjeto = {
      author: autorConMasBlogs[0],
      blogs: autorConMasBlogs[1]
    }
    return autorConMasBlogsObjeto
  },
  mostLikes: blogs => {
    const extraccionYOrdenamientoDeLosAutoresPorCadaUnoDeLosBlogs = blogs.map( blog => blog.author ).sort()
    let autoresSinRepeticion = []
    for(let i = 0; i < extraccionYOrdenamientoDeLosAutoresPorCadaUnoDeLosBlogs.length ; i++) {
      if(extraccionYOrdenamientoDeLosAutoresPorCadaUnoDeLosBlogs[i] != extraccionYOrdenamientoDeLosAutoresPorCadaUnoDeLosBlogs[i+1]) {
        autoresSinRepeticion.push(extraccionYOrdenamientoDeLosAutoresPorCadaUnoDeLosBlogs[i])
      }
    }
    let autoresConSuLikesTotales = autoresSinRepeticion.map(autor => [autor, 0])
    const blogsSoloAutorYLikes = blogs.map( blog => [blog.author, blog.likes] )
    for(let i = 0; i < autoresConSuLikesTotales.length; i++) {
      for(let j = 0; j < blogsSoloAutorYLikes.length; j++) {
        if(autoresConSuLikesTotales[i][0] === blogsSoloAutorYLikes[j][0]) {
          autoresConSuLikesTotales[i][1] += blogsSoloAutorYLikes[j][1]
        }
      }
    }
    let autorConMasLikes = ['', 0]
    for(let i = 0; i < autoresConSuLikesTotales.length; i++) {
      if(autorConMasLikes[1] < autoresConSuLikesTotales[i][1]){
        autorConMasLikes = autoresConSuLikesTotales[i]
      }
    }
    let autorConMasLikesObjeto = {
      author: autorConMasLikes[0],
      likes: autorConMasLikes[1]
    }
    return autorConMasLikesObjeto
  }
}