/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attendee', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    eid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    attended: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    paragraph: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    bible: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    connected: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    grade: {
        type: DataTypes.INTEGER(1),
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
    tableName: 'attendee'
  });
};
