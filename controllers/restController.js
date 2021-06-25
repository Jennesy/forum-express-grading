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
      console.log(restaurants[0])
      console.log('---------------')
      const data = restaurants.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50)
        }
      })
      console.log(data[0])
      return res.render('restaurants', { restaurants: data })
    })
  }
}

module.exports = restController