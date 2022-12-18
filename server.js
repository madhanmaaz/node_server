const express = require('express')
const app = express()
const server = require('http').createServer(app)
const fs = require('fs')
const os = require('os')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const { LocalStorage } = require('node-localstorage')
const localstorage = new LocalStorage('./ssd')

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload())
app.set('view engine', 'ejs')

app.use('/', require('./route/index'))
app.use('/form', require('./route/authen'))
app.use('/explorer', require('./route/explorer'))

let docFolder = `${os.homedir()}\\Documents\\Frozen Server`
if (fs.existsSync(docFolder) == false) {
    let getData = JSON.parse(localstorage.getItem('config.json'))
    getData['expath'] = docFolder
    getData['depath'] = docFolder

    localstorage.setItem('config.json', JSON.stringify(getData, null, 4))
    fs.mkdir(docFolder, (err) => {
        if (err) {
            console.log(err)
        } else {
            let folders = ['Documents', 'Music', 'Pictures', 'Videos', 'Uploads']
            for (let i = 0; i < folders.length; i++) {
                fs.mkdirSync(`${docFolder}\\${folders[i]}`)
            }
        }
    })
}

let getData = JSON.parse(localstorage.getItem('config.json'))
if(getData.startup == 'off'){
    process.exit()
}

// server close
let logFile = "../../log.log"
app.get('/server-close', (req, res) => {
    res.send('<h1>server Power offing.....</h1>')
    fs.appendFileSync(logFile, `\n[${Date().slice(0, 24)}] server closing`)
    process.exit()
})

const port = 10110 || process.env.PORT
server.listen(port, () => {
    console.log(port)
    fs.appendFile(logFile, `\n[${Date().slice(0, 24)}] node_server listening at port ${port}`, (err) => {
        if (err) {
            console.log(err)
        }
    })
})