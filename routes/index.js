const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
module.exports = (app) => {
  app.get('/restaurants', restController.getRestaurants)
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  app.get('/admin/restaurants', adminController.getRestaurants)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
}
