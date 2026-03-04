import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './src/config/db'
import app from './src/app'

const port = process.env.PORT || 3000

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
})
