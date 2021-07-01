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
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] }).then(restaurant => {
      return callback({ restaurant })
    })
  }
}

module.exports = adminService