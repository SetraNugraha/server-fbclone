import multer from 'multer'
import path from 'path'
import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'post_images',
    format: async (req, file) => {
      const ext = path.extname(file.originalname).slice(1).toLowerCase() // Mendapatkan ekstensi tanpa titik
      if (['jpg', 'jpeg', 'png'].includes(ext)) {
        return ext
      }
      return 'jpeg' // Default format jika format tidak didukung
    },
    public_id: (req, file) => Date.now() + path.extname(file.originalname),
  },
})

export const postImageUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
})
