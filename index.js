const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { request } = require('http');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const data = { message: "API TOKOPAEDI" };
  res.json(data);
});

// JAVASCRIPT ASYNC-AWAIT

app.get('/products', async (req, res) => {
  const queryString = req.query;

  const productsBuffer = await fs.readFile('database/products.json');
  const products = JSON.parse(productsBuffer);

  // bikin logic filter
  const searchResult = products.filter((product) => {
    if (!queryString.search) {
      return true;
    }

    return product.name.toLowerCase() === queryString.search;
  });

  // logic cek jika tak ketemu = [] = length == 0
  if (searchResult.length === 0) {
    res.sendStatus(404);
  } else {
    res.json(searchResult);
  }
});

// GET, product detail
app.get('/products/:id', async (req, res) => {
  const id = Number(req.params.id);

  const productsBuffer = await fs.readFile('database/products.json');
  const products = JSON.parse(productsBuffer);

  const productDetail = products.filter(product => product.id === id)[0];

  if (!productDetail) {
    return res.sendStatus(404);
  }

  res.json(productDetail);
});

// POST
// post adalah method/http method yg ditujukan untuk create new resource/data
app.post('/products', async (req, res) => {
  if (!req.body.name || !req.body.price) {
    return res.sendStatus(400);
  }

  // provide sendiri id nya
  // artinya user bisa ngasal
  // biasanya id gak boleh di input sendiri
  // harus di generate di sisi rest api / server
  // id = incremental id 1, 2, 3, 4, 5, 6
  // id = uuid 0192ju3091j3, asdoi89123, aosjdio123
  // id = another random id
  const newProductData = {
    id: req.body.id,
    name: req.body.name,
    price: req.body.price
  };

  // GOAL: insert data baru ke JSON
  // 1. baca dulu data JSON saat ini
  const productsBuffer = await fs.readFile('database/products.json');
  const products = JSON.parse(productsBuffer);

  // 2. insert / tambah ke array
  products.push(newProductData);

  // 3. timpa file json yang baru
  await fs.writeFile('database/products.json', JSON.stringify(products, null, 2));

  res.json({
    message: 'Sukses',
  });
});

// PUT
// update data
// Saat mau update data, harus pilih 1 atau lebih resource/data yang mau di update
app.put('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  // data baru/perubahan
  const newData = req.body;

  const productsBuffer = await fs.readFile('database/products.json');
  const products = JSON.parse(productsBuffer);

  // map adalah syntax js untuk mengubah bentuk dari 1 array ke lainnya
  const afterUpdateProducts = products.map((product) => {
    if (product.id === id) {
      // product ini nih yang mau di update!
      // timpa semua data yang ada dengan new data
      return {
        id: product.id,
        name: newData.name,
        price: newData.price
      };
    } else {
      return product;
    }
  });

  await fs.writeFile('database/products.json', JSON.stringify(afterUpdateProducts, null, 2));

  res.json({ message: 'Sukses' });
});

// DELETE
// hapus data
app.delete('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  // data baru/perubahan
  const newData = req.body;

  const productsBuffer = await fs.readFile('database/products.json');
  const products = JSON.parse(productsBuffer);

  // filter = menyaring data array menjadi data array yang lebih sempit
  // kita filter out / buang data yg id nya akan di hapus
  // filter return false = isinya akan di remove dari array
  // return true = akan tetep di array
  const afterDeletionProducts = products.filter((product) => {
    if (product.id === id) {
      // product ini nih yang mau di hapus
      return false;
    } else {
      return true;
    }
  });

  await fs.writeFile('database/products.json', JSON.stringify(afterDeletionProducts, null, 2));

  res.json({ message: 'Sukses' });
});

// PATCH
// hanya "menambal" field2 yang ingin di update saja...

app.listen('3000', () => {
  console.log(`Example app listening at http://localhost:3000`);
});