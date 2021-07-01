const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let adminService = {
  getRestaurants: (req, res, callback) => {
    Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        return callback({ restaurants })
      })
  }
}

module.exports = adminService