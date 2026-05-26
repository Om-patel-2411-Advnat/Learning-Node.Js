import mysql from 'mysql2';

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root' ,
    database : 'Node-complete',
    password : 'User@Advant' 
})


export default pool.promise() ;