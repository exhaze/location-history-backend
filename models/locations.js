module.exports = function(sequelize, DataTypes) {
  	return {
	  	model: sequelize.define('locations', 
	  	{
	  		latitude: DataTypes.FLOAT,
	  		longitude: DataTypes.FLOAT,
	  	},
	  	{
	  		freezeTableName: true,
	  		timestamps: true
	    })
	}
}
