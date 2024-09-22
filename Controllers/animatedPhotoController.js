const asyncHandler = require("express-async-handler");
const { AnimatedPhoto } = require("../models/AnimatedPhoto");
const path = require("path");


const addAnimatedPhotos = asyncHandler( async(req, res) => {
    const aph = new AnimatedPhoto({
        img: req.body.img,
        number: req.body.number
    })
    await aph.save()
    res.status(200).json(aph)
})


const getAnimatedPhotos = asyncHandler( async(req, res) => {
    const images = await AnimatedPhoto.find({}).select("img")
    res.status(200).json(images)
})

const updateAnimatedPhoto = asyncHandler(async(req, res) => {
    if (!req.files.length) {
        return res.status(400).json({ message: "Kein Bild bereitgestellt" });
      }
    const image = await AnimatedPhoto.findOne({number: req.body.number})
    if(!image){
        fs.unlink(
            path.join(__dirname, `../images/${req.files[0].filename}`),
            (error) => {
              console.log(error);
            })

        return res.status(404),json({message: "image not found"})
    }
    const imagePath = path.join(process.env.SERVER_DOMAIN,`/images/${req.files[0].filename}`);
    image.img = imagePath
    await image.save()
    return res.status(200).json({message: "Foto erfolgreich aktualisiert"})
})

module.exports = {
    getAnimatedPhotos,
    updateAnimatedPhoto,
    addAnimatedPhotos
}