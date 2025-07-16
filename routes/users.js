var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/usersImages'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({ storage: storage });

let usersController = require('../controllers/usersController')

// Get
router.get('/login', usersController.log)
router.get('/register', usersController.create)

//Post
router.post('/register', upload.single('image'), usersController.store)

router.get('/', function (req, res, next) {
  res.render('index', { title: 'PowerUp Store' });
});

module.exports = router;
