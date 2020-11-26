const express = require('express');
const mysql = require('mysql');
// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cmpt470'
});

let options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: 'home.html'
};

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('MySQL connected....')
});
const port = process.env.PORT || 3000;
const app = express();
// Parsing body
app.use(express.json());
app.use(express.urlencoded({
  extended:false
}));

app.use('/', express.static('./pub_html', options));
app.use('/', (req, res, next) => {
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
});
// Post will automatically add next()
app.post('/addRectangle', (req, res) => {
  let rec = req.body;
  let area = rec.width * rec.height;
  let diag = Math.sqrt((rec.width * rec.width) + (rec.height * rec.height));
  let sql = 'insert into Rectangle (width, height, color, area, diagonal) values (' + rec.width + ', ' + rec.height +  ', \'' + rec.color +  '\', ' + area + ', ' + diag + ');';
  let query = db.query(sql, (err, result) => {
    if (err){
      //res.status(500).end('Something went wrong');
      throw err;
    }
    res.redirect('/');
  });
});

app.get('/showRectangles', (req, res) => {
  let sql = 'select * from Rectangle;';
  let query = db.query(sql, (err, rows) => {
    if (err){
      //res.status(500).send('Something went wrong...');
      throw err;
    }
    res.send(rows);
  })
});

app.post('/deleteRectangle', (req,res) => {
  let id = req.body.id;
  let sql = 'delete from Rectangle where id = ' + id + ';';
  let query = db.query(sql, (err, result) => {
    if (err){
      //res.status(500).send('Something went wrong...');
      throw err;
    }
    res.status(200).send('OK!');
  })
});

app.post('/editRectangle', (req, res) => {
  let rec = req.body;
  let area = rec.width * rec.height;
  let diag = Math.sqrt((rec.width * rec.width) + (rec.height * rec.height));
  let sql = 'update Rectangle set width='+rec.width+', height='+rec.height+', color=\''+rec.color+'\', area='+area+', diagonal='+diag +' where id='+rec.id+';';
  let query = db.query(sql, (err, result) => {
    if (err){
      //res.status(500).end('Something went wrong');
      throw err;
    }
    res.redirect('/');
  });
});
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

