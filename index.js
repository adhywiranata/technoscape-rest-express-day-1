
// REPOSITORY PATTERN adalah pemisahan kode
// 1. BUSINESS LOGIC
// 2. PERSISTENCE LAYER = simpen database!

const express = require('express');
const bodyParser = require('body-parser');
const { request } = require('http');

const ProductRepository = require('./productRepository');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const data = { message: "API TOKOPAEDI" };
  res.json(data);
});

app.get('/products', async (req, res) => {
  const allProducts = await ProductRepository.findAll();
  return res.json(allProducts);
});

app.get('/products/:id', async (req, res) => {
  const productDetail = await ProductRepository.findOne(req.params.id);
  return res.json(productDetail);
});

app.post('/products', async (req, res) => {
  await ProductRepository.insert(req.body);
  return res.json({ message: 'Sukses' });
});

app.put('/products/:id', async (req, res) => {
  await ProductRepository.update(req.params.id, req.body);
  return res.json({ message: 'Sukses' });
});

app.delete('/products/:id', async (req, res) => {
  await ProductRepository.delete(req.params.id);
  return res.json({ message: 'Sukses' });
});

app.listen('3000', () => {
  console.log(`Example app listening at http://localhost:3000`);
});