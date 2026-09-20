const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, customerController.getAllCustomers);
router.post('/batch', authMiddleware, customerController.createCustomersBatch);
router.post('/', authMiddleware, customerController.createCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);
router.post('/register', customerController.createCustomer);
module.exports = router;