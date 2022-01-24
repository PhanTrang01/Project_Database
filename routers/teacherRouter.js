const express = require('express');
const {conn, sql} = require('../connect');
const route = express.Router();
const checkAuth = require('../middleware/checkAuth');
const excel = require('exceljs');
const readXlsxFile = require('read-excel-file/node');

route.get('/teacherhome', checkAuth, async function(req, res){
    let username = req.username;
    var sqlString = "select * from Notice";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.render("teacher/teacherhome.ejs", {
            username, data
          });
    })
})

route.get('/teachertimetable',checkAuth,  async function(req, res){
    let username = req.username;
    var sqlString = "exec Search_Class @teacherID = @id, @semesterID = 20211";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.render("teacher/teachertimetable.ejs", {
            username, data
          });
    })
})
route.get('/teacherprofile', checkAuth,  async (req, res) => {
    let username = req.username;
    var sqlString = "select Teacher.*, Department.name as departname from Teacher, Department where Teacher.departID = Department.departID and teacherID = @id";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.render("teacher/teacherprofile.ejs", {
            username, data
          });
    })
})
route.get('/updategrade', checkAuth,  async function(req, res){
    console.log(req.query.classID);
    const classid = req.query.classID;
    var data1;
    let username = req.username;

    var sqlString = "exec Search_Class @teacherID = @id, @semesterID = 20211";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        pool.request().input('id1', sql.Int, req.query.classID).query('exec Search_Student_inClass @classID = @id1, @semesterID = 20211', function(err, data1){
        res.render("teacher/updategrade.ejs", {
            username, data,data1, classid
          });
        })
    })
})
route.post('/updategrade', checkAuth,  async function(req, res){
    console.log(req.body);
    const classid = req.query.classID;
    var data1;
    let username = req.username;
    var sqlString = "exec Search_Class @teacherID = @id, @semesterID = 20211";
    var pool =  await conn;
    await pool.request().input('Midterm_grade', sql.Decimal(3,1), req.body.midterm).
    input('Finalterm_grade', sql.Decimal(3,1), req.body.lastterm).
    input('ClassID', sql.Int, req.body.classID).
    input('StudentID', sql.Int, req.body.studentID).
    query("exec Grade_Input  @classID = @ClassID, @studentID = @StudentID ,@semesterID = 20211, @midterm_grade = @Midterm_grade , @finalterm_grade = @Finalterm_grade;", async function(err, data){
    });
    res.json({
        code:200,
        success:true,
        message:'update success'
    })

    
})

route.get('/class-excel-download', async (req, res) => {
    let username = req.cookies.username;
    var sqlString = "exec Search_Student_inClass @classID = @class, @semesterID = 20211";
    var pool =  await conn;
    return await pool.request().input('class', sql.Int, req.query.class).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		console.log(table.recordset);
        let workbook = new excel.Workbook(); //creating workbook
		let worksheet = workbook.addWorksheet('Timetable'); //creating worksheet
		//  WorkSheet Header
		worksheet.columns = [
            { header: 'stt', key: 'stt', width: 5 },
			{ header: 'studentID', key: 'studentID', width: 10 },
			{ header: 'name', key: 'name', width: 30 },
			{ header: 'dateofbirth', key: 'dateofbirth', width: 10},
			{ header: 'midterm_grade', key: 'midterm_grade', width: 10},
            { header: 'finalterm_grade', key: 'finalterm_grade', width: 10},
            { header: 'avg_grade', key: 'avg_grade', width: 10, outlineLevel: 1}
		];
	 
		// Add Array Rows
		worksheet.addRows(table.recordset);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Class"+ req.query.class+".xlsx"
          );
		// Write to File
		return workbook.xlsx.write(res)
		.then(function() {
			console.log("file saved!");
            //res.redirect("/timetable");
		});
        
    })
})

module.exports = route;