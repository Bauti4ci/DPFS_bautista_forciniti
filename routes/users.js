var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer');
const usersController = require('../controllers/usersController');
const registerValidations = require('../middlewares/registerValidator');
const { authMiddleware } = require('../middlewares/authMiddlewares');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/usersImages'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});
const upload = multer({ storage: storage });

router.get('/register', usersController.create);
router.post('/register', upload.single('image'), registerValidations, usersController.store);

router.get('/login', usersController.log);
router.post('/login', usersController.processLogin);

router.post('/logout', authMiddleware, usersController.logout);

router.get('/profile', authMiddleware, usersController.profile);

router.get('/edit', authMiddleware, usersController.edit);
router.post('/update', authMiddleware, upload.single('image'), usersController.update);

module.exports = router;
