const path = require('path')
const express = require('express')

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'dist/index.html')

app.use(express.static(path.join(DIST_DIR,'dist')))
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})
const PORT = process.env.PORT || 8002
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
})
