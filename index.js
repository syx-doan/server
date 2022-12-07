const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "do_an_tot_nghiep",
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM `users` ";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
app.get("/api/brand", (req, res) => {
  const sqlSelect = "SELECT * FROM `brand` ";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
app.get("/api/category", (req, res) => {
  const sqlSelect = "SELECT * FROM `category` ";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
// đăng ký
app.post("/api/dangky", (req, res) => {
  const fullname = req.body.fullname;
  const password = req.body.password;
  const email = req.body.email;
  const sqlInsert =
    "INSERT INTO `users` ( `fullname`, `password`,`email`) VALUES (?,?,?);";
  db.query(sqlInsert, [fullname, password, email], (err, result) => {
    console.log(err);
  });
});
app.post("/api/thanhtoan", (req) => {
  // const name = req.body.name;
  // const phone = req.body.phone;
  // const address = req.body.address;
  // const district = req.body.district;
  // const city = req.body.city;
  
 
  const {data} = req.body
  const {id_user,carts} =data
  const sqlInsert =
  "INSERT INTO `bill` ( `id_user`) VALUES (?);";
  const sqlDetail =
  "INSERT INTO bill_dentail (total,price,id_bill,id_product) VALUES ?;";
  db.query(sqlInsert, [id_user], (err, result) => {
    if(result){     
      const dataCart = []
      carts.forEach(cart => {
        dataCart.push([cart.qty,cart.price,result.insertId,cart.id_product])
      })
      db.query(sqlDetail,  [dataCart] , (err, result) => {
        if(err){
          console.log(err)
        }
     
    })
  }
});
});
//đăng nhập
app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE `email` = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ message: "Không có tài khoản, hoặc mất khẩu không đúng" });
      }
    }
  );
});

// all san pham
app.get("/api/products", (req, res) => {
  db.connect(function (err) {
    // if (err) throw err;
    // if connection is successful
    db.query(
      "SELECT * FROM products",
      function (err, result) {
        // if any error while executing above query, throw error
        if (err) throw err;
        console.log(result);

        res.send(result);
      }
    );
  });
});

app.get("/api/newproducts", (req, res) => {
  db.connect(function (err) {
    db.query(
      "SELECT * FROM products ORDER BY id_product DESC LIMIT 6",
      function (err, result) {
        if (err) throw err;
        console.log(result);

        res.send(result);
      }
    );
  });
});

//

// app.get('/api/pruducts/category_id/',(req,res)=>{

//   db.connect(function(err) {
//     db.query("SELECT * from products where category_id=1", function(err,result){
//       if(err) throw err;
//       console.log(result);
//       res.send(result);
//     })
//   })
//   })

app.get("/api/news", (req, res) => {
  db.connect(function (err) {
    db.query("SELECT * from news", function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  });
});
app.get("/", (req, res) => {
  res.send("server ís running");
});

app.listen(4000, () => {
  console.log("rungning in port 4000");
});

app.get("/api/categoryproduct", (req, res) => {
  const categoryid = req.body.categoryid;
  if (categoryid) {
    db.connect(function (err) {
      db.query(
        `SELECT * FROM products WHERE category_id = ${categoryid}`,
        function (err, result) {
          if (err) throw err;
          console.log(result);

          res.send(result);
        }
      );
    });
  } else {
    db.connect(function (err) {
      db.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        console.log(result);

        res.send(result);
      });
    });
  }
});
