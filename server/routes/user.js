const router = require('express').Router();
const upload = require('../multer');
const {
	getRooms,
	updateName,
	updateBio,
	updateImage,
} = require('../controllers/user');

router.route('/getrooms').get(getRooms);
router.route('/updatename').patch(updateName);
router.route('/updatebio').patch(updateBio);
router.route('/updateimage').patch(upload.single('profileImage'), updateImage);

module.exports = router;
