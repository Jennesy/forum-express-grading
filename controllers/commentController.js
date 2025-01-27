const db = require('../models')
const Comment = db.Comment
const User = db.User
const Restaurant = db.Restaurant

module.exports = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      UserId: req.user.id,
      RestaurantId: req.body.restaurantId
    }).then(comment => {
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        return comment.destroy()
          .then(comment => {
            return res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  }
}