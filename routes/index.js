const express = require('express');
const router = express.Router();
// const fetch = require('node-fetch');
// const btoa = require('btoa');
// const bodyParser = require('body-parser');
// const path = require('path');
// const Promise = require('bluebird')
// const fs = require('fs')
// const fsPromise = Promise.promisifyAll(fs)



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LED Controller' });
});



module.exports = router;
