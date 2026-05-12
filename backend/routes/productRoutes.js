const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');

// GET /products
router.get('/', verifyToken, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /products/:id (bonus)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /products
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, price, description, category, inStock, imageUrl } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (!price || price <= 0) {
            return res.status(400).json({ error: 'Price must be a positive number' });
        }

        const product = new Product({ name, price, description, category, inStock, imageUrl });
        await product.save();

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// PATCH /products/:id
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { price } = req.body;

        if (price !== undefined && price <= 0) {
            return res.status(400).json({ error: 'Price must be a positive number' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// DELETE /products/:id
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully', product });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;