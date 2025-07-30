const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const productController = require('../controllers/productController');
const productValidations = require('../middlewares/productValidator');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/productsImages'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});
const upload = multer({ storage: storage });

router.get('/', productController.index);
router.get('/detail/:id', productController.show);

router.get('/create', productController.create);
router.post('/new', upload.single('image'), productValidations, productController.store);

router.get('/edit/:id', productController.edit);
router.post('/update/:id', upload.single('image'), productController.update);

router.post('/delete/:id', productController.destroy);

router.get('/cart', productController.cart);
router.post('/cart/add/:id', productController.addToCart);
router.post('/cart/remove/:itemId', productController.removeFromCart);




module.exports = router;
