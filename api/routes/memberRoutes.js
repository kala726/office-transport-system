const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

router.get('/', async (req, res) => {
    const members = await Member.find();
    res.json(members);
});

router.post('/add', async (req, res) => {
    const newMember = new Member(req.body);
    await newMember.save();
    res.json(newMember);
});

module.exports = router;