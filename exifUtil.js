"use strict";

(function(exports) {
    
  exports.getPictureDate = function(exif){
    return exif.DateTimeOriginal || exif.CreateDate;
  }

  /** @returns month and day in MM-DD format*/
  exports.getPictureDateWithoutYear = function(exif){
    var rawDate = this.getPictureDate(exif),
      date = rawDate ? rawDate.split(' ')[0] : null;

      if(date){
        var arrDateParts = date.split(':');
        if(arrDateParts.length == 3){
          arrDateParts.splice(0,1);
          return arrDateParts.join('-');


        }
      }

      return null;
  }

  exports.formatExifDate = function(_date){
    var arrDates = _date.split(' ')
      , time = (arrDates.length > 0) ? arrDates[1] : '';

    return new Date( arrDates[0].replace(/:/g, '-') + ' ' + time);
  }

}(typeof exports === "undefined"
    ? (this.moduleName = {})
    : exports));