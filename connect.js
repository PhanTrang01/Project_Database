var sql = require('mssql/msnodesqlv8');

var config = {
    server: "localhost",
    user: "sa",
    password: "minh2001",
    database: "Project_demo",
    driver: "msnodesqlv8"
};

const conn = new sql.ConnectionPool(config).connect().then(pool =>{
    return pool;
});

module.exports = {
    conn: conn,
    sql: sql
}