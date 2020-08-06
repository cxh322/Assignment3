/*
https://floating-hamlet-06670.herokuapp.com/ 

https://github.com/cxh322/a2

*/

const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let customerSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    fname: String,
    lname: String
});

let customers;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("mongodb+srv://WEB322:nimasile@cluster0-hd4jp.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });
    db.on('error', (err)=>{
    reject(err);
    });

    db.once('open', ()=>{

    customers = db.model("customers", customerSchema);

    resolve();
    });
    });
   }; 

module.exports.registerUser = function(inData){
    return new Promise(function (resolve, reject) {
        if(inData.password != inData.password1){
            console.log("Passwords do not match");
        }
        else{
            bcrypt.genSalt(10, function(err, salt) { 
            bcrypt.hash(inData.password, salt, function(err, hash) { 
                if(err){
                  console.log("There was an error encrypting the password")
                }
        else {
            inData.password = hash;
            let newcustomer = new customers(inData);
            newcustomer.save(() => {
            if(err){
                console.log("err: "+err);
                reject();    
            }
        else{
            resolve(inData);
        }
    })}
})
})}     
})}


module.exports.validateUser = function(data) {
    return new Promise(function (resolve, reject) {
        customers.find({
            email: data.email
        }).exec()
            .then((customer) => {
                if(!data){
                    reject();
                    data.message ="Incorrect Password";
                }
                else{
                    bcrypt.compare(data.password, customer[0].password).then((res) => {
                        if(res===true){
                            customers.update(
                                { email: customer[0].email },
                                { $set: {login: true }},
                            ).exec()
                            .then((() => {
                                resolve(customer[0]);
                            })).catch((err) => {
                                console.log("Incorrect user: " + err)
                            })} 
                            else
                            console.log("Incorrect Password for user: "+data.email)
                    })}
            }).catch(() => {
                console.log("Cannot find user: "+data.email)
        })
    })
}
