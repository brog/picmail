var   assert = require("assert")
    , exifUtil = require('../exifUtil');

/*
AssertionError
fail
ok
equal
notEqual
deepEqual
notDeepEqual
strictEqual
notStrictEqual
throws
doesNotThrow
ifError
*/

describe('exIf', function(){

  describe('#getPictureDate()', function(){

    it('getsDateTimeOriginal', function(done){
      var mockExifData = {
      	DateTimeOriginal : '2014:03:02 17:47:16',
      	CreateDate: '2014:03:02 17:47:16'
      }

       //assert.equal(email, user.email);
       //assert.notEqual(password, user.password);

      assert.equal(exifUtil.getPictureDate(mockExifData), mockExifData.DateTimeOriginal);
      
      done();

    });

    it('orCreateDate', function(done){
      var mockExifData = {
      	DateTimeOriginal : null,
      	CreateDate: '2014:03:02 17:47:16'
      }

       //assert.equal(email, user.email);
       //assert.notEqual(password, user.password);

      assert.equal(exifUtil.getPictureDate(mockExifData), mockExifData.CreateDate);

      done();

    });

    it('bothNull', function(done){
      var mockExifData = {};

      assert.equal(exifUtil.getPictureDate(mockExifData), null);

      done();

    });


  })

  describe('#getPictureDateWithoutYear()', function(){
  	it('getMonthDay', function(done){
      var mockExifData = {
      	DateTimeOriginal : '2014:03:02 17:47:16',
      	CreateDate: '2014:01:02 17:47:16'
      }

  	  assert.equal(exifUtil.getPictureDateWithoutYear(mockExifData), '03-02');

	  done();

  	});

  	it('getMonthDayCreateDate', function(done){
      var mockExifData = {
      	CreateDate: '2014:01:02 17:47:16'
      }

  	  assert.equal(exifUtil.getPictureDateWithoutYear(mockExifData), '01-02');

	  done();

  	});
  });

});



