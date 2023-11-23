var mysql = require("mysql2");

async function read() {
  connection.query(
    {
      sql: "SELECT * FROM `books` WHERE `author` = ?",
      timeout: 40000, // 40s
      values: ["David"],
    },
    function (error, results, fields) {
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
    }
  );
}

/*var post  = {id: 1, title: 'Hello MySQL'};
var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
  if (error) throw error;
  // Neat!
});
console.log(query.sql);*/

class objSql {
  constructor(host, user, password, ssl, db) {
    console.log("starting sql server");
    var status = "starting";
    if (ssl) {
      /*this.connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        insecureAuth: true,
        ssl: {
          // DO NOT DO THIS
          // set up your ca correctly to trust the connection
          rejectUnauthorized: false,
        },
      });*/
      if (db != undefined) {
        this.connection = mysql.createPool({
          database: db,
          host: host,
          user: user,
          waitForConnections: true,
          connectionLimit: 400,
          queueLimit: 0,
          password: password,
          insecureAuth: true,

          ssl: {
            // DO NOT DO THIS
            // set up your ca correctly to trust the connection
            rejectUnauthorized: false,
          },
        });
      } else {
        this.connection = mysql.createPool({
          host: host,
          user: user,
          waitForConnections: true,
          connectionLimit: 400,
          queueLimit: 0,
          password: password,
          insecureAuth: true,

          ssl: {
            // DO NOT DO THIS
            // set up your ca correctly to trust the connection
            rejectUnauthorized: false,
          },
        });
      }
      this.status = "running";
    } else {
      if (db != undefined) {
        this.connection = mysql.createPool({
          host: host,
          user: user,
          password: password,
          database: db,

          waitForConnections: true,
          connectionLimit: 300,
          queueLimit: 0,
        });
      } else {
        console.log("this should be running");
        this.connection = mysql.createPool({
          host: host,
          user: user,
          password: password,

          waitForConnections: true,
          connectionLimit: 300,
          queueLimit: 0,
        });
      }

      /*this.connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
      });*/
    }

    /*this.connection.connect(function (err) {
      if (err) {
        console.error("error connecting: " + err.stack);
        return;
        status = "broke";
      }

      //console.log("connected as id " + this.connection.threadId);
    });*/

    this.timeout = 40000;
    this.status = status;
  }

