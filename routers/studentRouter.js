const express = require('express');
const {conn, sql} = require('../connect');
const route = express.Router();
const checkAuth = require('../middleware/checkAuth');

route.get('/home',checkAuth, async (req, res) => {
    let username = req.username;
    var sqlString = "select * from Notice";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.render("student/home.ejs", {
            username, data
          });
    })
})

route.get('/grade',checkAuth, async (req, res) => {
    let username = req.username;
    var sqlString = "exec Search_Grade @studentID = @id;";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        pool.request().input('id1', sql.Int, username).query('exec Search_GPA @studentID = @id1', function(err, data1){
            res.render("student/grade.ejs", {
                username, data,data1
              });
            })
    })
})


route.get('/roadmap',checkAuth, async (req, res) => {
    let username = req.username;
    var sqlString = "exec Search_finalResult @studentID = @id;";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.render("student/roadmap.ejs", {
            username, data
          });
    })
    // res.render("roadmap.ejs", {
    //     username,
    //   });
})

route.get('/studentprofile',checkAuth, async (req, res) => {
    let username = req.username;
    var sqlString = "select * from Student where studentID = @id";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.render("student/studentprofile.ejs", {
            username, data
          });
    })
})

route.get('/timetable', checkAuth,async (req, res) => {
    let username = req.username;
    var sqlString = "exec Search_Timetable @studentID = @id, @semesterID = '20211'";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.render("student/timetable.ejs", {
            username, data
          });
    })
})

module.exports = route;