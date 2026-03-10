const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: String,
                    required: true,
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        contactInfo: {
            name: { type: String },
            email: { type: String },
            phone: { type: String }
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        paymentVerifiedAt: {
            type: Date,
        },
        isShipped: {
            type: Boolean,
            default: false,
        },
        shippedAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        isReceivedByUser: {
            type: Boolean,
            default: false,
        },
        receivedAt: {
            type: Date,
        },
        transactionScreenshot: {
            type: String,
            default: null,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        paymentRejectedReason: {
            type: String,
            default: null,
        },
        notReceivedCount: {
            type: Number,
            default: 0,
        },
        notReceivedReports: [
            {
                reason: { type: String },
                reportedAt: { type: Date, default: Date.now },
                adminAction: { type: String, default: null },
                actionDate: { type: Date, default: null },
            }
        ],
        refundStatus: {
            type: String,
            enum: ['none', 'requested', 'approved', 'rejected'],
            default: 'none',
        },
        refundReason: {
            type: String,
            default: null,
        },
        refundRequestedAt: {
            type: Date,
        },
        refundProcessedAt: {
            type: Date,
        },
        refundAdminNote: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
