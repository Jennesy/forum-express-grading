const categoryService = require('../../services/categoryService')
module.exports = {
  getCategories: (req, res) => {
    return categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  }
}