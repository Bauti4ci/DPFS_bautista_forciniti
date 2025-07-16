const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/productsImages'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const upload = multer({ storage: storage });

let productController = require('../controllers/productController')

// Get
router.get('/', productController.index)
router.get('/detail/:id', productController.show)
router.get('/cart', productController.cart)
router.get('/create', productController.create)
router.get('/edit/:id', productController.edit);
router.get('/delete', productController.delete);

// Post
router.post('/new', upload.single('image'), productController.store);
router.post('/edit/:id', upload.single('image'), productController.update);
router.post('/destroy', productController.destroy);

module.exports = router;