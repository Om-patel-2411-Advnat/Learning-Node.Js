import Sequelize from 'sequelize';

const sequelize  = new Sequelize('Node-complete' , 'root' , 'User@Advant', {
    dialect : 'mysql' , 
    host : 'localhost' , 
});

export default sequelize ;