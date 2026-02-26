const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// සියලුම සාමාජිකයින් ලබා ගැනීම
router.get('/', async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// අලුත් සාමාජිකයෙක් එකතු කිරීම
router.post('/add', async (req, res) => {
    try {
        const newMember = new Member(req.body);
        const savedMember = await newMember.save();
        res.status(201).json(savedMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// සාමාජිකයෙකු මැකීම
router.delete('/:id', async (req, res) => {
    try {
        // req.params.id හරහා එන ID එක පාවිච්චි කර මකා දැමීම
        const result = await Member.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json({ message: "Member deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;