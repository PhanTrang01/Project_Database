const express = require('express');
const {conn, sql} = require('../connect');
const route = express.Router();
const checkAuth = require('../middleware/checkAuth');

route.get('/admin_student', async function(req, res){
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    console.log(req.body);
    let username = req.cookies.username;
    var sqlString = "Select * from Student";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
        res.render("admin/admin_student.ejs", {data});
    })
})

route.post('/admin_student', async function(req, res){
    console.log(req.body);
    let username = req.cookies.username;
    var sqlString = "exec Student_INSERT @name = @Name, @enteryear = @Year, @programID = @ProgramID, @dateofbirth = @Dateofbirth, @gender = @Gender, @email = @Email, @phonenumber = @Numberphone, @idencardnum =@cccd;";
    var pool =  await conn;
    return await pool.request().input('Name', sql.NVarChar(100), req.body.Name).
    input('Year', sql.Int, req.body.Year).
    input('ProgramID', sql.Char(4), req.body.ProgramID).
    input('Dateofbirth', sql.Date, req.body.Dateofbirth).
    input('Gender', sql.Int, req.body.Gender).
    input('Email', sql.VarChar(50), req.body.Email).
    input('Numberphone', sql.VarChar(20), req.body.Numberphone).
    input('cccd', sql.VarChar(20), req.body.cccd).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.redirect("/admin/admin_student");
    })
})

route.get('/updatestudent', async function(req, res){
    console.log(req.query.id);
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    var sqlString = "select * from Student where studentID = @id";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, req.query.id).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        console.log(data);
        pool.request().query("select * from Program;", function(err, data1){
           // console.log(data1.recordset[0].programID+"hello");
            res.render("admin/updatestudent.ejs", {
                data,data1
              });
            })
    })
})
route.post('/updatestudent', async function(req, res){
    console.log(req.body);
    let username = req.cookies.username;
    var sqlString = "UPDATE Student SET name = @Name, programID = @ProgramID, dateofbirth = @Dateofbirth, gender = @Gender, email = @Email, phonenumber = @Numberphone, idencardnum =@cccd, status =@Status WHERE studentID = @studentID;";
    var pool =  await conn;
    return await pool.request().input('Name', sql.NVarChar(100), req.body.Name).
    input('ProgramID', sql.Char(4), req.body.ProgramID).
    input('Dateofbirth', sql.Date, req.body.Dateofbirth).
    input('Gender', sql.Int, req.body.Gender).
    input('Email', sql.VarChar(50), req.body.Email).
    input('Numberphone', sql.VarChar(20), req.body.Numberphone).
    input('cccd', sql.VarChar(20), req.body.cccd).
    input('studentID', sql.Int, req.body.studentID).
    input('Status', sql.Int, req.body.Status).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.redirect("/admin/admin_student");
    })
})

route.get('/addstudent', async function(req, res){
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    var sqlString = "select * from Program;";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        res.render("admin/addnewstudent.ejs", {data});
    })
})

route.get('/deletestudent', async function(req, res){
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    var sqlString = "exec Student_delete";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        res.redirect("/admin/admin_student");
    })
})

route.get('/admin_teacher', async function(req, res){
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    console.log(req.body);
    let username = req.cookies.username;
    var sqlString = "Select * from Teacher";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));

        res.render("admin/admin_teacher.ejs", {data});
    })
})

route.post('/admin_teacher', async function(req, res){
    console.log(req.body);
    let username = req.cookies.username;
    var sqlString = "exec Teacher_INSERT @name = @Name,@departID = @DepartID, @dateofbirth = @Dateofbirth,@gender = @Gender,@email = @Email,@phonenumber = @Numberphone ,@idencardnum = @cccd;"
    var pool =  await conn;
    return await pool.request().input('Name', sql.NVarChar(100), req.body.Name).
    input('DepartID', sql.Char(2), req.body.DepartID).
    input('Dateofbirth', sql.Date, req.body.Dateofbirth).
    input('Gender', sql.Int, req.body.Gender).
    input('Email', sql.VarChar(50), req.body.Email).
    input('Numberphone', sql.VarChar(20), req.body.Numberphone).
    input('cccd', sql.VarChar(20), req.body.cccd).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.redirect("/admin/admin_teacher");
    })
})

route.get('/updateteacher', async function(req, res){
    console.log(req.query.id);
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    var sqlString = "select * from Teacher where teacherID = @id";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, req.query.id).
    query(sqlString, function(err, data){
        if(err) throw err;
        
		//console.log(table.recordset);
        console.log(data);
        pool.request().query("select * from Department;", function(err, data1){
            res.render("admin/updateteacher.ejs", {
                data,data1
              });
            })
    })
})
route.post('/updateteacher', async function(req, res){
    console.log(req.body);
    let username = req.cookies.username;
    var sqlString = "UPDATE Teacher SET name = @Name, departID = @DepartID, dateofbirth = @Dateofbirth, gender = @Gender, email = @Email, phonenumber = @Numberphone, idencardnum =@cccd, status=@Status WHERE teacherID = @teacherID;";
    var pool =  await conn;
    return await pool.request().input('Name', sql.NVarChar(100), req.body.Name).
    input('DepartID', sql.Char(2), req.body.DepartID).
    input('Dateofbirth', sql.Date, req.body.Dateofbirth).
    input('Gender', sql.Int, req.body.Gender).
    input('Email', sql.VarChar(50), req.body.Email).
    input('Numberphone', sql.VarChar(20), req.body.Numberphone).
    input('cccd', sql.VarChar(20), req.body.cccd).
    input('teacherID', sql.Int, req.body.teacherID).
    input('Status', sql.Int, req.body.Status).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.redirect("/admin/admin_teacher");
    })
})


route.get('/addteacher', async  function(req, res){
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    var sqlString = "select * from Department;";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        res.render("admin/addnewteacher.ejs", {data});
    })
})

route.get('/deleteteacher', async function(req, res){
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    var sqlString = "exec Teacher_delete";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        res.redirect("/admin/admin_teacher");
    })
})

route.get('/admin_home', async function(req, res){
    console.log(req.body);
    let username = req.cookies.username;
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    var sqlString = "Select * from Notice";
    var pool =  await conn;
    return await pool.request().
    query(sqlString, function(err, data){
        if(err) throw err;
        //console.log(data);
        const table = JSON.parse(JSON.stringify(data));
        res.render("admin/admin_home.ejs", {data});
    })
})

route.post('/admin_home', async function(req, res){
    console.log(req.body);
    let username = req.cookies.username;
    var sqlString = "insert into Notice(title, URL) values(@title,@url)";
    var pool =  await conn;
    return await pool.request().input('title', sql.NVarChar(300), req.body.title).
    input('url', sql.VarChar(2083), req.body.url).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		//console.log(table.recordset);
        res.redirect("/admin/admin_home");
    })
})


route.get('/addnotice', function(req, res){
    if(req.cookies.username != '22082001'){
        res.redirect("/login");
    }
    res.render("admin/addnotice.ejs");
})

module.exports = route;