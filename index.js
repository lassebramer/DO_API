const express = require("express")
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser")


const PORT = process.env.PORT || 5000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


let db = new sqlite3.Database('./stats.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the stats database.');
  });

app.get("/", (req, res) => {
  res.send("Welcome to your App!")
})

app.get("/playerProps", (req, res) => {
    sql = 'SELECT *  from playerProps Where Date = ?'
    date = ["2022-11-29"]
    db.all(sql, date, (err, rows) => {
        if (err) {
          throw err;
        }
        res.send(rows)
        rows.forEach((row) => {
          console.log(row);
        });
      });
})

app.post("/getPlayerPropsByDate", (req, res) => {
    if (!req.body.date) {
      res.json("No DATE found in reqest body.")
    } else {
        sql = 'SELECT *  from playerProps Where Date = ?'
        date = req.body.date
        db.all(sql, date, (err, rows) => {
            if (err) {
              throw err;
            }
            res.send(rows)
            rows.forEach((row) => {
              console.log(row);
            });
          });
    }
  })

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})