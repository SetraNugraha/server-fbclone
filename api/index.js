import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from '../routes/index.js'

dotenv.config()
const app = express()

app.use(
  cors({
    origin: 'https://client-fbclone.vercel.app',
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(router)
// app.use('/img/post_images', express.static('public/img/post_images'))
// app.use('/img/profile_images', express.static('public/img/profile_images'))

export default app
