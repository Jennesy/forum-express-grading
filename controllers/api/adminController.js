const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    return adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = adminController