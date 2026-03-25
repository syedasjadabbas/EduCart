const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Create new order and send email
// @route   POST /api/orders
// @access  Private (requires login token)
const addOrderItems = async (req, res) => {
    try {
        // When sent as multipart/form-data, JSON fields arrive as strings
        let body = req.body;
        if (typeof body.orderItems === 'string') {
            try { body = { ...body, orderItems: JSON.parse(body.orderItems) }; } catch (e) { }
        }
        if (typeof body.shippingAddress === 'string') {
            try { body = { ...body, shippingAddress: JSON.parse(body.shippingAddress) }; } catch (e) { }
        }
        if (typeof body.contactInfo === 'string') {
            try { body = { ...body, contactInfo: JSON.parse(body.contactInfo) }; } catch (e) { }
        }

        const { orderItems, shippingAddress, contactInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentMethod } = body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Resolve user from JWT token
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (e) { /* token invalid */ }
        }

        // Screenshot URL from multer
        const screenshotUrl = req.file ? (req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`) : null;

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            contactInfo,
            paymentMethod: paymentMethod || 'Credit Card',
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            transactionScreenshot: screenshotUrl,
        });

        const createdOrder = await order.save();

        // Receipt email to student
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmed! 🎓</h1>
                    <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px;">Order #${createdOrder._id}</p>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi <strong>${contactInfo.name || 'Student'}</strong>,</p>
                    <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 24px;">
                        Thank you for shopping with EduCart! Your order has been received and is currently being processed.
                    </p>
                    
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
                        <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Order Summary</h3>
                        ${orderItems.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px;">
                                <div style="color: #475569;">
                                    <strong>${item.name}</strong> <span style="color: #94a3b8;">x${item.qty}</span>
                                </div>
                                <div style="color: #1e293b; font-weight: 600;">Rs ${(item.price * item.qty).toLocaleString()}</div>
                            </div>
                        `).join('')}
                        <div style="display: flex; justify-content: space-between; margin-top: 16px; color: #64748b; font-size: 14px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                            <span>Shipping</span>
                            <span>Rs ${shippingPrice}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #cbd5e1; color: #0f172a; font-size: 18px; font-weight: 700;">
                            <span>Total</span>
                            <span style="color: #4f46e5;">Rs ${totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                        <p style="font-size: 14px; color: #94a3b8; margin: 0;">Need help? Reply to this email.<br/>Thanks for choosing EduCart Store!</p>
                    </div>
                </div>
            </div>
        `;
        sendEmail({ email: contactInfo.email, subject: 'Your EduCart Order Receipt', html: emailHtml }).catch(err => console.error('Order receipt email failed:', err.message));

        // Notification email to admin
        const adminEmailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">New Order Alert! 📦</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <h2 style="color: #059669; font-size: 32px; margin-top: 0; text-align: center; margin-bottom: 24px;">Rs ${totalPrice.toLocaleString()}</h2>
                    
                    <div style="background-color: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 10px; padding: 24px; margin-top: 24px;">
                        <h3 style="margin-top: 0; color: #065f46; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid #a7f3d0; padding-bottom: 8px;">Customer Information</h3>
                        <p style="margin: 0 0 10px 0; font-size: 15px; color: #064e3b;"><strong>Name:</strong> ${contactInfo.name}</p>
                        <p style="margin: 0 0 10px 0; font-size: 15px; color: #064e3b;"><strong>Email:</strong> ${contactInfo.email}</p>
                        <p style="margin: 0; font-size: 15px; color: #064e3b;"><strong>Order ID:</strong> #${createdOrder._id}</p>
                    </div>

                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">Open Admin Dashboard</a>
                    </div>
                </div>
            </div>
        `;
        sendEmail({
            email: 'asjadabbaszaidi@gmail.com',
            subject: `NEW ORDER ALERT - Rs ${totalPrice.toLocaleString()}`,
            html: adminEmailHtml
        }).catch(err => console.error('Admin order alert email failed:', err.message));

        res.status(201).json(createdOrder);

        // Reduce stock for each ordered item (fire-and-forget, don't fail the order)
        for (const item of orderItems) {
            if (item.product) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.qty } },
                    { new: true }
                ).catch(() => { });
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (Admin in real app, keeping simple for demo)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Admin
const updateOrderToShipped = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.isShipped = true;
        order.shippedAt = Date.now();
        // Keep isDelivered for internal consistency if needed, or just use isShipped
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        // Send Shipped Email Notification
        const userEmail = order.contactInfo?.email || order.user?.email;
        if (userEmail) {
            const userName = order.contactInfo?.name || order.user?.name || 'Valued Customer';
            const emailHtml = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Your Order has been Shipped! 📦</h1>
                    </div>
                    <div style="padding: 32px; background-color: white;">
                        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi <strong>${userName}</strong>,</p>
                        <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 24px;">
                            Great news! Your EduCart order <strong>#${order._id}</strong> has been shipped and is on its way to you.
                        </p>
                        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 24px; margin-bottom: 24px; border-left: 5px solid #3b82f6;">
                            <h3 style="margin-top: 0; color: #1e40af; font-size: 16px; margin-bottom: 8px;">Shipping to:</h3>
                            <p style="margin: 0; font-size: 15px; color: #1e40af; line-height: 1.4;">
                                ${order.shippingAddress?.address || 'N/A'}<br/>
                                ${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.postalCode || 'N/A'}
                            </p>
                        </div>
                        <p style="font-size: 16px; color: #475569; line-height: 1.5; text-align: center;">You can track its progress in your order history on the EduCart dashboard.</p>
                        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                            <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for shopping with EduCart!</p>
                        </div>
                    </div>
                </div>
            `;
            sendEmail({ email: userEmail, subject: '📦 Your EduCart Order has been Shipped!', html: emailHtml }).catch(err => console.error('Shipping email failed:', err.message));
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const { email } = req.query;
        console.log(`[DEBUG] Fetching my orders. Query Email: ${email}`);

        // Try to resolve user from JWT token
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
                console.log(`[DEBUG] Found userId from token: ${userId}`);
            } catch (e) {
                console.log(`[DEBUG] Invalid token or error decoding: ${e.message}`);
            }
        } else {
            console.log(`[DEBUG] No Auth header or no Bearer token found.`);
        }

        let orders = [];
        if (userId || email) {
            // Find orders where EITHER user field matches userId OR contactInfo.email matches query email
            const query = {
                $or: []
            };
            if (userId) query.$or.push({ user: userId });
            if (email) query.$or.push({ 'contactInfo.email': email });

            orders = await Order.find(query).sort({ createdAt: -1 });
            console.log(`[DEBUG] Found ${orders.length} orders total using query: ${JSON.stringify(query)}`);
        } else {
            console.log(`[DEBUG] No userId and no email provided in query.`);
        }

        res.json(orders);
    } catch (error) {
        console.error(`[ERROR] getMyOrders error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    User confirms order received
// @route   PUT /api/orders/:id/received
// @access  Private
const confirmOrderReceived = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.isReceivedByUser = true;
        order.receivedAt = Date.now();
        order.notReceivedCount = 0; // Clear reports as it is now received
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    User reports order not received — resets to Payment Verified
// @route   PUT /api/orders/:id/not-received
// @access  Private
const reportNotReceived = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Reset shipped and delivered status completely
        order.isShipped = false;
        order.shippedAt = null;
        order.isDelivered = false;
        order.deliveredAt = null;
        order.isReceivedByUser = false; 
        order.receivedAt = null;

        // Log the report
        order.notReceivedCount = (order.notReceivedCount || 0) + 1;
        if (!order.notReceivedReports) order.notReceivedReports = [];
        order.notReceivedReports.push({
            reason: req.body.reason || 'User reported order not received.',
            reportedAt: Date.now(),
        });

        const updatedOrder = await order.save();

        // Notify admin via email
        const userName = order.contactInfo?.name || 'A customer';
        const userEmail = order.contactInfo?.email || 'N/A';
        const adminEmailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #ef4444, #b91c1c); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Order Not Received</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                        <strong>${userName}</strong> (${userEmail}) has reported that order <strong>#${order._id}</strong> was <span style="color: #ef4444; font-weight: bold;">NOT received</span>.
                    </p>
                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 20px; margin-bottom: 24px; border-left: 5px solid #ef4444;">
                        <h3 style="margin-top: 0; color: #991b1b; font-size: 15px; margin-bottom: 8px;">Reason Shared:</h3>
                        <p style="margin: 0; font-size: 15px; color: #7f1d1d; font-style: italic;">"${req.body.reason || 'No reason provided'}"</p>
                    </div>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; font-size: 14px; color: #475569;">
                        <p style="margin: 0 0 10px 0;"><strong>Report Count:</strong> ${order.notReceivedCount}</p>
                        <p style="margin: 0 0 10px 0;"><strong>Shipping To:</strong> ${order.shippingAddress?.address}, ${order.shippingAddress?.city}</p>
                        <p style="margin: 0;"><strong>Order Total:</strong> Rs ${order.totalPrice.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `;
        sendEmail({
            email: 'asjadabbaszaidi@gmail.com',
            subject: `⚠️ NOT RECEIVED - Order #${order._id} (Report #${order.notReceivedCount})`,
            html: adminEmailHtml
        }).catch(err => console.error('Not received admin email failed:', err.message));

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin approve payment
// @route   PUT /api/orders/:id/approve-payment
// @access  Admin
const approvePayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.paymentStatus = 'approved';
        order.paymentVerifiedAt = Date.now();
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentRejectedReason = null;
        await order.save();
        const updated = await Order.findById(order._id).populate('user', 'name email');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid (User via PayPal)
