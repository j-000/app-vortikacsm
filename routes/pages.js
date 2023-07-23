const express = require('express');
const { AuthRequired } = require('../middlewares/authentication');
const pageRoutes = express.Router()


// pageRoutes.route('/')


pageRoutes.get('/login', (req, res) => {
    if (req.cookies.token) return res.redirect('/')
    res.render('login.html');
})


pageRoutes.get('/logout', (req, res) => {
    if (req.cookies.token) {
        res.clearCookie('token');
    }
    return res.redirect('/login');
})


pageRoutes.get('/register',(req, res) => {
    res.render('register.html');
})


pageRoutes.get('/forgot-password',(req, res) => {
    res.render('forgot-password.html');
})


pageRoutes.get('/', AuthRequired, (req, res) => {
    res.render('dashboard.html')
})


pageRoutes.get('/feeds', AuthRequired, (req, res) => {
    res.render('feeds.html');
})


pageRoutes.get('/feeds/:feedid', AuthRequired, (req, res) => {
    res.render('feeds_details.html', {feedid: req.params.feedid});
})


module.exports = {
    pageRoutes
}