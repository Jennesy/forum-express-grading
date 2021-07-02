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
    return categoryService.putCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res) => {
    return categoryService.deleteCategory(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/categories')
      }
    })
  }
}