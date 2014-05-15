var passwordHash = require('password-hash')
  USER_LEVEL = {
    ADMIN: 100,
    DEFAULT: 20
  },
  STATUS = {
    DEFAULT: 100,
    BILLING_DISABLED: 75,
    DISABLED: 50,
    DELETED: 0
  };

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(256),
      validate: {
        len: [6,256]
      },
      set: function(value) {
        if(value!=null && value.length > 5 && value.length < 256){
          this.setDataValue('password', passwordHash.generate(value));  
        }else{
          //for validation to fail in case of update (otherwise it would save the old hash)
          this.setDataValue('password', '0000');
        }
        //else return & let validation do it's thing
      }
    },
    first_name: {
      type: DataTypes.STRING(128),
      validate: {
        notNull: true
      }
    },
    last_name: {
      type: DataTypes.STRING(128),
      validate: {
        notNull: true
      }
    },
    login_date: DataTypes.DATE,
    user_level: {
     type: DataTypes.INTEGER,
      defaultValue: USER_LEVEL.DEFAULT
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: STATUS.DEFAULT
    },
    ip: {
      type: DataTypes.STRING,
      validate: {
        // isIP: true
      }
    },
    image_url: {
      type: DataTypes.STRING,
      len: [15, 2048]
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
    //TODO: track failedAttempts: {type: DataTypes.INTEGER}

  }, {
    classMethods: {
      associate: function(models) {
        user.hasMany(models.sentpicture);
      },

      findAdmins: function(companyId, cb) {
        user.count({where: {companyId : companyId, user_level: USER_LEVEL.ADMIN }}).complete(cb);
      }


    },instanceMethods: {
      validPassword: function(password){
        return passwordHash.verify(password, this.password)
      },
      hasPassword: function(){
        return !(this.getDataValue('password') === null)
      },
      hasCompany: function(){
        return this.getDataValue('companyId') != null;
      },
      isSameCompany: function(req){
        return this.getDataValue('companyId') == req.user.companyId;
      },
      isAdmin: function(){
        var compare = function(obj){
          return obj.user_level==USER_LEVEL.ADMIN;
        };

        //doing this in reverse order just to make the code tighter
        if(this.user && 
            this.user.selectedValues != null && 
            this.user.selectedValues.user_level!=null){

          return compare(this.user.selectedValues);
        }
        return compare(this);
      },
      setAdmin: function(){
        this.setDataValue('user_level', USER_LEVEL.ADMIN);
      },
      setNormalUser: function(){
        this.setDataValue('user_level', USER_LEVEL.DEFAULT);
      },
      getName: function(){
        return this.getDataValue('first_name') + ' ' + this.getDataValue('last_name');
      },
      isEnabled: function(){
        return this.getDataValue('status') == STATUS.DEFAULT;
      },
      isDisabled: function(){
        return this.getDataValue('status') == STATUS.DISABLED;
      },

      //@override the serialization to add transient properties
      //https://github.com/sequelize/sequelize/issues/549
      toJSON: function () {
        var json = this.values;

        //ensure user_level attribute is selected for this to work, duh
        json.isAdmin = this.isAdmin();

        return json;
      }

    }
  })
 
  return user
}