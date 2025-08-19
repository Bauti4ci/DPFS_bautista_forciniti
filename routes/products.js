const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddlewares');

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

router.get('/create', [authMiddleware, adminMiddleware], productController.create);
router.post('/new', [authMiddleware, adminMiddleware], upload.single('image'), productValidations, productController.store);

router.get('/edit/:id', [authMiddleware, adminMiddleware], productController.edit);
router.post('/update/:id', [authMiddleware, adminMiddleware], upload.single('image'), productController.update);

router.post('/delete/:id', [authMiddleware, adminMiddleware], productController.destroy);

router.get('/cart', authMiddleware, productController.cart);
router.post('/cart/add/:id', authMiddleware, productController.addToCart);
router.post('/cart/remove/:itemId', authMiddleware, productController.removeFromCart);




module.exports = router;
