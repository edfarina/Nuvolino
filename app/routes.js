// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/mainpage', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");
            
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
    
    app.get('/mainpage', isLoggedIn, function (req, res) {
        console.log(req.user)
        // app.use(express.static(path.join(__dirname, 'public')));
                app.engine('html', require('ejs').renderFile);
                res.render(__dirname + '/../public/mainpage.html', {
            user : req.user // get the user out of session and pass to template
        });
    // return res.sendFile(__dirname + '/../public/mainpage.html');
    // return res.sendFile(path.resolve(__dirname + '/../public/mainpage.html'), function(err){
    // if (err) {
    //     console.log(err);
    //     res.status(err.status).end();
    // } else {
    //
    // }
    // });
    });
    
    app.get('/api/authenticate', function(req, res){	
    res.status(200).send()
    });
    
    
    app.post('/api/GetLastEntry', function (req, res) {
        oracle_call.GetLastEntry(req, res, function(err, result){
            if (err){
                console.log("in /api/GetLastEntry: " + err);
                res.status(500).send(err.message);
            } else {
            	resu=result.results;
                res.status(200).send( {"message":"XX", resu});

		}
        });
    });
    
    app.post('/api/HistoryDataNuvola', function (req, res) {
        oracle_call.HistoryDataNuvola(req, res, function(err, result){
            if (err){
                console.log("in /api/HistoryDataNuvola: " + err);
                res.status(500).send(err.message);
            } else {
            	resu=result.results;
                res.status(200).send( {"message":"XX", resu});

		}
        });
    });
    
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