// @route   PUT /api/orders/:id/pay
// @access  Private
const payOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentStatus = 'approved';
        order.paymentMethod = 'PayPal';
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin reject payment
// @route   PUT /api/orders/:id/reject-payment
// @access  Admin
const rejectPayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.paymentStatus = 'rejected';
        order.paymentRejectedReason = req.body.reason || 'Payment could not be verified.';
        await order.save();

        const updated = await Order.findById(order._id).populate('user', 'name email');

        // Send Rejected Email Notification
        const userEmail = updated.contactInfo?.email || updated.user?.email;
        if (userEmail) {
            const userName = updated.contactInfo?.name || updated.user?.name || 'Valued Customer';
            const emailHtml = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Payment Issue ⚠️</h1>
                    </div>
                    <div style="padding: 32px; background-color: white;">
                        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi <strong>${userName}</strong>,</p>
                        <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 24px;">
                            Unfortunately, there was an issue verifying the payment for your order <strong>#${updated._id}</strong>.
                        </p>
                        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 20px; margin-bottom: 24px; border-left: 5px solid #ef4444;">
                            <h3 style="margin-top: 0; color: #991b1b; font-size: 15px; margin-bottom: 8px;">Reason for Rejection:</h3>
                            <p style="margin: 0; font-size: 16px; color: #7f1d1d; font-weight: 500;">
                                "${updated.paymentRejectedReason}"
                            </p>
                        </div>
                        <p style="font-size: 15px; color: #475569; line-height: 1.5; text-align: center;">
                            Your order is on hold. Please reply to this email or contact support to resolve this so we can ship your items.
                        </p>
                        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                            <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for shopping with EduCart!</p>
                        </div>
                    </div>
                </div>
            `;
            sendEmail({
                email: userEmail,
                subject: '⚠️ Important Update Regarding Your EduCart Order',
                html: emailHtml,
            }).catch(err => console.error('Payment rejection email failed:', err.message));
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export all orders as CSV
// @route   GET /api/orders/export-csv
// @access  Admin
const exportOrdersCsv = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });

        const header = 'Order ID,Customer Name,Email,Date,Items,Total,Payment Status,Shipped,Received,Refund Status\n';
        const rows = orders.map(o => {
            const name = (o.contactInfo?.name || o.user?.name || 'N/A').replace(/,/g, ' ');
            const email = (o.contactInfo?.email || o.user?.email || 'N/A').replace(/,/g, ' ');
            const date = new Date(o.createdAt).toLocaleDateString('en-GB');
            const items = o.orderItems.map(i => `${i.name} x${i.qty}`).join(' | ').replace(/,/g, ' ');
            return `${o._id},${name},${email},${date},"${items}",${o.totalPrice},${o.paymentStatus},${o.isShipped ? 'Yes' : 'No'},${o.isReceivedByUser ? 'Yes' : 'No'},${o.refundStatus || 'none'}`;
        }).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=educart_orders.csv');
        res.send(header + rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    User requests a refund/return
// @route   PUT /api/orders/:id/request-refund
// @access  Private
const requestRefund = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!order.isReceivedByUser) {
            return res.status(400).json({ message: 'You can only request a refund after receiving the order.' });
        }
        if (order.refundStatus === 'requested') {
            return res.status(400).json({ message: 'A refund request is already pending for this order.' });
        }
        if (order.refundStatus === 'approved') {
            return res.status(400).json({ message: 'This order has already been refunded.' });
        }

        order.refundStatus = 'requested';
        order.refundReason = req.body.reason || 'No reason provided';
        order.refundRequestedAt = Date.now();
        order.refundAdminNote = null;
        await order.save();

        // Email admin about refund request
        const userName = order.contactInfo?.name || 'A customer';
        const userEmail = order.contactInfo?.email || 'N/A';
        const adminEmailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🔄 Refund Requested</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <p style="font-size: 16px; color: #374151;"><strong>${userName}</strong> has requested a refund for order <strong>#${order._id}</strong>.</p>
                    <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 20px; margin: 24px 0; border-left: 5px solid #f59e0b;">
                        <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">Reason:</h3>
                        <p style="margin: 0; color: #78350f; font-style: italic;">"${order.refundReason}"</p>
                    </div>
                    <p style="color: #475569; font-size: 15px;">Order Total: <strong>Rs ${order.totalPrice.toLocaleString()}</strong></p>
                </div>
            </div>
        `;
        sendEmail({
            email: 'asjadabbaszaidi@gmail.com',
            subject: `🔄 REFUND REQUEST - Order #${order._id}`,
            html: adminEmailHtml
        }).catch(err => console.error('Refund request admin email failed:', err.message));

        const updated = await Order.findById(order._id).populate('user', 'name email');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin approves or rejects refund
// @route   PUT /api/orders/:id/process-refund
// @access  Admin
const processRefund = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.refundStatus !== 'requested') {
            return res.status(400).json({ message: 'No pending refund request for this order.' });
        }

        const { status, adminNote } = req.body; // status = 'approved' or 'rejected'
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "approved" or "rejected".' });
        }

        order.refundStatus = status;
        order.refundAdminNote = adminNote || null;
        order.refundProcessedAt = Date.now();
        await order.save();

        // Email user about refund decision
        const userEmail = order.contactInfo?.email || order.user?.email;
        if (userEmail) {
            const userName = order.contactInfo?.name || 'Valued Customer';
            const isApproved = status === 'approved';
            const emailHtml = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background: linear-gradient(135deg, ${isApproved ? '#10b981, #059669' : '#ef4444, #dc2626'}); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${isApproved ? 'Refund Approved ✅' : 'Refund Update ❌'}</h1>
                    </div>
                    <div style="padding: 32px; background-color: white;">
                        <p style="font-size: 16px; color: #374151;">Hi <strong>${userName}</strong>,</p>
                        <p style="font-size: 16px; color: #374151; line-height: 1.5;">Your refund request for order <strong>#${order._id}</strong> has been <strong>${isApproved ? 'approved' : 'rejected'}</strong>.</p>
                        ${isApproved ? `<div style="background-color: #ecfdf5; padding: 16px; border-radius: 10px; margin: 20px 0; text-align: center; color: #065f46; font-weight: bold; border: 1px solid #a7f3d0;">Amount: Rs ${order.totalPrice.toLocaleString()}</div>` : ''}
                        ${adminNote ? `<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0;"><h4 style="margin-top: 0; color: #475569; font-size: 15px;">Note from Store:</h4><p style="margin: 0; color: #64748b; font-style: italic;">"${adminNote}"</p></div>` : ''}
                        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                            <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for shopping with EduCart!</p>
                        </div>
                    </div>
                </div>
            `;
            sendEmail({ email: userEmail, subject: `${isApproved ? '✅' : '❌'} Refund ${isApproved ? 'Approved' : 'Rejected'} — Order #${order._id}`, html: emailHtml }).catch(err => console.error('Refund decision email failed:', err.message));
        }

        const updated = await Order.findById(order._id).populate('user', 'name email');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin reships order after "Not Received" report
