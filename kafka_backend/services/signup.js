
var connection = require("./dbconnection")

function handle_request(msg, callback){
    // console.log(req.body);

    const username = msg.username;
    const password = msg.password;
    const email = msg.email;
    const image = msg.image;
    const response = {};
    
    connection.query("INSERT INTO user (email,username,password,image) VALUES (?,?,?,?)", [email,username,password,image], (err, result)=>{
        if(err){
            response.messaage = err;
            response.status = 404;
            callback(null, response);
        }
        else{
            response.messaage = "Inserted successfully into the user table: " ,result
            // console.log("Inserted successfully into the user table: " ,result);
            response.status = 200;
            callback(null, response);
        }
    })
};

exports.handle_request = handle_request;