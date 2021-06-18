const restController = require('../controllers/restController')
module.exports = (app) => {
  app.get('/restaurants', restController.getRestaurants)
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
}
