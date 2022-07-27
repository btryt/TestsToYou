const {Pool} = require("pg")
const pool = new Pool({host:"localhost",port:5432,password:"1234567",database:"TestToYou",user:"postgres"})

module.exports = {
    async query(query,params){
        return await pool.query(query,params)
    }
}