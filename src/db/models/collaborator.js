'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,

    }, 
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    
  }, {});
  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'userId'
    });

    Collaborator.belongsTo(models.Wiki, {
      onDelete: 'CASCADE',
      foreignKey: 'wikiId'
    });
  };
  return Collaborator;
};