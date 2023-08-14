const router = require('express').Router();
const upload = require('../multer');
const {
	getRooms,
	createRoom,
	updateName,
	updateBio,
	updateImage,
} = require('../controllers/user');

router.route('/getrooms').get(getRooms);
router.route('/createroom').post(createRoom);
router.route('/updatename').patch(updateName);
router.route('/updatebio').patch(updateBio);
router.route('/updateimage').patch(upload.single('profileImage'), updateImage);

module.exports = router;
