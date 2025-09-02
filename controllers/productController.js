const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// 1. IMPORTACIONES DE MODELOS CONSOLIDADAS
const {
    Product,
    Category,
    Gender,
    WearSize,
    FootSize,
    Weight,
    Size,
    Cart,
    CartDetail
} = require('../database/models');

const db = require('../database/models'); // Mantenemos db para acceder a 'sequelize' en las transacciones

const productController = {
    index: async (req, res) => {
        try {
            const { q: searchQuery, category: categoryId } = req.query;
            let whereCondition = {};
            let pageTitle = "Nuestro Catálogo de Productos";
            if (searchQuery) {
                whereCondition[Op.or] = [
                    { name: { [Op.like]: `%${searchQuery}%` } },
                    { color: { [Op.like]: `%${searchQuery}%` } }
                ];
                pageTitle = `Resultados para: "${searchQuery}"`;
            }
            if (categoryId) {
                whereCondition.category_id = categoryId;
            }
            const [products, allCategories] = await Promise.all([
                Product.findAll({
                    where: whereCondition,
                    include: [
                        { association: 'category' },
                        { association: 'gender' }
                    ]
                }),
                Category.findAll({ order: [['name', 'ASC']] })
            ]);
            res.render('products/productList', {
                title: pageTitle,
                products: products,
                allCategories: allCategories,
                currentCategory: categoryId
            });
        } catch (error) {
            console.error("Error al listar/buscar productos:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    show: async (req, res) => {
        try {
            const productToShow = await Product.findByPk(req.params.id, {
                include: [
                    { association: 'category' },
                    { association: 'gender' },
                    { association: 'wearsizes' },
                    { association: 'footsizes' },
                    { association: 'weights' },
                    { association: 'sizes' }
                ]
            });
            if (productToShow) {
                res.render('products/productDetail', {
                    title: productToShow.name,
                    product: productToShow
                });
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (error) {
            console.error("Error al mostrar detalle del producto:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    create: async (req, res) => {
        console.log("--- VERSIÓN MÁS RECIENTE DEL CÓDIGO ESTÁ CORRIENDO ---");
        try {
            const [categories, genders, wearsizes, footsizes, weights, sizes] = await Promise.all([
                Category.findAll({ order: [['name', 'ASC']] }),
                Gender.findAll(),
                WearSize.findAll({ order: [['id', 'ASC']] }),
                FootSize.findAll({ order: [['id', 'ASC']] }),
                Weight.findAll({ order: [['id', 'ASC']] }),
                Size.findAll({ order: [['id', 'ASC']] })
            ]);

            // ===== ESTE BLOQUE ES EL QUE FALTABA CORREGIR =====
            res.render('products/createProduct', {
                title: "Crear un Producto",
                categories,
                genders,
                wearSizes: wearsizes,   // <-- CORREGIDO
                footSizes: footsizes,   // <-- CORREGIDO
                weights: weights,
                sizes: sizes
            });
            // =======================================================

        } catch (error) {
            console.error("Error al cargar el formulario de creación:", error);
            res.status(500).send("Ocurrió un error al cargar la página de creación.");
        }
    },

    store: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            try {
                const [categories, genders, wearsizes, footsizes, weights, sizes] = await Promise.all([
                    Category.findAll(),
                    Gender.findAll(),
                    WearSize.findAll(),
                    FootSize.findAll(),
                    Weight.findAll(),
                    Size.findAll()
                ]);

                return res.render('products/createProduct', {
                    title: 'Crear Producto',
                    errors: errors.mapped(),
                    oldData: req.body,
                    categories,
                    genders,
                    wearSizes: wearsizes, // <-- Este ya estaba bien
                    footSizes: footsizes, // <-- Este ya estaba bien
                    weights: weights,
                    sizes: sizes
                });
            } catch (dbError) {
                console.error("Error al recargar datos para el formulario:", dbError);
                return res.status(500).send("Ocurrió un error al procesar el formulario.");
            }
        }

        const t = await db.sequelize.transaction();
        try {
            const formData = req.body;
            const imagePath = req.file ? `/productsImages/${req.file.filename}` : null;

            const newProduct = await Product.create({
                name: formData.name,
                price: Number(formData.precio),
                description: formData.bio,
                image_url: imagePath,
                color: formData.color || null,
                category_id: formData.category_id,
                gender_id: formData.gender_id
            }, { transaction: t });

            const stockData = formData.stock || {};
            const associationMap = {
                wear: 'addWearSize',
                foot: 'addFootSize',
                weight: 'addWeight',
                size: 'addSize'
            };

            for (const type in stockData) {
                const sizes = stockData[type];
                const addMethod = associationMap[type];
                if (addMethod) {
                    for (const sizeId in sizes) {
                        const stock = parseInt(sizes[sizeId], 10);
                        if (!isNaN(stock) && stock > 0) {
                            await newProduct[addMethod](sizeId, {
                                through: { stock: stock },
                                transaction: t
                            });
                        }
                    }
                }
            }

            await t.commit();
            res.redirect(`/product/detail/${newProduct.id}`);

        } catch (error) {
            await t.rollback();
            console.error("Error al crear el producto:", error);
            res.status(500).send("Ocurrió un error en el servidor al crear el producto.");
        }
    },

    edit: async (req, res) => {
        try {
            const [productToEdit, allCategories, allGenders, allWearsizes, allFootsizes, allWeights, allSizes] = await Promise.all([
                Product.findByPk(req.params.id, {
                    include: [
                        { association: 'category' },
                        { association: 'gender' },
                        { association: 'wearsizes' },   // <-- CORREGIDO
                        { association: 'footsizes' },   // <-- CORREGIDO
                        { association: 'weights' },
                        { association: 'sizes' }
                    ]
                }),
                Category.findAll({ order: [['name', 'ASC']] }),
                Gender.findAll(),
                WearSize.findAll({ order: [['id', 'ASC']] }),
                FootSize.findAll({ order: [['id', 'ASC']] }),
                Weight.findAll({ order: [['id', 'ASC']] }),
                Size.findAll({ order: [['id', 'ASC']] })
            ]);

            if (!productToEdit) {
                return res.status(404).send('Producto no encontrado');
            }

            res.render('products/editProduct', {
                title: "Editar: " + productToEdit.name,
                product: productToEdit,
                allCategories,
                allGenders,
                allWearsizes,
                allFootsizes,
                allWeights,
                allSizes
            });

        } catch (error) {
            console.error("Error al cargar el formulario de edición:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    update: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const productId = req.params.id;
            const formData = req.body;
            const productToUpdate = await Product.findByPk(productId);
            if (!productToUpdate) {
                await t.rollback();
                return res.status(404).send('Producto no encontrado');
            }
            const imagePath = req.file ? `/productsImages/${req.file.filename}` : productToUpdate.image_url;
            await productToUpdate.update({
                name: formData.name, price: Number(formData.precio),
                description: formData.bio, image_url: imagePath,
                color: formData.color || null, category_id: formData.category_id,
                gender_id: formData.gender_id
            }, { transaction: t });
            await productToUpdate.setWearsizes([], { transaction: t });
            await productToUpdate.setFootsizes([], { transaction: t });
            await productToUpdate.setWeights([], { transaction: t });
            await productToUpdate.setSizes([], { transaction: t });
            const stockData = formData.stock || {};
            const associationMap = {
                wear: 'addWearSize', foot: 'addFootSize',
                weight: 'addWeight', size: 'addSize'
            };
            for (const type in stockData) {
                const sizes = stockData[type];
                const addMethod = associationMap[type];
                if (addMethod) {
                    for (const sizeId in sizes) {
                        const stock = parseInt(sizes[sizeId], 10);
                        if (!isNaN(stock) && stock > 0) {
                            await productToUpdate[addMethod](sizeId, {
                                through: { stock: stock },
                                transaction: t
                            });
                        }
                    }
                }
            }
            await t.commit();
            res.redirect(`/product/detail/${productId}`);
        } catch (error) {
            await t.rollback();
            console.error("Error al actualizar el producto:", error);
            res.status(500).send("Ocurrió un error al actualizar el producto.");
        }
    },

    destroy: async (req, res) => {
        try {
            const productId = req.params.id;
            await Product.destroy({
                where: { id: productId }
            });
            res.redirect('/product');
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    // --- MÉTODOS DEL CARRITO ---

    addToCart: async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/users/login');
            }
            const userId = req.user.id;
            const productId = req.params.id;
            const { size, quantity } = req.body;

            const [cart] = await Cart.findOrCreate({
                where: { user_id: userId, status: 'activo' }
            });

            let whereCondition = {
                cart_id: cart.id,
                product_id: productId,
                wear_size_id: null,
                foot_size_id: null,
                weight_id: null,
                size_id: null
            };
            if (size) {
                const [sizeType, sizeId] = size.split(':');
                whereCondition[sizeType] = sizeId;
            }

            const existingItem = await CartDetail.findOne({ where: whereCondition });

            if (existingItem) {
                existingItem.quantity += parseInt(quantity, 10);
                await existingItem.save();
            } else {
                const product = await Product.findByPk(productId);
                let newItemData = {
                    cart_id: cart.id,
                    product_id: productId,
                    quantity: parseInt(quantity, 10),
                    unit_price: product.price
                };
                if (size) {
                    const [sizeType, sizeId] = size.split(':');
                    newItemData[sizeType] = sizeId;
                }
                await CartDetail.create(newItemData);
            }
            res.redirect('/product/cart');
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    cart: async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/users/login');
            }
            const cart = await Cart.findOne({
                where: { user_id: req.user.id, status: 'activo' },
                include: [{
                    model: CartDetail,
                    as: 'items',
                    include: [
                        { model: Product, as: 'product' },
                        { model: WearSize, as: 'wearSize' },
                        { model: FootSize, as: 'footSize' },
                        { model: Weight, as: 'weight' },
                        { model: Size, as: 'size' }
                    ]
                }]
            });
            res.render('products/productCart', {
                title: "Carrito de Compras",
                cart: cart
            });
        } catch (error) {
            console.error("Error al mostrar el carrito:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    removeFromCart: async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/users/login');
            }
            const userId = req.user.id;
            const cartItemId = req.params.itemId;

            const cart = await Cart.findOne({ where: { user_id: userId, status: 'activo' } });

            if (cart) {
                await CartDetail.destroy({
                    where: {
                        id: cartItemId,
                        cart_id: cart.id
                    }
                });
            }
            res.redirect('/product/cart');
        } catch (error) {
            console.error("Error al eliminar item del carrito:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    }
};

module.exports = productController;