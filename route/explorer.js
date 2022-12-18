const express = require('express')
const route = express.Router()
const fs = require('fs')
const { LocalStorage } = require('node-localstorage')
const localstorage = new LocalStorage('./ssd')

// http://localhost:10110/explorer/
route.get('/*', (req, res) => {
    let getData = JSON.parse(localstorage.getItem('config.json'))
    let exPath = getData.expath
    if (exPath.slice(-1) == '\\') {
        exPath = exPath.slice(0, -1)
    }
    let path = decodeURI(req.url)
    let urlPath = `/explorer${path}`
    let realPath = `${exPath}${path}`
    // checking file or folder to execute
    if (getData.exvisible == 'on') {
        let currentFile = fs.statSync(realPath)
        if (currentFile.isFile()) {
            res.sendFile(realPath)
        } else {
            readFiles({
                urlPath: urlPath,
                realPath: realPath
            }, res)
        }
    } else{
        res.render('explorer', {
            data: "<h2>Explorer is off</h2>",
            path: ""
        })
    }
})

function readFiles(location, res) {
    try {
        let realPath = location.realPath
        let urlPath = location.urlPath

        // checking slash
        if (realPath.slice(-1) != '/') {
            realPath = realPath + "/"
        }
        if (urlPath.slice(-1) != '/') {
            urlPath = urlPath + "/"
        }

        // read path extracting files and folders
        let allFiles = ''
        let allFolders = ''
        let filesArray = fs.readdirSync(realPath)

        if (filesArray.length == 0) {
            res.render('explorer', {
                data: '<h2>No Files.</h2>',
                path: urlPath
            })
        } else {
            filesArray.map(item => {
                return {
                    itemNmame: item,
                    urlPath: `${urlPath}${item}`,
                    realPath: `${realPath}${item}`
                }
            }).map(files => {
                //clearing unwanted files and folders
                if (files.realPath.endsWith('swapfile.sys')
                    || files.realPath.endsWith('System Volume Information')
                    || files.realPath.endsWith('hiberfil.sys')
                    || files.realPath.endsWith('pagefile.sys')
                    || files.realPath.endsWith('PerfLogs')
                    || files.realPath.endsWith('Recovery')
                    || files.realPath.endsWith("desktop.ini")
                    || files.realPath.endsWith("$RECYCLE.BIN")
                    || files.realPath.endsWith("$Recycle.Bin")
                    || files.realPath.endsWith("Documents and Settings")
                ) {
                    // nothing to do
                } else {
                    let getFileType = fs.statSync(files.realPath)

                    if (getFileType.isFile()) {
                        allFiles +=
                            `<a href="${files.urlPath}" class="item file">
                        <i class="so so-file"></i>
                        ${files.itemNmame}
                    </a>`
                    } else {
                        allFolders +=
                            `<a href="${files.urlPath}" class="item folder">
                        <i class="so so-folder"></i>
                        ${files.itemNmame}
                    </a>`
                    }
                }
            })
        }

        res.render('explorer', {
            data: allFolders + allFiles,
            path: urlPath
        })
    } catch (err) {
        res.send("<h1>ERROR: Go Back<h1>")
    }
}


module.exports = route