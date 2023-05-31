const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadToCloudinary = async(path, folder = 'users') => {
    try{
        const data = await cloudinary.uploader.upload(path, {folder: folder})
        return { url: data.secure_url, public_id: data.public_id}
    } catch(err) {
        console.log(err)
        throw err
    }
}

// const uploadMultipleToCloudinary = async(path, folder = 'accommodations') => {
//     try{
//         const data = await cloudinary.uploader.upload(path, {folder:folder})
//         return data.map(d => ({url: d.secure_url, public_id: d.public_id}))
//     } catch(err) {
//         console.log(err)
//         throw err
//     }
// }

module.exports = {uploadToCloudinary}