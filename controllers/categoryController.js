const db = require('../models')
const Category = db.Category

module.exports = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id, { raw: true }).then(category => {
          return res.render('admin/categories', { categories, category })
        })
      } else {
        return res.render('admin/categories', { categories })
      }
    })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(category => res.redirect('/admin/categories'))
          .catch(error => console.log(error))
      })
  }
}