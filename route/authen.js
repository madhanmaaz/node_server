const express = require('express')
const route = express.Router()
const { LocalStorage } = require('node-localstorage')
const localstorage = new LocalStorage('./ssd')

route.get('/login', (req, res) => {
    if (req.cookies.token == undefined) {
        res.render('login')
    } else {
        res.redirect('/')
    }
}).post('/login', (req, res) => {
    let { username, password } = req.body
    let getData = JSON.parse(localstorage.getItem('config.json'))

    if (getData.username == username && getData.password == password) {
        res.cookie('token', "0R8kkEytaWtavrm@^CHTKTt1WgU9$I11DaAr$M@%Oy^Q", { maxAge: 100000000 * 10000000 })
        res.redirect('/')
    } else {
        res.send('<h1>Username or password error</h1>')
    }
})


module.exports = route