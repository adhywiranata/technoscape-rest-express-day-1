const fs = require('fs').promises;
const uuidv4 = require('uuid').v4;

const ProductRepository = {
  findAll: async () => {
  const productsBuffer = await fs.readFile('database/products.json');
  const products = JSON.parse(productsBuffer);

  return products;
  },
  findOne: async (id) => {
    const productsBuffer = await fs.readFile('database/products.json');
    const products = JSON.parse(productsBuffer);

    const productDetails = products.filter(product => product.id === id)[0];
  
    return productDetails;
  },
  insert: async (newProduct) => {
    const newProductForDB = {
      id: uuidv4(),
      name: newProduct.name,
      price: newProduct.price,
    }

    const currentProducts = await ProductRepository.findAll();
    currentProducts.push(newProductForDB);

    await ProductRepository.write(currentProducts);

    return true;
  },
  update: async (id, updatedProduct) => {
    const currentProducts = await ProductRepository.findAll();
    const updatedProducts = currentProducts.map((product) => {
      if (product.id === id) {
        return {
          id: product.id,
          name: updatedProduct.name,
          price: updatedProduct.price,
        };
      } else {
        // nggak ngubah data apa2
        return product;
      }
    });

    await ProductRepository.write(updatedProducts);

    return true;
  },
  delete: async (productToDeleteId) => {
    const currentProducts = await ProductRepository.findAll();
    const productsAlreadyDeleted = currentProducts.filter((product) => {
      return product.id !== productToDeleteId;
    });

    await ProductRepository.write(productsAlreadyDeleted);
    return true;
  },
  write: async (products) => {
    await fs.writeFile('database/products.json', JSON.stringify(products, null, 2));
    return true;
  }
};

// jangan lupa di export
module.exports = ProductRepository;
