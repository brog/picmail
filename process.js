
var config = require('./config')
  , db = require('./models')
  , User = db.user
  , SentPic = db.sentpicture
  , logger = require('log4js').getLogger()
  , emailHelper = require('./emailHelper')
  , processor = require('./findpic').ImageProcessor;


function randomArrayElement(arr) {
  var l = Math.floor(Math.random() * arr.length);
  return arr[l];
};

function setupUser(cb){
  User.findOrCreate({email: config.user.email}, {
    password: '123456',//obviously this will change if more than 1 user is supported
    first_name: config.user.first,
    last_name: config.user.last,
  })
  .complete(function(err, user){
    if(err){
      logger.error(err);
    }else{
      if(cb){
        cb(user);
      }
    }
  });
}

function handleImageFound(_img){
  var singleImage = randomArrayElement(_img.images)
    , date = singleImage.date
    , aPath = singleImage.path.split('/')
    , fileName = aPath[aPath.length-1];

  SentPic.create({
    path: singleImage.path,
    file_name: fileName,
    date_taken: singleImage.date,
    userId: 1
  });

  emailHelper.sendMail(config.user.email, 'Photo of the day', 'This photo was taken on '+date, null, singleImage.image);
}

function doProcessing(){
  var imgProcessor = new processor(config.folder, handleImageFound);

  setupUser(function(user) {

    user.getSentpictures().complete(function(err, pics){
      logger.info('previous pics ', pics.length)
      var prevouslySent = [];
      for(var xx in pics){
        prevouslySent.push(pics[xx].path);
      }

      imgProcessor.doProcess(prevouslySent);

    });

  });
}
  
//models / orm stuff
db.sequelize
  .sync()
  .complete(function(err) {
    if (err) {
      logger.error(err)
      throw err
    } else {
      doProcessing();
      setInterval(function(){
        doProcessing();
      }, 86400000);//1000*60*60*24 86400000
    }
  });
