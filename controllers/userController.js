const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    //prevent access to other user profile
    if (req.user.id !== Number(req.params.id)) {
      return res.redirect(`/users/${req.user.id}`)
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
      return res.render('profile', { user })
    })
  },
  editUser: (req, res) => {
    //prevent access to other user profile
    if (req.user.id !== Number(req.params.id)) {
      return res.redirect(`/users/${req.user.id}`)
    }
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('edit', { user: user.toJSON() })
      })
  },
  putUser: (req, res) => {
    //prevent access to other user profile
    if (req.user.id !== Number(req.params.id)) {
      return res.redirect(`/users/${req.user.id}`)
    }
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
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
                req.flash('success_messages', 'user was successfully to update')
                res.redirect(`/users/${user.id}`)
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
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${user.id}`)
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
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      return favorite.destroy().then(favorite => {
        return res.redirect('back')
      })
    })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      return like.destroy().then(like => {
        return res.redirect('back')
      })
    })
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [{ model: User, as: "Followers" }]
    }).then(users => {
      users = users.map(user =>
      ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController