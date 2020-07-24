const express = require('express');
const app = express();

app.use(express.static('./dist/image-editor'));
app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: 'dist/image-editor/'}
  );
});
app.listen(process.env.PORT || 8080);