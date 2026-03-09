const express = require('express');
const router = express.Router();
const { addOrderItems, getOrders, getOrderById, updateOrderToShipped, getMyOrders, confirmOrderReceived, reportNotReceived, approvePayment, rejectPayment } = require('../controllers/orderController');
const upload = require('../middleware/upload');

router.post('/', upload.single('transactionScreenshot'), addOrderItems);
router.get('/myorders', getMyOrders);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/ship', updateOrderToShipped);
router.put('/:id/received', confirmOrderReceived);
router.put('/:id/not-received', reportNotReceived);
router.put('/:id/approve-payment', approvePayment);
router.put('/:id/reject-payment', rejectPayment);

module.exports = router;
