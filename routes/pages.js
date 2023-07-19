const express = require('express');
const { jwtrequired } = require('../middlewares/authentication');
const pageRoutes = express.Router()


pageRoutes.get('/login', (req, res) => {
    res.render('login.html');
})


pageRoutes.get('/register',(req, res) => {
    res.render('register.html');
})


pageRoutes.get('/', jwtrequired, (req, res) => {
    res.render('index.html', )
})

pageRoutes.get('/feeds', jwtrequired, (req, res) => {
    res.render('feeds.html');
})


module.exports = {
    pageRoutes
}