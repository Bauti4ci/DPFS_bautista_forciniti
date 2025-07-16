const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const Product = {
    findAll: () => {
        const jsonProducts = fs.readFileSync(productsFilePath, 'utf-8');
        const products = JSON.parse(jsonProducts);
        return products;
    },

    findById: (id) => {
        const allProducts = Product.findAll();
        const productFound = allProducts.find(product => product.id == id);
        return productFound;
    },
    create: (productData) => {
        const allProducts = Product.findAll();

        const lastProduct = allProducts[allProducts.length - 1];
        const newId = lastProduct ? lastProduct.id + 1 : 1;

        const newProduct = {
            id: newId,
            ...productData
        };


        allProducts.push(newProduct);


        fs.writeFileSync(productsFilePath, JSON.stringify(allProducts, null, 4));

        return newProduct;
    },


    update: (id, productData) => {
        const allProducts = Product.findAll();

        const productIndex = allProducts.findIndex(product => product.id == id);

        if (productIndex !== -1) {
            const updatedProduct = {
                id: Number(id),
                ...allProducts[productIndex],
                ...productData
            };

            allProducts[productIndex] = updatedProduct;

            fs.writeFileSync(productsFilePath, JSON.stringify(allProducts, null, 4));

            return updatedProduct;
        }

        return null;
    },

    destroy: (id) => {
        const allProducts = Product.findAll();

        const remainingProducts = allProducts.filter(product => product.id !== Number(id));

        fs.writeFileSync(productsFilePath, JSON.stringify(remainingProducts, null, 4));

        return true;
    }
}

module.exports = Product;