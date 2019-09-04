/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('members', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    address: {  
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    offrate: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    belong: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    grade: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    organization: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    regdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    baptism: {
        type: DataTypes.INTEGER(20),
        allowNull: true
      },
    tag: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    connected: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'members'
  });
};
