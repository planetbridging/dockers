const oMysql = require("./objMysql");

const db = process.env.DBNAME;
const un = process.env.DBUSER;
const pw = process.env.DBPWD;


(async () => {
    console.log("welcome to force directed erd");
    console.log(db);
    await remoteDBTesting();
  })();

  async function remoteDBTesting() {
    var oSql = new oMysql.objSql("", un, pw, false);
    //MYSQL_CLIENT_SSL
    var lstDb = await oSql.getLstDb();
    console.log(lstDb);

    var lstSchemaAndMore = await oSql.getDetailedSchema(db);
    console.log(lstSchemaAndMore);
  }