const express = require('express');
const router = express.Router();
const { addOrderItems, getOrders, getOrderById, updateOrderToShipped, getMyOrders, confirmOrderReceived, reportNotReceived, approvePayment, rejectPayment, exportOrdersCsv, requestRefund, processRefund, reshipOrder } = require('../controllers/orderController');
const upload = require('../middleware/upload');

router.post('/', upload.single('transactionScreenshot'), addOrderItems);
router.get('/myorders', getMyOrders);
router.get('/export-csv', exportOrdersCsv);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/ship', updateOrderToShipped);
router.put('/:id/reship', reshipOrder);
router.put('/:id/received', confirmOrderReceived);
router.put('/:id/not-received', reportNotReceived);
router.put('/:id/approve-payment', approvePayment);
router.put('/:id/reject-payment', rejectPayment);
router.put('/:id/request-refund', requestRefund);
router.put('/:id/process-refund', processRefund);

module.exports = router;
