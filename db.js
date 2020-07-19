/*
https://floating-hamlet-06670.herokuapp.com/ 

https://github.com/cxh322/a2

This version only completes the connection to the mongoose database

*/
const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let customerSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String
});

let Customers;


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("mongodb+srv://WEB322:nimasile@cluster0-hd4jp.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });
    db.on('error', (err)=>{
    reject(err);
    });

    db.once('open', ()=>{

    Customers = db.model("customers", customerSchema);

    resolve();
    });
    });
   }; 

   module.exports.addCustomer = function (data) {
    return new Promise(function (resolve, reject) {
        
        for (var formEntry in data){
            if(data[formEntry] == "")
            data[formEntry = null];
        }
        var newCustomer = new Customers(data);

        newCustomer.save((err)=>{
            if(err){
                console.log("err: "+err);
                reject();              
            }
            else{
                console.log("Saved: "+data.name);
                resolve();    
            }
        })
    })
}

module.exports.getCustomer = function (data) {
    return new Promise(function (resolve, reject) {
        Customers.find().exec().then((returedCustomers)=>{
            resolve(filteredMongoose(returedCustomers));
        }).catch((err)=>{
            console.log("Err"+err);
            reject(err);
        })
        
    })
}



const filteredMongoose = (arrayOfMongooseDocuments) =>{
    const tempArray = [];
    if(arrayOfMongooseDocuments.length !==0){
        arrayOfMongooseDocuments.forEach(doc =>{
            var tmp = doc.toObject();
            tmp.id = doc._id.toString();
            tempArray.push(tmp);
        })
    }
    return tempArray;
}