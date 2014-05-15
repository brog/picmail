"use strict";

(function(exports) {
    
    var emailConfig = require('./config').email
	, nodemailer = require("nodemailer")
	, when = require('when')
	, smtpTransport = nodemailer.createTransport("SMTP",{
      service: emailConfig.service,
      auth: {
        user: emailConfig.username,
        pass: emailConfig.password
      }
    });

    exports.sendMail = function(email, subject, html, from, attachment, callback){
    	var   deferred = when.defer()
    		, mailOptions = {
				from: from || emailConfig.from, // sender address
				to: email, // list of receivers
				subject: subject, // Subject line
				html: html,
				generateTextFromHTML: true,
			};

		if(attachment){
			mailOptions.attachments = [
				{   // binary buffer as an attachment
		            fileName: "image.jpg",
		            contents: attachment
		        }
			];
		}

		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
			  deferred.reject(error);
			  if(callback){
			  	callback(error, response);
			  }
			}else{
			  deferred.resolve(response);
			  if(callback){
			  	callback(null, response);
			  }
			}
			// if you don't want to use this transport object anymore, uncomment following line
			//smtpTransport.close(); // shut down the connection pool, no more messages
		});

		return deferred.promise;
    }

}(typeof exports === "undefined"
    ? (this.moduleName = {})
    : exports));




