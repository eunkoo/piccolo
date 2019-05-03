/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('events', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    place: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    day: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    director: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    belongs: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    notice: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    offering: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    totalmember: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    totalmorning: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    totalnoon: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    birthes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    newes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    calendar: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'events'
  });
};
