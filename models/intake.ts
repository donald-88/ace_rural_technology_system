import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client name is required']
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required'],
        min: [1000000000, 'Phone number must be at least 10 digits'],
        max: [9999999999, 'Phone number cannot exceed 10 digits']
    },
    commodity: {
        type: String,
        required: [true, 'Commodity is required']
    },
    variety: {
        type: String,
        required: [true, 'Variety is required']
    },
    grade: {
        type: Number,
        required: [true, 'Grade is required'],
        min: [1, 'Grade must be at least 1'],
        max: [5, 'Grade cannot exceed 5']
    },
    priceKg: {
        type: Number,
        required: [true, 'Price per kg is required'],
        min: [0, 'Price per kg cannot be negative'],
        max: [100000, 'Price per kg cannot exceed 100000']
    },
    grossWeight: {
        type: Number,
        required: [true, 'Gross weight is required'],
        min: [0, 'Gross weight cannot be negative'],
        max: [10000, 'Gross weight cannot exceed 10000']
    },
    deductions: {
        type: Number,
        required: [true, 'Deductions are required'],
        min: [0, 'Deductions cannot be negative'],
        max: [100, 'Deductions cannot exceed 100%']
    },
    netWeight: {
        type: Number,
        required: [true, 'Net weight is required'],
        min: [0, 'Net weight cannot be negative'],
        max: [10000, 'Net weight cannot exceed 10000']
    },
    moistureIn: {
        type: Number,
        required: [true, 'Moisture in is required'],
        min: [0, 'Moisture in cannot be negative'],
        max: [100, 'Moisture in cannot exceed 100%']
    },
    bagCount: {
        type: Number,
        required: [true, 'Bag count is required'],
        min: [1, 'Bag count must be at least 1'],
        max: [10000, 'Bag count cannot exceed 10000']
    },
    incomingBagCount: {
        type: Number,
        required: [true, 'Incoming bag count is required'],
        min: [1, 'Incoming bag count must be at least 1'],
        max: [10000, 'Incoming bag count cannot exceed 10000']
    },
    bagsReturned: {
        type: Number,
        required: [true, 'Bags returned is required'],
        min: [0, 'Bags returned cannot be negative'],
        max: [10000, 'Bags returned cannot exceed 10000']
    },
    outgoingBags: {
        type: Number,
        required: [true, 'Number of bags is required'],
        min: [0, 'Number of bags must be at least 1'],
        max: [10000, 'Number of bags cannot exceed 10000']
    },

},
    {
        timestamps: true
    });

export const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);