const express = require('express');
const { AuthRequired } = require('../middlewares/authentication');
const pageRoutes = express.Router()


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


pageRoutes.get('/users', AuthRequired, (req, res) => {
    res.render('users.html');
})


pageRoutes.get('/jobs', AuthRequired, (req, res) => {
    res.render('jobs.html');
})


pageRoutes.get('/cms/templates/edit/basic-details-page', AuthRequired, (req, res) => {
    res.render('cms/basicdetailspage.html');
})


pageRoutes.get('/cms/templates/edit/advanced-details-page', AuthRequired, (req, res) => {
    res.render('cms/advanceddetailspage.html');
})


pageRoutes.get('/cms/templates/edit/search-results-page', AuthRequired, (req, res) => {
    res.render('cms/searchresultspage.html');
})


pageRoutes.get('/cms/publish/preview', AuthRequired, (req, res) => {
    res.render('cms/publishpreview.html');
})


pageRoutes.get('/cms/publish/live', AuthRequired, (req, res) => {
    res.render('cms/publishlive.html');
})


pageRoutes.get('/*', (req, res) => {
    res.redirect('/login')
})

module.exports = {
    pageRoutes
}