const categoryService = require('../../services/categoryService')
module.exports = {
  getCategories: (req, res) => {
    return categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  postCategory: (req, res) => {
    return categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  putCategory: (req, res) => {
    return categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}