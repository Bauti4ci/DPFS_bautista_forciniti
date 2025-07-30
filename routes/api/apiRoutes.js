const express = require('express');
const router = express.Router();

const apiUsersController = require('../../controllers/api/apiUsersController');
const apiProductsController = require('../../controllers/api/apiProductsController');

router.get('/users', apiUsersController.list);
router.get('/users/:id', apiUsersController.detail);

router.get('/products', apiProductsController.list);
router.get('/products/:id', apiProductsController.detail);

module.exports = router;
