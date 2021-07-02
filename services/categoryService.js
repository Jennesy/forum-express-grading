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
  },
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "name didn't exist" })
      // req.flash('error_messages', "name didn't exist")
      // return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          callback({ status: 'success', message: 'category was successfully created' })
          // res.redirect('/admin/categories')
        })
    }
  }
}

module.exports = categoryService