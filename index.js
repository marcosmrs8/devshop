const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const product = require('./models/product')
const category = require('./models/category')
const db = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'devshop'
  }
})
db.on('query', query => {
  console.log('Sql:', query.sql)
})
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', async (req, res) => {
  const categories = await category.getCategories(db)()
  res.render('home', {
    categories
  })
})

app.get('/categoria/:id/:slug', async (req, res) => {
  const categories = await category.getCategories(db)()
  const products = await product.getProductsByCategoryId(db)(req.params.id)
  const cat = await category.getCategoryById(db)(req.params.id)
  res.render('category', {
    products,
    categories,
    category: cat
  })
})

app.get('/produto/:id/:slug', async (req, res) => {
  const categories = await category.getCategories(db)()
  const prod = await product.getProductById(db)(req.params.id)
  res.render('product-detail', {
    product: prod,
    categories
  })
})

app.listen(port, err => {
  if (err) {
    console.log('nah! server is not running')
  } else {
    console.log('server is running, yeah')
  }
})
