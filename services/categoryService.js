const db = require('../models')
const Category = db.Category

let categoryService = {
  getCategories: (req, res, callback) => {
    Category.findAll({ raw: true }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id, { raw: true }).then(category => {
          return callback({ categories, category })
        })
      } else {
        return callback({ categories })
      }
    })
  }
}

module.exports = categoryService