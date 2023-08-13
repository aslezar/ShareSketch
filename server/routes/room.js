const router = require('express').Router();
const { isRoomIdValid } = require('../controllers/room');

router.route('/isValid').post(isRoomIdValid);

module.exports = router;
