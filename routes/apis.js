const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const userController = require('../controllers/api/userController.js')
const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

// router.get('/restaurants', authenticated, restController.getRestaurants)
// router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
// router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
// router.get('/restaurants/:id', authenticated, restController.getRestaurant)

// router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
// router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// router.post('/like/:restaurantId', authenticated, userController.addLike)
// router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// router.post('/following/:userId', authenticated, userController.addFollowing)
// router.delete('/following/:userId', authenticated, userController.removeFollowing)

// router.post('/comments', authenticated, commentController.postComment)
// router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
// router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
// router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)


module.exports = router