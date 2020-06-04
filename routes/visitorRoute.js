const express = require('express');

const visitorcontroller = require('./../controller/visitorController');

const router = express.Router();

router.get('/', visitorcontroller.getIndexPage);
router.post('/submitAppointment', visitorcontroller.submitAppointment);
module.exports = router;
