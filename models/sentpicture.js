module.exports = function(sequelize, DataTypes) {
  var sentpicture = sequelize.define('sentpicture', {
  	file_name: {
  		type: DataTypes.STRING(255)
  	},
  	path: {
  		type: DataTypes.STRING(4096)	
  	},
  	date_taken: {
  		type: DataTypes.DATE 
  	}
  });
 
  return sentpicture;
}