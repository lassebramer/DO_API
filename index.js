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
          });
    }
})

app.post("/getPlayerId", (req, res) => {
if (!req.body.name) {
    res.json("No Name found in reqest body.")
} else {
    sql = 'SELECT PlayerID from Players where Name = ?'
    playerName = req.body.name
    db.get(sql, playerName, (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row["PlayerID"])
        });
}
})

app.post("/getPlayerStatsBySeasonAndID", (req, res) => {
  console.log(req.body)
    if (!req.body.season) {
        res.json("No Season found in reqest body.")
    } else if(!req.body.id){
        res.json("No PlayerID found in reqest body.")
    } else {
        sql = 'SELECT *  from boxScores Where Season = ? and PlayerId = ?'
        season = req.body.season
        id = req.body.id
        db.all(sql, [season,id], (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows)
            });
    }
})

app.post("/insertPlayerProps", (req, res) => {
    if (!req.body) {
        res.json("No Season found in reqest body.")
    } else {
        stats = req.body
        db.run(`INSERT OR REPLACE INTO playerProps (Game,Season, PLayer, Date, PL, PO, PU, PLL, PLO, PLU, PHL, PHO, PHU, RL, RO, RU, AL, AO, AU, threePL, threePO, threePU, SL, SO, SU, TL, Tover, TU, BL, BO, BU, DDO, DDU, TDO, TDU, PAL, PAO, PAU, PRL, PRO, PRU, PRAL, PRAO, PRAU, ARL, ARO, ARU, SBL, SBO, SBU) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, stats, function(err) {
          if (err) {
            res.json(err.message);
          }else{
            res.json("success")
          }
        });
    }
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})

