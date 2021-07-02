const categoryService = require('../services/categoryService')
const db = require('../models')
const Category = db.Category

module.exports = {
  getCategories: (req, res) => {
    return categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    return categoryService.postCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        console.log('error')
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/categories')
    })
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