const Product = require('../models/Product.js');

let productController = {
    index: function (req, res) {
        const allProducts = Product.findAll();

        return res.render('products/productList', {
            title: "Lista de Productos",
            products: allProducts

        })
    },
    show: function (req, res) {
        const productId = req.params.id;
        const productToShow = Product.findById(productId);

        if (productToShow) {
            return res.render('products/productDetail', {
                title: productToShow.name,
                product: productToShow
            });
        } else {
            return res.send('Producto no encontrado');
        }
    },

    cart: function (req, res) {
        return res.render('products/productCart', { title: "Carrito" })
    },
    create: function (req, res) {
        return res.render('products/createProduct', { title: "Crear un Producto" })
    },
    store: function (req, res) {
        const formData = req.body;

        const imagePath = req.file
            ? `/productsImages/${req.file.filename}`
            : 'https://placehold.co/535x665/ffffff/000000?text=No se pudo cargar la imagen';

        let wearSize = [];
        let footSize = [];
        let weight = [];
        let size = [];

        for (const key in formData) {

            if (['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(key)) {
                wearSize.push(key.toUpperCase());
            }
            if (!isNaN(key) && Number(key) >= 35 && Number(key) <= 45) {
                footSize.push(Number(key));
            }

            if (key.includes('kg') || key.includes('gr')) {
                if (formData.categorie === 'equipo') {
                    weight.push(key);
                }
                else if (formData.categorie === 'suplementos' || formData.categorie === 'snacks') {
                    size.push(key);
                }
            }
        }
        const newProductData = {
            name: formData.name,
            image: imagePath,
            price: Number(formData.precio),
            category: formData.categorie,
            description: formData.bio,
            color: formData.color || null,
            size: size.length > 0 ? size : null,
            footSize: footSize.length > 0 ? footSize : null,
            weight: weight.length > 0 ? weight : null,
            wearSize: wearSize.length > 0 ? wearSize : null,
            gender: formData.gender === 'both'
                ? ['Hombre', 'Mujer']
                : (formData.gender ? [formData.gender] : null)
        };

        Product.create(newProductData);

        res.redirect('/product');

    }, edit: function (req, res) {
        const productId = req.params.id;
        const productToEdit = Product.findById(productId);

        if (productToEdit) {
            return res.render('products/editProduct', {
                title: "Editar el producto: " + productToEdit.name,
                product: productToEdit
            });
        } else {
            return res.send('Producto no encontrado');
        }
    },

    update: function (req, res) {
        const productId = req.params.id;
        const formData = req.body;

        let imagePath;
        if (req.file) {
            imagePath = `/productsImages/${req.file.filename}`;
        } else {
            const existingProduct = Product.findById(productId);
            imagePath = existingProduct.image;
        }

        let wearSize = [];
        let footSize = [];
        let size = [];
        let weight = [];

        for (const key in formData) {
            if (['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(key)) {
                wearSize.push(key.toUpperCase());
            }
            const shoeSizeMatch = key.match(/^s(\d{2})$/);
            if (shoeSizeMatch) {
                footSize.push(Number(shoeSizeMatch[1]));
            }
            if (key.includes('kg') || key.includes('gr')) {
                if (formData.categorie === 'equipo') {
                    weight.push(key);
                } else if (['suplementos', 'snacks'].includes(formData.categorie)) {
                    size.push(key);
                }
            }
        }

        const updatedData = {
            name: formData.name,
            image: imagePath,
            price: Number(formData.precio),
            category: formData.categorie,
            description: formData.bio,
            color: formData.color,
            size: size.length > 0 ? size : null,
            footSize: footSize.length > 0 ? footSize : null,
            weight: weight.length > 0 ? weight : null,
            wearSize: wearSize.length > 0 ? wearSize : null,
            gender: formData.gender === 'both'
                ? ['Hombre', 'Mujer']
                : (formData.gender ? [formData.gender] : null)
        };

        Product.update(productId, updatedData);

        res.redirect(`/product/detail/${productId}`);
    },
    delete: function (req, res) {
        return res.render('products/deleteProduct', {
            title: "Elimina un producto"
        })
    },

    destroy: function (req, res) {
        const formData = req.body;

        Product.destroy(formData.id)

        res.redirect('/product');
    }

}

module.exports = productController