const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      const data = restaurants.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50)
        }
      })
      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurant => {
      return res.render('restaurant', { restaurant })
    })
  }
}

module.exports = restController