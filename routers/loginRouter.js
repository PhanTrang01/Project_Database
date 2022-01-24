const express = require('express');
const {conn, sql} = require('../connect');
const sendMail = require('../utils/sendMail');
const route = express.Router();

route.get('/', (req, res) => {
    res.render('login.ejs');
})

route.post('/', async (req, res) => {
    // console.log(req.body);
    id = req.body.username;
    password= req.body.password;
    //logic check
    /* if(err) res.json({
        field:'name'
        message:'do dai qua ngan'
    })*/
    console.log(password);
    console.log(id);
    var pool = await conn;
    //var sqlString = "SELECT * FROM GiangVien WHERE GV# like '"+id+"'";
    var sqlString = "exec PASSWORDCHECK @username = @id, @password = @pass";
    return await pool.request().input('id', sql.Int, id).
    input('pass', sql.VarChar, password).
    query(sqlString, function(err, data){
        if(err){
            console.log(err);
        }
        if(data.recordset[0].checkpassword == 1){
            res.cookie("username",id);
            var user = String(id).substring(0,4);
            console.log(user);
            //res.send(data.recordset);
            //res.redirect("/Product");
            if(user == '2208'){
                // res.redirect('admin_home');
                res.json({
                    code:200,
                    role:'admin'
                })
            }    
            else if(user == '1111'){
                // res.redirect('teacherhome');
                res.json({
                    code:200,
                    role:'teacher'
                })
            }
            else{
                // res.redirect('home');
                res.json({
                    code:200,
                    role:'student'
                })
            }
        }
        else{
            res.json({
                code:400,
                success:false,
                message:"username and password invalid"
            })
        }
    })
})

route.get('/forgot', (req, res) => {
    res.render('forgot.ejs');
})
route.post('/forgot', async (req, res) => {
    //res.cookie("changeID",req.body.username);
    id = req.body.username;
    email= req.body.email;
    console.log(email);
    console.log(id);
    var pool = await conn;
    var sqlString = "select count(*) as checkemail from Student where studentID = @id and email = @email;";
    return await pool.request().input('id', sql.Int, id).
    input('email', sql.VarChar, email).
    query(sqlString, function(err, data){
        if(err){
            console.log(err);
        }
        if(data.recordset[0].checkemail == 1){
            res.cookie("changeID",req.body.username);
            res.cookie("email",req.body.email);
            res.json({
                code:200
            })
        }
        else{
            res.json({
                code:400,
                success:false,
                message:"username and email invalid"
            })
        }
    })



    // const send = async ()=>{
    //     const res = await sendMail(req.body.email,"<h1>TO CHANGE YOUR PASSWORD PLEASE GO TO THIS PAGE: http://localhost:3000/login/changepassword </h1>");
    //     return res;
    // }
    // console.log(req.body);
    // const link = await send();
    // res.render('mailsend.ejs',{link});
 
})
route.get('/maildirect', async (req, res) => {
    let changeID = req.cookies.changeID;
    console.log(req.body.email);
    const send = async ()=>{
        const res = await sendMail(req.cookies.email,"<h1>TO CHANGE YOUR PASSWORD PLEASE GO TO THIS PAGE: http://localhost:3000/login/changepassword </h1>");
        return res;
    }
    console.log(req.body);
    const link = await send();
    res.render('mailsend.ejs',{link});
})

route.get('/changepassword', (req, res) => {
    //console.log(changeID);
    res.render('changepassword.ejs');
})

route.post('/changepassword',async (req, res) => {
    const changeID = req.cookies.changeID;
    if(req.body.password != req.body.password1){
        res.json({
            code:400,
            success:false,
            message:"Mật khẩu xác thực không khớp"
        })
    }
    else{
    var sqlString = "exec Change_Password  @username=@id, @password = @pass";
    var pool =  await conn;
    return await pool.request().input('id', sql.Int, changeID).
    input('pass',  sql.VarChar, req.body.password).
    query(sqlString, function(err, data){
        if(err) throw err;
        res.clearCookie("changeID");
        res.clearCookie("email");
        res.json({
            code:200
        })
    })
}
})

module.exports = route;