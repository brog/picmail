picmail
=============
Picmail is a node application that will search a local folder on your computer and find a picture that took pace closest to this day of the year. Once a photo is found it will then email this picture to you and store this photo in a database as to not keep sending the same picture over and over.

setup
-------------------
This uses nodejs to run locally and will then schedule the next email 24 hours after it is started.  The database used in postgres and can be configured via the config.js file.  Copy the sample.config.js file to the same folder and enter your values.  You will need an external email service (gmail works fine).
	{
		service: 'Gmail'
		, username: 'email@gmail.com'
		, password: 'password'
		, from: 'Email-a-day <donotreply@domain.com>'
	};

Ensure node and npm are installed then:
	npm install
	node process.js


future
-------------------
The application was designed to be expanded upon which is why the user model way more robust (complicated) than it needs to be at this time.  It uses a ORM (Sequelize) and will create a single user in the users table, obviously a bit overkill.  


License
-------
	Copyright (C) 2014 Brian Rogers.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.