const adminService = require('../services/adminService')
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.user
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurants: (req, res) => {
    Category.findAll({ raw: true }).then(categories => {
      return res.render('admin/create', { categories })
    }
    )
  },
  postRestaurant: (req, res) => {
    return adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    return adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: (req, res) => {
    return Category.findAll({ raw: true }).then(categories => {
      return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
        return res.render('admin/create', { restaurant, categories })
      })
    })
  },
  putRestaurant: (req, res) => {
    return adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    return adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: (req, res) => {
    User.findAll({ raw: true })
      .then(users => {
        return res.render('admin/users', { users })
      })
  },
  toggleAdmin: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          isAdmin: !user.isAdmin
        })
          .then((user) => {
            req.flash('success_messages', 'user was successfully to update')
            return res.redirect('/admin/users')
          })
      })
  }
}

module.exports = adminController