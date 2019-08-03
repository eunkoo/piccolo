/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('schedule', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      eid: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      mid: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      time: {
        type: DataTypes.TIME,
        allowNull: true
      },
      duration: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      color: {
          type: DataTypes.STRING(11),
          allowNull: false
      },
      link: {
          type: DataTypes.TEXT,
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
      tableName: 'schedule'
    });
  };
  