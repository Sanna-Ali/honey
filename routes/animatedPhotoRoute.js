const router = require("express").Router();

const { getAnimatedPhotos, updateAnimatedPhoto, addAnimatedPhotos } = require("../Controllers/animatedPhotoController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// /api/aph/add
router.post('/add', addAnimatedPhotos)

// /api/aph
router.get("/", getAnimatedPhotos);

// /api/aph
router.put("/", verifyTokenAndAdmin, updateAnimatedPhoto);

module.exports = router;

// https://cdn.pixabay.com/photo/2017/03/13/13/39/pancakes-2139844_1280.jpg
// https://cdn.pixabay.com/photo/2017/05/07/08/56/pancakes-2291908_1280.jpg

// https://cdn.pixabay.com/photo/2015/10/26/11/10/honey-1006972_1280.jpg

// https://cdn.pixabay.com/photo/2017/01/06/17/49/honey-1958464_1280.jpg