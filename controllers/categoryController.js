const db = require('../models')
const Category = db.Category

module.exports = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true }).then(categories => {
      return res.render('admin/categories', { categories })
    })
  }
}