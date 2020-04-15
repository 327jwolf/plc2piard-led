const express = require('express');
const router = express.Router();
const leddata = require('../models/leddataschema.js');
const fetch = require('node-fetch');
const btoa = require('btoa');
const bodyParser = require('body-parser');
const path = require('path');
//const Promise = require('bluebird')
const fs = require('fs')
//const fsPromise = Promise.promisifyAll(fs)
const config = require('../config/appconfig.js').sysconfig;
const configPLC = require('../config/appconfig.js').configPLC;
const getPLCInfo = require('../middleware/getPLCInfo.js');
const writeOmron = require('../middleware/node-omron-fins-master/getomroninfo.js').writeOmron;
let plcType = config.machineType;
console.log('plcType: ', plcType)
// if (plcType == "ML") {
// 	const getPLCInfo = require('../middleware/getPLCInfo.js');
// 	// const translate2serial = require('../middleware/translate2serial.js');
// }
// if (plcType == "Omron") {
// 	const writeOmron = require('../middleware/node-omron-fins-master/getomroninfo.js').writeOmron;
// }


/* GET home page. */
router.get('/', function (req, res, next) {
	
	leddata.getAll(req, res, function(err, x) {
		let allData =  x
		//console.log(x)
	
		res.render('index', { 
			title: 'LED Controller',
			allData: allData,
			editBtns: true 
		});
	})
})

// const configPLC = {
// 	plcAddr : ['N31:60', 'N31:61'],
// 	port : 8315,
// 	plcHost : '66.76.108.43'

// 	};

router.post('/pdata', function(req, res, next) {
	let data = parseInt(req.body.d, 10);
	// console.log(`Data from test button is ${data}`);
	if (plcType == "Omron") {
		writeOmron(data, (val, err)=>{
			console.log('We made it here Omron');
			if (err) {
				console.log("Write Error ", err)
			}
			if (val) {
				console.log(val);
			}
		})
		res.sendStatus(200);
	} 
	else if (plcType == "ML") {
		getPLCInfo('write', configPLC, [0, data], null);
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}

});


router.post('/newEntry', function(req, res, next) {

		leddata.newEntry(req, res, function(err, data){
			if (err ) {
				//console.log(req)
			}
			leddata.getAll(req, res, function(error, x) {
				let allData =  x
				res.render('index', { 
					title: 'LED Controller',
					result: data ? data : "",
					message: err ? err : "Successfully added new record",
					id: data ?data._id : req.body._id,
					plcFunction: data ? data.plcFunction : req.body.plcFunction,
					color: data ? data.color :  req.body.color,//`[[${data.color1}],[${data.color2}],[${data.color3}]]`,
					outputType: data ? data.outputType.toLowerCase() 
						: req.body.outputType.toLowerCase(),
					timing: data ? data.timing : req.body.timing,
					allData: allData,
					editBtns: true
				})
			})	
		})
});

router.get('/getAll', function(req, res, next) {
	leddata.getAll(req, res, function(err, data){
		res.send(data);
	})
});

router.post('/del', function(req, res, next) {
	let reqBody = req.body

	leddata.delEntry(req, res, function(data){
		result = JSON.stringify(data);
		//return(result);
		//res.send(`result= ${result}....`)
		res.redirect('/')
	})		
});

router.post('/edit', function(req, res, next) {
	//console.log(req.body)
	leddata.findEntry(req, res, function(data){
		result = JSON.stringify(data);
		//console.log(result)
		// res.send(`done adding - ${result}`);
		res.redirect('/')
	})		
		
});



module.exports = router;
