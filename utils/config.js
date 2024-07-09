require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = 'mongodb+srv://bloglist:kS3t3XubEMtE5Ib2@cluster0.bxg8fsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' //process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}