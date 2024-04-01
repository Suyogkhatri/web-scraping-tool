import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    priceHistory: [{
        price: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }],
    lowestprice: { type: Number },
    highestprice: { type: Number },
    average: { type: Number },
    discountRate: { type: Number },
    description: { type: String },
    category: { type: String },
    reviewCount: { type: Number },
    isOutOfStock: { type: Boolean, default: false },
    Users: [{
        email: { type: String, required: true, lowercase: true }
    }], 
    default: [],
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;