/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('organization', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    belongs: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'organization'
  });
};
