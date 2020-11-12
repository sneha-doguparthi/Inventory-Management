const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
//setting body-parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Creating the connection to the database
const db =mysql.createConnection({
    host: 'myserver-azure.mysql.database.azure.com',
    user: 'csci5409@myserver-azure',
    port: '3306',
    password : 'Cloud@5409',
    database: 'csci5409',
    ssl:true
});
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('Connection successful');
});

//Get information for all the jobs
app.get('/jobs995',(req,res)=>{
    let sql = 'select * from jobs995';
    let query = db.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        if(result.length==0){
            ('Jobs995table does not have any records');
            res.send('Jobs995 table does not have any records'); 
        }else{
        console.log(result);
        res.send(result); 
        }   
    });    
});

//Get job information for particular jobId995 and partId995
app.get('/onejob995',(req,res)=>{
    let sql = "select * from jobs995 where jobId995 = " +req.query.jobId995+" and partId995 ="+ req.query.partId995;
    let query=db.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        if(result.length==0) {
            console.log('Job with jobId '+ req.query.jobId995 + 'and partId ' + req.query.partId995 + 'does not exist');
            res.status(404).send('Job with jobId '+req.query.jobId995+ ' and partId \t' +req.query.partId995 +' was not found');
        }else
                res.send(result);   
    });
});
const jsonParser = bodyParser.json();

//Insert the record with job information
app.post('/jobs995',jsonParser,(req,res)=>{
    let select = "select * from jobs995 where jobId995 = '" +req.body.jobId995+ "' and partId995 = " + req.body.partId995;
    let sql= 'insert into jobs995 SET ?';
    let insertData = {jobId995:req.body.jobId995,partId995:req.body.partId995,qty995:req.body.qty995};
    let selQuery = db.query(select,(selerror,result)=>{
        if(result.length==0){
            let insertQuery = db.query(sql,insertData,(err,insertResult)=>{
                if(err){
                    throw err;
                }
                res.send('Record {' + insertData.jobId995 + "," + insertData.partId995 + "," + insertData.qty995 + '} is inserted in jobs995 table');
            });
        }else{
            res.status(404).send('Jobs995 table with jobId ' +insertData.jobId995 +'and partId ' +insertData.partId995 +' already exists');
        }
    });
});

//Update the job information for a given jobId and partId
app.put('/jobs995',jsonParser,(req,res)=>{
    let select = "select * from jobs995 where jobId995 = '" +req.body.jobId995+ "' and partId995 =" + req.body.partId995;
    let sql ="Update jobs995 SET ? where jobId995 = '" + req.body.jobId995+ "'";
    let updateData = {qty995:req.body.qty995};
    let selQuery = db.query(select,(err,result)=>{
        if(result.length!=0){
            let updateQuery = db.query(sql,updateData,(err,result)=>{
                if(err){
                    throw err;
                }
                res.send('Record with JobId995 ' + req.body.jobId995 + ' and partId995 '+ req.body.partId995 +' is updated');    
            });
        }else{
            res.status(404).send('JobId '+req.body.jobId995+' does not exist');  
        }
    });
});

module.exports = app;