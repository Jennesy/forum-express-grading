const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email
    let password = req.body.password
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    })
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      // confirm unique user
      User.findOne({ where: { email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },
  getUser: (req, res) => {
    if (req.user.id !== Number(req.params.id)) {
      return res.json({ status: 'error', message: '' })
    }
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [{ model: Restaurant, attributes: ['id', 'image'] }] },
        { model: Restaurant, as: 'FavoritedRestaurants', attributes: ['id', 'image'] },
        { model: User, as: 'Followings', attributes: ['id', 'image'] },
        { model: User, as: 'Followers', attributes: ['id', 'image'] }
      ]
    }).then(user => {
      user = {
        ...user.toJSON(),
        CommentedRestaurants: Array.from(new Set(user.toJSON().Comments.map(i => JSON.stringify(i.Restaurant)))).map(i => JSON.parse(i))
      }
      return res.json({ user })
    })
  },
  putUser: (req, res) => {
    //prevent access to other user profile
    if (req.user.id !== Number(req.params.id)) {
      return res.json({ status: 'error', message: '' })
    }
    if (!req.body.name) {
      return res.json({ status: 'error', message: "name didn't exist" })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
              .then((user) => {
                return res.json({ status: 'success', message: "user was successfully to update" })
              })
          })
      })
    }
    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          })
            .then((user) => {
              return res.json({ status: 'success', message: "user was successfully to update" })
            })
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.json({ status: 'success', message: "restaurant was successfully added to favorite" })
      })
  }
}

module.exports = userController