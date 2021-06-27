'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Followship.init({
    FollowerId: DataTypes.INTEGER,
    FollowingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
  });
  return Followship;
};