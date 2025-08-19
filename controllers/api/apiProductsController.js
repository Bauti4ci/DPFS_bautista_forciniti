const db = require('../../database/models');

const apiProductsController = {

    list: async (req, res) => {
        try {
            const [products, categories] = await Promise.all([
                db.Product.findAll({
                    include: [{ association: 'category' }]
                }),
                db.Category.findAll({
                    include: [{ model: db.Product, as: 'products' }]
                })
            ]);

            const productsWithDetail = products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                detail: `/api/products/${product.id}`
            }));

            const countByCategory = {};
            categories.forEach(category => {
                countByCategory[category.name] = category.products.length;
            });

            return res.json({
                count: products.length,
                countByCategory: countByCategory,
                products: productsWithDetail
            });

        } catch (error) {
            console.error("Error en API de productos (list):", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    detail: async (req, res) => {
        try {
            const product = await db.Product.findByPk(req.params.id, {
                include: [
                    { association: 'category' },
                    { association: 'gender' },
                    { association: 'wearSizes' },
                    { association: 'footSizes' },
                    { association: 'weights' },
                    { association: 'sizes' }
                ]
            });

            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            product.setDataValue('image_url_full', `${req.protocol}://${req.get('host')}${product.image_url}`);

            return res.json(product);

        } catch (error) {
            console.error("Error en API de productos (detail):", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = apiProductsController;
