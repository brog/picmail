var   assert = require("assert")
    , findPics = require('../findpic');

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

describe('findpicsTest', function(){

  describe('#instance()', function(){

    it('findNoFolder', function(done){
      var imgProcessor = new findPics.ImageProcessor('/thisdoesnotexist/', function(_img){
        assert.equal(_img, null);
        done();
      });

      imgProcessor.doProcess();
    });

    it('findFolder', function(done){
      var imgProcessor = new findPics.ImageProcessor(__dirname+'/samplepics/', function(_img){
        
        assert.notEqual(null, _img);
        assert.notEqual(null, _img.images[0].date);
        //all test images are different days
        assert.equal(_img.images.length, 1);
        //we have a valid key format
        assert.equal(_img.key.length, 5);

        done();
      });

      imgProcessor.doProcess();
    });

  });

  describe('#getImageForDate()', function(){

    it('getImageByKey', function(done){
      var mockImages = [{key: '01-01', images: [], date: new Date}]


       //assert.equal(email, user.email);
       //assert.notEqual(password, user.password);

      assert.equal(findPics.__getImageForDate('01-01', mockImages), mockImages[0]);
      
      done();

    });

  });

  describe('#getIndexForDate()', function(){

    it('findFirst', function(done){
      var mockImages = [
      	{key: '01-01', images: [], date: new Date},
      	{key: '01-11', images: [], date: new Date},
      	{key: '01-15', images: [], date: new Date}
      ];

      assert.equal(findPics.__getIndexForDate('01-02', mockImages), 0);
      
      done();

    });


    it('findSecond', function(done){
      var mockImages = [
      	{key: '01-01', images: [], date: new Date},
      	{key: '01-11', images: [], date: new Date},
      	{key: '01-15', images: [], date: new Date}
      ];

      assert.equal(findPics.__getIndexForDate('01-14', mockImages), 2);
      
      done();

    });

    it('single', function(done){
      var mockImages = [
      	{key: '01-01', images: [], date: new Date}
      ];

      assert.equal(findPics.__getIndexForDate('11-02', mockImages), null);
      
      done();

    });


    it('empty', function(done){
      var mockImages = [];

      assert.equal(findPics.__getIndexForDate('01-02', mockImages), null);
      
      done();

    });

  });

});