const axios = require('axios')
const config = require('../config')

const request = axios.create({
  baseURL: "https://api.github.com",
  timeout: 15000,
  headers: {
    Authorization: 'token xxx'
  }
})

module.exports = request
