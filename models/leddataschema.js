// ./models/leddataschema.js

const Document = require('camo').Document

const connect = require('camo').connect
let database;  
let uri = `nedb:///${__dirname}/`
connect(uri).then(function(db) {  
    database = db;
})

class LedData extends Document {  
    constructor() {
        super();
        this.schema({
            _id: {
            	type: String,
            	unique: true
            },
            plcFunction: String,
            color: [String],
            outputType: String,
            timing: String
         });       

    }
       static collectionName() {
           return 'leddata'
       }

}

module.exports = LedData

module.exports.getItAll = function(){
     return LedData.find({}, {sort: '_id'})
}

module.exports.getAll = function(req, res, callback){
    
    //, {sort: ['date', 'location']}
    let data = LedData.find({}, {sort: '_id'})
        .then((data) => {
            //console.log(`Database == ${(data[0]._id)}`)
            return callback(null, data)
        })
        .catch(e => {
        	console.log(`The ERROR ${e}`)
        	return callback(e, null)
    })
 
}

module.exports.getDBdata = function(plcFun, cb){
   setTimeout(function(){
        LedData.findOne({plcFunction: plcFun}, {populate: true})
        .then((data) => {
           cb(null, data)
        })
        .catch(e => {
            console.log(`The ERROR ${e}`)
            cb(e, null)
        })
    }, 50)
}

    



module.exports.delEntry = function(req, res, callback){
    let _id = req.body._id

    //console.log(id)
    LedData.findOneAndDelete({'_id': _id}) // {_id: id}
    .then(x => {
        y = JSON.stringify(x);
        console.log('tried to delete',y);
        callback(y);
        //res.sendStatus(x);
    })
    .catch(e => console.log(`The ERROR ${e}`));
}

module.exports.newEntry = function(req, res, callback){
    let reqData = req.body;

    leddata = LedData.create(reqData);
    leddata.save()
    .then(function(x) {
        callback(null, x);
    })
    .catch(e => {
    	//console.log(e)
    	return callback(e, null)
	});
 
}

function fixString2Array (arg) {
    return JSON.parse(`[${arg}]`)
}

module.exports.findEntry = function(req, res, callback){
    let reqData = req.body;

    // let reqDataFinal = {
    //              "_id": reqData._id,
    //              "plcFunction": reqData.plcFunction,
    //              "color":reqData.color,
    //              "outputType": reqData.outputType,
    //              "timing": reqData.timing
    //              }
    // console.log(reqDataFinal)
    let _id = reqData._id
    
    LedData.findOneAndUpdate({_id: _id}, reqData)
    .then(function(x) {
        callback(x);
    })
    .catch(e => {
    	console.log(e)

    });
 
}