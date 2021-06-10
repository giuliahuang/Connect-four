import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (_request, _file, callback) {
    const uploadsDir = path.join(__dirname, '../../public/uploads', `${Date.now()}`)
    fs.mkdirSync(uploadsDir)
    callback(null, uploadsDir)
  },
  filename: function (_request, file, callback) {
    callback(null, file.originalname)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  }
})

export default upload