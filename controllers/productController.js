const { Op } = require('sequelize');
const db = require('../database/models');
const Product = db.Product;

const { validationResult } = require('express-validator');


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
                db.Product.findAll({
                    where: whereCondition,
                    include: [
                        { association: 'category' },
                        { association: 'gender' }
                    ]
                }),
                db.Category.findAll({ order: [['name', 'ASC']] })
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
                    { association: 'wearSizes' },
                    { association: 'footSizes' },
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
        try {
            const [categories, genders, wearSizes, footSizes, weights, sizes] = await Promise.all([
                db.Category.findAll({ order: [['name', 'ASC']] }),
                db.Gender.findAll(),
                db.WearSize.findAll({ order: [['id', 'ASC']] }),
                db.FootSize.findAll({ order: [['id', 'ASC']] }),
                db.Weight.findAll({ order: [['id', 'ASC']] }),
                db.Size.findAll({ order: [['id', 'ASC']] })
            ]);

            res.render('products/createProduct', {
                title: "Crear un Producto",
                categories,
                genders,
                wearSizes,
                footSizes,
                weights,
                sizes
            });
        } catch (error) {
            console.error("Error al cargar el formulario de creación:", error);
            res.status(500).send("Ocurrió un error al cargar la página de creación.");
        }
    },


    store: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            try {
                const [categories, genders, wearSizes, footSizes, weights, sizes] = await Promise.all([
                    db.Category.findAll(),
                    db.Gender.findAll(),
                    db.WearSize.findAll(),
                    db.FootSize.findAll(),
                    db.Weight.findAll(),
                    db.Size.findAll()
                ]);

                return res.render('products/createProduct', {
                    title: 'Crear Producto',
                    errors: errors.mapped(),
                    oldData: req.body,
                    categories,
                    genders,
                    wearSizes,
                    footSizes,
                    weights,
                    sizes
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

            const newProduct = await db.Product.create({
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
            const [productToEdit, allCategories, allGenders, allWearSizes, allFootSizes, allWeights, allSizes] = await Promise.all([
                db.Product.findByPk(req.params.id, {
                    include: [
                        { association: 'category' },
                        { association: 'gender' },
                        { association: 'wearSizes' },
                        { association: 'footSizes' },
                        { association: 'weights' },
                        { association: 'sizes' }
                    ]
                }),
                db.Category.findAll({ order: [['name', 'ASC']] }),
                db.Gender.findAll(),
                db.WearSize.findAll({ order: [['id', 'ASC']] }),
                db.FootSize.findAll({ order: [['id', 'ASC']] }),
                db.Weight.findAll({ order: [['id', 'ASC']] }),
                db.Size.findAll({ order: [['id', 'ASC']] })
            ]);

            if (!productToEdit) {
                return res.status(404).send('Producto no encontrado');
            }

            res.render('products/editProduct', {
                title: "Editar: " + productToEdit.name,
                product: productToEdit,
                allCategories,
                allGenders,
                allWearSizes,
                allFootSizes,
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

            const productToUpdate = await db.Product.findByPk(productId);
            if (!productToUpdate) {
                return res.status(404).send('Producto no encontrado');
            }

            const imagePath = req.file ? `/productsImages/${req.file.filename}` : productToUpdate.image_url;
            await productToUpdate.update({
                name: formData.name,
                price: Number(formData.precio),
                description: formData.bio,
                image_url: imagePath,
                color: formData.color || null,
                category_id: formData.category_id,
                gender_id: formData.gender_id
            }, { transaction: t });

            await productToUpdate.setWearSizes([], { transaction: t });
            await productToUpdate.setFootSizes([], { transaction: t });
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

            /*  res.redirect(`/product`);
             */
        } catch (error) {
            await t.rollback();
            console.error("Error al actualizar el producto:", error);
            res.status(500).send("Ocurrió un error al actualizar el producto.");
        }
    },

    destroy: async (req, res) => {
        try {
            const productId = req.params.id;

            await db.Product.destroy({
                where: { id: productId }
            });
            res.redirect('/product');
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },
    addToCart: async (req, res) => {
        try {
            if (!req.session.userLogged) {
                return res.redirect('/users/login');
            }

            const userId = req.session.userLogged.id;
            const productId = req.params.id;
            const { size, quantity } = req.body;

            const [cart] = await db.Cart.findOrCreate({
                where: { user_id: userId, status: 'activo' }
            });

            let whereCondition = {
                cart_id: cart.id,
                product_id: productId
            };

            if (size) {
                const [sizeType, sizeId] = size.split(':');
                whereCondition[sizeType] = sizeId;
            } else {
                whereCondition.wear_size_id = null;
                whereCondition.foot_size_id = null;
                whereCondition.weight_id = null;
                whereCondition.size_id = null;
            }

            const existingItem = await db.CartDetail.findOne({ where: whereCondition });

            if (existingItem) {
                existingItem.quantity += parseInt(quantity, 10);
                await existingItem.save();
            } else {
                const product = await db.Product.findByPk(productId);
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

                await db.CartDetail.create(newItemData);
            }

            res.redirect('/product/cart');

        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    cart: async (req, res) => {
        try {
            if (!req.session.userLogged) {
                return res.redirect('/users/login');
            }

            const userId = req.session.userLogged.id;
            const cart = await db.Cart.findOne({
                where: { user_id: userId, status: 'activo' },
                include: {
                    model: db.CartDetail,
                    as: 'items',
                    include: [
                        { model: db.Product, as: 'product' },
                        { model: db.WearSize, as: 'wearSize' },
                        { model: db.FootSize, as: 'footSize' },
                        { model: db.Weight, as: 'weight' },
                        { model: db.Size, as: 'size' }
                    ]
                }
            });

            let total = 0;
            if (cart && cart.items) {
                total = cart.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
            }

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
            if (!req.session.userLogged) {
                return res.redirect('/users/login');
            }

            const userId = req.session.userLogged.id;
            const cartItemId = req.params.itemId;

            const cart = await db.Cart.findOne({ where: { user_id: userId, status: 'activo' } });

            if (cart) {
                await db.CartDetail.destroy({
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
