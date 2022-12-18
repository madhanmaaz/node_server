const express = require('express')
const route = express.Router()
const { LocalStorage } = require('node-localstorage')
const localstorage = new LocalStorage('./ssd')

route.get('/', (req, res) => {
    if (req.cookies.token != undefined) {
        if (req.cookies.token.length == 44) {
            res.render('index')
        } else {
            res.redirect('/form/login')
        }
    } else {
        res.redirect('/form/login')
    }
})

route.get('/settings', (req, res) => {
    if (req.cookies.token != undefined) {
        if (req.cookies.token.length == 44) {
            let getData = JSON.parse(localstorage.getItem('config.json'))
            res.render('settings', getData)
        } else {
            res.redirect('/form/login')
        }
    } else {
        res.redirect('/form/login')
    }
})

route.get('/change-settings', (req, res) => {
    let data = JSON.parse(req.query.data)
    let getData = JSON.parse(localstorage.getItem('config.json'))

    if (data.type == 'change-password') {
        if (getData.password == data.pass1) {
            getData.password = data.pass2

            res.send({ res: "password changed" })
        } else {
            res.send({ res: "old password error" })
        }

    } else if (data.type == 'change-start-up') {
        getData.startup = data.value
        localstorage.setItem('config.json', JSON.stringify(getData, null, 4))
        res.send({ res: `startup ${data.value}` })

    } else if (data.type == 'ex-visible') {
        getData.exvisible = data.value
        localstorage.setItem('config.json', JSON.stringify(getData, null, 4))
        res.send({ res: `ex visible ${data.value}` })

    } else if (data.type == 'ex-upload') {
        getData.exupload = data.value
        localstorage.setItem('config.json', JSON.stringify(getData, null, 4))
        res.send({ res: `ex upload ${data.value}` })

    } else if (data.type == 'change-path') {
        getData.expath = data.value
        localstorage.setItem('config.json', JSON.stringify(getData, null, 4))
        res.send({ res: `ex path ${data.value}` })

    }

})

route.get('/explorer-upload', (req, res) => {
    let getData = JSON.parse(localstorage.getItem('config.json'))
    let response = req.query.res
    if (getData.exupload == 'on') {
        res.render('ex-upload', {
            res: response
        })
    } else {
        res.send("<h1>Explorer upload is Off.</h1>")
    }
}).post('/explorer-upload', (req, res) => {
    if (req.files) {
        let files = req.files['files']
        if (files.length == undefined) {
            saveFile(files, res)
        } else {
            for(let file of files){
                saveFile(file, res)
            }
        }
    } else{
       res.redirect('/explorer-upload?res=File Not Found.')
    }

    res.redirect('/explorer-upload?res=Upload Success.')
})

function saveFile(file, res) {
    try{
        let getData = JSON.parse(localstorage.getItem('config.json'))
        
        file.mv(`${getData.depath}/Uploads/${file.name}`, (err) => {
            if(err){
                console.log(err)
                res.redirect("/explorer-upload?res=File Upload Error.")
            }
        })
    } catch(err){
        if(err){
            console.log("File upload Err", err)
            res.redirect("/explorer-upload?res=Error")
        }
    }
}

module.exports = route