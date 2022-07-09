// Import the dependencies

import express from 'express';
import bodyPaser from 'body-parser';
import request from 'request';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'node:https';


const app = express();

// In order forthe server to access static files (e.g css stylesheets or images) we have to the static() function
// The files must be in a folder called public

app.use(express.static("public"));

app.use(bodyPaser.urlencoded({extended: true}));

//Create file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/signup.html"))
});

// Post User details

app.post("/", function(req, res){
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userEmail  = req.body.userEmail;

    // Need to send the data from the sign up page to MailChimp Server, using their API.
    // The client data will be sent via this data object

    // From the MaailChimp API Reference (Batch Subscribe and Unsubribe) you can get keys to the object (Members Array, which has an object inside)

    const data = {

        members : [{
            email_address : userEmail,
            status: "subscribed",
             merge_fields : {
                FNAME: firstName,
                LNAME: lastName,
             }
        }]    
    };

    // Now the data object needs to be converted to json format

    const jsonData = JSON.stringify(data)

    const url = "https://us12.api.mailchimp.com/3.0/lists/8f2ad76a5e";

    const options = {
        method: "POST",

        auth: 'mbasa007:b03caf03a17dad0720f8a814b6f7b970-us12'
    };

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })

        if (response.statusCode == 200){
            res.sendFile(path.join(__dirname + "/success.html"))
        } else {
            res.sendFile(path.join(__dirname + "/failure.html"))
        }
    })

    request.write(jsonData);
    request.end();
   
});

app.post("/failure", function(req, res){
    res.redirect("/")
})



app.listen(3000, function(req, res){
    console.log("Port is listening on Port 3000")
});

// API KEY
// b03caf03a17dad0720f8a814b6f7b970-us12
// Audience ID
// 8f2ad76a5e