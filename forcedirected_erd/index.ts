const express = require('express');

const oMysql = require("./objMysql");

const db = process.env.DBNAME;
const un = process.env.DBUSER;
const pw = process.env.DBPWD;

const port = process.env.PORT;


(async () => {
    console.log("welcome to force directed erd");
    console.log(db);
    await startup();


   


  })();

  async function remoteDBTesting() {
    var oSql = new oMysql.objSql("", un, pw, false);
    //MYSQL_CLIENT_SSL
    var lstDb = await oSql.getLstDb();
    console.log(lstDb);

    var lstSchemaAndMore = await oSql.getDetailedSchema(db);
    console.log(lstSchemaAndMore);
  }

  async function startup(){

    var oSql = new oMysql.objSql("", un, pw, false);

    const app = express();

        // Middleware to serve static files from 'public' directory
      app.use(express.static('public'));

      // API endpoint
      app.get('/api', async(req, res) => {
        //res.json({ message: 'Welcome to the API!' });
        var lstSchemaAndMore = await oSql.getDetailedSchema(db);
        res.send(lstSchemaAndMore);
      });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
}