// @route   PUT /api/orders/:id/reship
// @access  Admin
const reshipOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.isShipped = true;
        order.shippedAt = Date.now();
        order.isReceivedByUser = false; // Just in case
        
        // Mark the latest report as "Handled/Reshipped"
        if (order.notReceivedReports && order.notReceivedReports.length > 0) {
            const lastReport = order.notReceivedReports[order.notReceivedReports.length - 1];
            lastReport.adminAction = 'Reshipped';
            lastReport.actionDate = Date.now();
        }

        const updatedOrder = await order.save();

        // Notify User via fresh Shipping Email
        const userEmail = order.contactInfo?.email || order.user?.email;
        if (userEmail) {
            const userName = order.contactInfo?.name || order.user?.name || 'Valued Customer';
            const emailHtml = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Your Order has been RE-SHIPPED! 🚀</h1>
                    </div>
                    <div style="padding: 32px; background-color: white;">
                        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi <strong>${userName}</strong>,</p>
                        <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 24px;">
                            We processed your report about order <strong>#${order._id}</strong>. Good news — we've **sent your package again!**
                        </p>
                        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 24px; margin-bottom: 24px; border-left: 5px solid #10b981;">
                            <p style="margin: 0; font-size: 15px; color: #065f46; line-height: 1.4;">
                                <strong>Status:</strong> Re-shipped Today<br/>
                                <strong>To:</strong> ${order.shippingAddress?.address}, ${order.shippingAddress?.city}
                            </p>
                        </div>
                        <p style="font-size: 15px; color: #475569; line-height: 1.5; text-align: center;">We hope it reaches you soon! Track it via your dashboard.</p>
                        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                            <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for your patience with EduCart!</p>
                        </div>
                    </div>
                </div>
            `;
            sendEmail({ email: userEmail, subject: '🚀 RE-SHIPPED: Your EduCart Order is on its way (Again!)', html: emailHtml }).catch(err => console.error('Reship email failed:', err.message));
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrders,
    getOrderById,
    updateOrderToShipped,
    getMyOrders,
    confirmOrderReceived,
    reportNotReceived,
    approvePayment,
    rejectPayment,
    exportOrdersCsv,
    requestRefund,
    processRefund,
    reshipOrder,
    payOrder,
};
