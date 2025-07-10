let productController = {
    index: function (req, res) {
        return res.render('products/productDetail')
    },
    show: function (req, res) {
        return res.render('products/productCart', { title: "Carrito" })
    },
    create: function (req, res) {
        return res.render('products/createProduct', { title: "Crear un Producto" })
    }

}



module.exports = productController