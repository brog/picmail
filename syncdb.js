/**
 * Used to update the database and drop the current data!
 */

var db = require('./models');



//models / orm stuff
db.sequelize
  .sync({ force: true })//
  .complete(function(err) {
    if (err) {
      console.log(err)
      throw err
    } else {
    	console.log('Sync complete -- the database has been dropped')
    }
  });


