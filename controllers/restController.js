const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let restController = {
  getRestaurants: (req, res) => {
    let categoryId = ''
    let whereQuery = {}
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      where: whereQuery
    }).then(restaurants => {
      const data = restaurants.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50)
        }
      })
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
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