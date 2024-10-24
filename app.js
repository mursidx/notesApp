const express = require('express')
const app = express();
const mongooseConnection = require('./config/mongoose')
const postModel = require('./models/post')
const userModel = require('./models/user')
const path = require('path')
const bcrypt = require('bcryptjs');
const session = require('express-session')

//set up debigging
require('dotenv').config();
const debuglog = require('debug')('development:app');

//test run
debuglog('App is running :)')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

// Session middleware
app.use(session({
    secret: 'your-secret-key',  // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // Set secure to true if you're using HTTPS
}));

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();  // User is authenticated, allow access to the route
    }
    res.redirect('/login');  // If not authenticated, redirect to the login page
}

//routes 
app.get('/create', isAuthenticated, function (req, res) {
    res.render('create');
});

app.post('/create', isAuthenticated, async function (req, res) {
    const { title, note } = req.body;
    const userId = req.session.user._id;  // Get the logged-in user's ID

    // Create a new note
    const post = await postModel.create({ title, note, user: userId });

    // Add the created post ID to the user's posts array
    await userModel.findByIdAndUpdate(userId, { $push: { posts: post._id } });

    res.redirect('/');
});

app.get('/', isAuthenticated, async function (req, res) {
    const userId = req.session.user._id;  // Get the logged-in user's ID

    // Find the user and populate the posts they have created
    const user = await userModel.findById(userId).populate('posts');

    res.render('index', { notes: user.posts , user});
});

app.get('/edit/:title', isAuthenticated, async function (req, res) {
    const post = await postModel.findOne({ title: req.params.title });

    res.render('edit', { data: post, title: req.params.title });
});

app.post('/update/:title', isAuthenticated, async (req, res) => {
    const { note } = req.body;
    const { title } = req.params;

    const updatedPost = await postModel.findOneAndUpdate({ title: title }, { note: note }, { new: true });
    res.redirect('/');
});

app.get('/delete/:title', isAuthenticated, async (req, res) => {
    await postModel.findOneAndDelete({ title: req.params.title })
    res.redirect('/')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', async (req, res) => {
    let { username, email, password } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await userModel.create({ username, email, password: hashedPassword });

    // Automatically log the user in by storing their info in the session
    req.session.user = user;

    // Redirect to the homepage (or any other protected route)
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user in the database by username
    const user = await userModel.findOne({ username });

    if (!user) {
        return res.status(400).send('Invalid username or password');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).send('Invalid username or password');
    }

    // Store user information in the session
    req.session.user = user;

    // Authentication successful, redirect to homepage
    res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});

app.listen(3000)

