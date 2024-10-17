import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    intakeId: {
        type: String,
        required: [true, 'Intake ID is required']
    },
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
    incomingBagCount: {
        type: Number,
        required: [true, 'Incoming bag count is required'],
        min: [1, 'Incoming bag count must be at least 1'],
        max: [10000, 'Incoming bag count cannot exceed 10000']
    },
    numberOfBags: {
        type: Number,
        required: [true, 'Number of bags is required'],
        min: [1, 'Number of bags must be at least 1'],
        max: [10000, 'Number of bags cannot exceed 10000']
    },
    time: {
        type: String,
        required: [true, 'Time is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    }
});

export const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);