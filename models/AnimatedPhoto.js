const mongoose = require('mongoose')
const animatedPhotoSchema = new mongoose.Schema({
   
    img:{
        type: String,
        trim: true,
        default: "https://cdn.pixabay.com/photo/2017/03/13/13/39/pancakes-2139844_1280.jpg"
    },
    number: {
        type: Number
    },
}, {
    timestamps: true

})

const AnimatedPhoto = mongoose.model('animatedphoto', animatedPhotoSchema)

module.exports = {
    AnimatedPhoto
}