  async getDetailedSchema(dbName) {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          t.TABLE_NAME, 
          c.COLUMN_NAME, 
          c.DATA_TYPE,
          CASE 
            WHEN pk.COLUMN_NAME IS NOT NULL THEN 'YES' 
            ELSE 'NO' 
          END AS is_primary_key,
          fk.REFERENCED_TABLE_NAME,
          fk.REFERENCED_COLUMN_NAME,
          GROUP_CONCAT(DISTINCT kcu.CONSTRAINT_NAME SEPARATOR ', ') AS indexes
        FROM 
          INFORMATION_SCHEMA.TABLES t
        JOIN 
          INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
        LEFT JOIN 
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE pk ON pk.TABLE_NAME = t.TABLE_NAME AND pk.TABLE_SCHEMA = t.TABLE_SCHEMA AND pk.COLUMN_NAME = c.COLUMN_NAME AND pk.CONSTRAINT_NAME = 'PRIMARY'
        LEFT JOIN 
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE fk ON fk.TABLE_NAME = t.TABLE_NAME AND fk.TABLE_SCHEMA = t.TABLE_SCHEMA AND fk.COLUMN_NAME = c.COLUMN_NAME AND fk.REFERENCED_TABLE_NAME IS NOT NULL
        LEFT JOIN 
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON kcu.TABLE_NAME = t.TABLE_NAME AND kcu.TABLE_SCHEMA = t.TABLE_SCHEMA AND kcu.COLUMN_NAME = c.COLUMN_NAME
        WHERE 
          t.TABLE_SCHEMA = ?
        GROUP BY 
          t.TABLE_NAME, c.COLUMN_NAME, c.DATA_TYPE, pk.COLUMN_NAME, fk.REFERENCED_TABLE_NAME, fk.REFERENCED_COLUMN_NAME, c.ORDINAL_POSITION
        ORDER BY 
          t.TABLE_NAME, c.ORDINAL_POSITION;
      `;

      con.query(
        {
          sql: sql,
          timeout: timeOut,
          values: [dbName]
        },
        function (error, results, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  }


  async runTestConnection(db) {
    var t = await this.getLstDb();
    if (t != null) {
      if (t.includes("bewear")) {
        return true;
      }
    }
    return false;
  }

  closeConnection() {
    var status = "";
    this.connection.end(function (err) {
      // The connection is terminated now
      status = "closed";
    });
    this.status = status;
  }

  selectWithLikeDb(item, tblName, column) {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SELECT * FROM ?? WHERE ?? LIKE ? limit 100",
          timeout: timeOut, // 40s
        },
        [tblName, column, item],
        function (error, results, fields) {
          //console.log(error);
          resolve(results);
        }
      );
    });
  }

  updateDb(tblName, obj, whereEqual) {
    /*connection.query(
      "UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?",
      ["a", "b", "c", userId],
      function (error, results, fields) {
        if (error) throw error;
        // ...
      }
    );*/
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "UPDATE ?? SET ? WHERE ? limit 1",
          timeout: timeOut, // 40s
        },
        [tblName, obj, whereEqual],
        function (error, results, fields) {
          //console.log(error);
          //console.log("update");
          resolve(results);
        }
      );
    });
  }

  selectDb(item, tblName, column) {
    var con = this.connection;
    var timeOut = this.timeout;

    /*var t = con.query(
      {
        sql: "SELECT * FROM ?? WHERE ?? = ? limit 100",
        timeout: timeOut, // 40s
      },
      [tblName, column, item],
      function (error, results, fields) {
        console.log(error);
        //resolve(results);
      }
    );
    console.log(t.sql);*/
    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SELECT * FROM ?? WHERE ?? = ? limit 100",
          timeout: timeOut, // 40s
        },
        [tblName, column, item],
        function (error, results, fields) {
          resolve(results);
        }
      );
    });
  }

  selectCountDb(countCol, item, tblName) {
    var con = this.connection;
    var timeOut = this.timeout;

    /*var t = con.query(
      {
        sql: "SELECT * FROM ?? WHERE ?? = ? limit 100",
        timeout: timeOut, // 40s
      },
      [tblName, column, item],
      function (error, results, fields) {
        console.log(error);
        //resolve(results);
      }
    );
    console.log(t.sql);*/
    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SELECT COUNT(?) AS countItems FROM ?? WHERE ?",
          timeout: timeOut, // 40s
        },
        [countCol, tblName, item],
        function (error, results, fields) {
          resolve(results);
        }
      );
    });
  }

  selectCountMultiDb(countCol, item, tblName) {
    var sql = "SELECT * FROM ?? WHERE ?";
    var inserts = [tblName, item];
    sql = mysql.format(sql, inserts);
    console.log(sql);

    var con = this.connection;
    var timeOut = this.timeout;

    var t = con.query(
      {
        sql: "SELECT COUNT(?) AS countItems FROM ?? WHERE ?",
        timeout: timeOut, // 40s
      },
      [countCol, tblName, item],
      function (error, results, fields) {
        console.log(error);
        //resolve(results);
      }
    );
    console.log(t.sql);
    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SELECT COUNT(?) AS countItems FROM ?? WHERE ??",
          timeout: timeOut, // 40s
        },
        [countCol, tblName, item],
        function (error, results, fields) {
          resolve(results);
        }
      );
    });
  }

  selectDbSingle(item, tblName, column) {
    var con = this.connection;
    var timeOut = this.timeout;

    /*var t = con.query(
      {
        sql: "SELECT * FROM ?? WHERE ? limit 1",
        timeout: timeOut, // 40s
      },
      [tblName, item],
      function (error, results, fields) {
        console.log(error);
        //resolve(results);
      }
    );
    console.log(t.sql);
    console.log(item);*/
    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SELECT * FROM ?? WHERE ? limit 1",
          timeout: timeOut, // 40s
        },
        [tblName, item],
        function (error, results, fields) {
          resolve(results);
        }
      );
    });
  }

  insertDb(item, tblName) {
    var con = this.connection;
    var timeOut = this.timeout;

    /*var query = con.query(
      "INSERT INTO " + tblName + " SET ?",
      item,
      function (error, results, fields) {
        if (error) throw error;
        // Neat!
      }
    );
    console.log(query.sql);*/

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "INSERT INTO " + tblName + " SET ?",
          timeout: timeOut, // 40s
        },
        item,
        function (error, results, fields) {
          //console.log(error);
          //console.log(results);
          resolve(results);
        }
      );
    });
  }

  getLstDb() {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SHOW DATABASES;",
          timeout: timeOut, // 40s
        },
        function (error, results, fields) {
          var lst = [];
          for (var r in results) {
            lst.push(results[r]["Database"]);
          }
          resolve(lst);
        }
      );
    });
  }

  getLstTbl(db) {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SHOW TABLES;",
          timeout: timeOut, // 40s
        },
        function (error, results, fields) {
          var lst = [];
          for (var r in results) {
            lst.push(results[r]["Tables_in_" + db]);
          }
          resolve(lst);
        }
      );
    });
  }

  useDb(db) {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "USE " + db + ";",
          timeout: timeOut, // 40s
        },
        function (error, results, fields) {
          resolve(results);
        }
      );
    });
  }

  dropDb(db) {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "DROP DATABASE " + db + ";",
          timeout: timeOut, // 40s
        },
        function (error, results, fields) {
          resolve(results);
        }
      );
    });
  }

  createDb(db) {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "CREATE  DATABASE " + db + ";",
          timeout: timeOut, // 40s
        },
        function (error, results, fields) {
          resolve(results);
        }
      );
    });
  }

  createTbl(tbl, content) {
    var con = this.connection;
    var timeOut = this.timeout;

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "CREATE TABLE " + tbl + "(" + content + ");",
          timeout: timeOut, // 40s
        },
        function (error, results, fields) {
          //console.log(error);
          resolve(results);
        }
      );
    });
  }

  async checkIfTableExists(db, tbl) {
    var sql =
      `SHOW TABLE STATUS
    FROM ` +
      db +
      `
    WHERE Name = '` +
      tbl +
      `';`;
    //console.log(sql);
    var run = await this.randomSql(sql);
    return run;
  }

  async checkIfTableExistsProper(db, tblName) {
    var con = this.connection;
    var timeOut = this.timeout;

    /*var query = con.query(
        "INSERT INTO " + tblName + " SET ?",
        item,
        function (error, results, fields) {
          if (error) throw error;
          // Neat!
        }
      );
      console.log(query.sql);*/

    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: "SHOW TABLE STATUS FROM ?? WHERE Name = ?",
          timeout: timeOut, // 40s
        },
        [db, tblName],
        function (error, results, fields) {
          //console.log(results);
          //console.log(error);
          resolve(results);
        }
      );
    });
  }

  randomSql(sql) {
    var con = this.connection;
    var timeOut = this.timeout;
    //console.log(sql);
    return new Promise(function (resolve, reject) {
      con.query(
        {
          sql: sql,
          timeout: timeOut, // 40s
        },
        function (error, results, fields) {
          //console.log(results);
          resolve(results);
        }
      );
    });
  }
}

module.exports = {
  objSql,
};