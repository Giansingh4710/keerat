const fs = require('fs')
const path = require('path')

function writeObjectToFile(obj, filePath) {
  fs.writeFileSync(filePath, 'const ALL_OPTS = ')

  const jsonString = JSON.stringify(obj, null, 2)
  fs.appendFileSync(filePath, jsonString)

  fs.appendFileSync(filePath, '\n\nmodule.exports = { ALL_OPTS };')
}

function readAllOptsInFolders(currentPath) {
  const folders = fs.readdirSync(currentPath, { withFileTypes: true })

  const resultObject = {}

  folders.forEach((folder) => {
    if (folder.isDirectory()) {
      const folderPath = path.join(currentPath, folder.name)
      if (folderPath == __dirname) return // not this folder

      const pageFilePath = path.join(folderPath, 'TRACKS.js')
      if (fs.existsSync(pageFilePath)) {
        const pageFileContent = require(pageFilePath)
        if (pageFileContent && pageFileContent.ALL_OPTS) {
          Object.assign(resultObject, pageFileContent.ALL_OPTS)
        }
      }
    }
  })

  return resultObject
}

const rootDirectory = __dirname
const mergedOpts = readAllOptsInFolders(path.join(rootDirectory, '..'))

const outputFile = path.join(rootDirectory, 'TRACKS.js')
writeObjectToFile(mergedOpts, outputFile)
console.log(`Object written to ${outputFile}`)
