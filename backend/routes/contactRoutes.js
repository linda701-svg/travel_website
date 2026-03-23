const express = require('express');
const { createContactMessage, getContactMessages } = require('../controllers/contactController');

const router = express.Router();

router.route('/')
    .get(getContactMessages)
    .post(createContactMessage);

module.exports = router;
