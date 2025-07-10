var express = require('express');
var router = express.Router();

let productController = require('../controllers/productController')

router.get('/', productController.index)
router.get('/cart', productController.show)
router.get('/create', productController.create)

module.exports = router;