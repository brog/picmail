"use strict";

var moment = require('moment')
  , fs = require('fs')
  , exIfUtil = require('./exIfUtil')
  , ExifImage = require('exif').ExifImage
  , logger = require('log4js').getLogger()
  , walk = require('walk');

function getImageForDate(_date, _images){
  for (var ii = 0; ii < _images.length; ii++) {
    var imgData = _images[ii];
    if(imgData.key == _date){
      return imgData;
    }
  }
}

function getIndexForDate(_date, _images){

  var ii = 0
    , len = _images.length
    , prevDate;
  for (; ii < len; ii++) {
    if(_images[ii].key == _date){
      return ii;
    }else if(prevDate != null && prevDate < _date && _images[ii].key > _date){

      var year = '2014-' //just need a year for proper date format
        , previous = moment(year+_date).diff(year+prevDate)
        , next = moment(year+_images[ii].key).diff(year+_date);

      //compare which date is closest to today
      if(previous > next){
        return ii;
      }else{
        return ii-1;
      }
      
      return ii;
    }
    prevDate = _images[ii].key;
  }

  return null;
}



//TODO: store what was send last to not repeat it
  //tweet automatically to Twitter or Instagram?
exports.ImageProcessor = function(_folder, _callback){
  var picturesFolder = _folder
    , reJPG = /.jpe?g$/i
    , today = moment().format('MM-DD')
    , images = []
    , ignoreFiles = [];

  function Image(_img, _date, _path){
    this.image = _img;
    this.date = _date;
    this.path = _path;
  }

  function addImage(_date, _img, _exif, _path){
    var image = getImageForDate(_date, images)
      , fullDate = exIfUtil.formatExifDate( exIfUtil.getPictureDate(_exif) )
      , oImg = new Image(_img, fullDate, _path);
    //check if date exists
    if(image){
      image.images.push(oImg);
    }else{
      images.push({key: _date, images: [oImg]});  
    }
    //console.log(_exif);
  }

  function sortImages(){

    images.sort(function(a, b) {
      if (a.key && b.key && a.key > b.key)
         return 1;
      if (a.key && b.key && a.key < b.key)
         return -1;
      // a must be equal to b
      return 0;

    });
    
  }

  function getClosestDay(){
    var todaysImages = getImageForDate(today, images)
      , len = images.length
      , idx
      , offset = 1;

    //check for exact match
    if(todaysImages){
      return todaysImages;
    }

    //find next closest
    idx = getIndexForDate(today, images);

    if(idx){
      return images[idx];

    }

    return null;
  }

  function handleEnd(xx){
    console.log('this is the end');

    logger.info("------------------------------------------------------------");

    sortImages();

    logger.info('today ', today);
    var todaysImages = getClosestDay();
    
    //TODO: get random image
    logger.info('the image ', todaysImages);

    

    logger.info("all done");

    _callback(todaysImages);
  }

  function handleOnFile(root, fileStats, next){

      //logger.info('fileStats', fileStats);
      var name = fileStats.name
        , path = root+'/'+fileStats.name;

      if(reJPG.test(name) && ignoreFiles.indexOf(path) == -1){
        fs.readFile(path, {}, function (err, data) {
          try {
              new ExifImage({ image : data }, function (error, exifData) {

                if (error) {
                  logger.error('Error: '+error.message);
                } else {
                  //logger.debug(exifData);
                  var date = exIfUtil.getPictureDateWithoutYear(exifData.exif); 
                  //logger.debug(date);
                  if(date){
                    addImage(date, data, exifData.exif, root+'/'+fileStats.name);

                    //logger.info('date', date); // Do something with your data!
                  }

                  next();
                }
              });
          } catch (error) {
              logger.error('Error in exif: ' + error.message);

              next();
          }

        });
      }else{
        next();  
      }
  }

  function processFolder(_folder, _onFile, _onEnd) {
    //console.log('_folder '+_folder)

    var options = {
          followLinks: false
          // directories with these keys will be skipped
          , filters: ["Temp", "_Temp"]
        }
      , walker;

    walker = walk.walk(_folder, options);
   
    walker.on("file", _onFile);

    walker.on("errors", function (root, nodeStatsArray, next) {
      logger.error('error ', nodeStatsArray)
      next();
    });

    walker.on("end", _onEnd);
  }


  this.doProcess = function(_previouslySent){
    
    if(_previouslySent){
      ignoreFiles = _previouslySent
    }

    processFolder(picturesFolder, handleOnFile, handleEnd);  
  }
  
}

//expose for testing statically
exports.__getImageForDate = getImageForDate;
exports.__getIndexForDate = getIndexForDate;
