const { application, query } = require('express');
var express = require('express');
const sendMail = require('./utils/sendMail');
var app = express();
const cookieParser = require('cookie-parser');
const multer = require('multer');
const excel = require('exceljs');
const readXlsxFile = require('read-excel-file/node');

// routers
const loginRouter = require('./routers/loginRouter');
const studentRouter = require('./routers/studentRouter');
const teacherRouter = require('./routers/teacherRouter');
const adminRouter = require('./routers/adminRouter');


//const path = require('path');
app.use(express.static('public'));
app.use(cookieParser());


var bodyParser = require('body-parser');

const {conn, sql} = require('./connect');
const checkAuth = require('./middleware/checkAuth');
app.use(bodyParser.json());
app.set('view-engine','ejs');
app.use(express.urlencoded({ extended: false }));

// Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});
const upload = multer({storage: storage});
//Login router
const send = async ()=>{
    const res = await sendMail("dog@dog.com","<h1>hello</h1>");
    return res;
}

app.use('/login',loginRouter);
app.use('/student',studentRouter);
app.use('/teacher',teacherRouter);
app.use('/admin',adminRouter);

app.get('/changepass', async (req, res) => {
    const link = await send();
    console.log(link);
    if(link)
    res.render('mailsend.ejs',{link});
})

app.get("/logout", (req, res) => {
    // clear the cookie
    res.clearCookie("username");
    // redirect to login
    res.redirect("/login");
});


//Student router
app.get('/', checkAuth, (req, res) => {
    let username = req.username;
    var user = String(username).substring(0,4);
    console.log(user);
    //res.redirect("/teacher/teacherhome");
    
    if(user == '1111'){
        res.redirect("/teacher/teacherhome");
    }
    else if(user == '2208'){
        res.redirect("/admin/admin_home");
    }
    else{
        res.redirect("/student/home");
    }
    //res.render('index2.ejs');
    //res.sendFile(__dirname+'/views/home.html');
})

app.get('/timetable/excel', async (req, res) => {
    let username = req.cookies.username;
    var sqlString = "SELECT starttime, place, Class.classID, subjectID, teacherID FROM Attendance,Class,Student WHERE Attendance.classID = Class.classID and Attendance.MSSV = Student.MSSV and Student.MSSV=@id";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, username).
    query(sqlString, function(err, data){
        if(err) throw err;
        const table = JSON.parse(JSON.stringify(data));
		console.log(table.recordset);
        let workbook = new excel.Workbook(); //creating workbook
		let worksheet = workbook.addWorksheet('Timetable'); //creating worksheet
        
		//  WorkSheet Header
		worksheet.columns = [
			{ header: 'starttime', key: 'starttime', width: 10 },
			{ header: 'place', key: 'place', width: 10 },
			{ header: 'classID', key: 'classID', width: 3},
			{ header: 'subjectID', key: 'subjectID', width: 3},
            { header: 'teacherID', key: 'teacherID', width: 3, outlineLevel: 1}
		];
	 
		// Add Array Rows
		worksheet.addRows(table.recordset);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Timetable.xlsx"
          );
		// Write to File
		return workbook.xlsx.write(res)
		.then(function() {
			console.log("file saved!");
            //res.redirect("/timetable");
		});
        
    })
})

//server gate open
app.listen(3000, function(){
    console.log("Active on: http://localhost:3000");
});