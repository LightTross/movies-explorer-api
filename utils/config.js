require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://192.168.3.2:18017/bitfilmsdb' } = process.env;

module.exports = { PORT, MONGO_URL };