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

app.post("/api/insert", (req, res) => {
  const fullname = req.body.fullname;
  const password = req.body.password;
  const email = req.body.email;
  const sqlInsert =
    "INSERT INTO `users` ( `fullname`, `password`,`email`) VALUES (?,?,?);";
  db.query(sqlInsert, [fullname, password, email], (err, result) => {
    console.log(err);
  });
});
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
app.get("/api/products", (req, res) => {
  db.connect(function (err) {
    db.query("SELECT * FROM products", function (err, result) {
      if (err) throw err;
      console.log(result);

      res.send(result);
    });
  });
});

app.get("/api/product_image", (req, res) => {
  db.connect(function (err) {
    db.query("SELECT * FROM product_image", function (err, result) {
      if (err) throw err;
      console.log(result);

      res.send(result);
    });
  });
});

app.get("/api/news", (req, res) => {
  db.connect(function (err) {
    db.query("SELECT * FROM news", function (err, result) {
      if (err) throw err;
      console.log(result);

      res.send(result);
    });
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

app.listen(4000, () => {
  console.log("rungning in port 400");
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

app.get("/api/comments", (req, res) => {
  db.connect(function (err) {
    db.query(
      "SELECT * FROM comment ORDER BY id_comment DESC",
      function (err, result) {
        if (err) throw err;
        console.log(result);

        res.send(result);
      }
    );
  });
});

app.post("/api/comment", (req, res) => {
  const comment = req.body.comment;
  const idProduct = req.body.idProduct;
  const idUser = req.body.idUser;
  const ngay = req.body.newTimeString;
  const sqlInsert =
    "INSERT INTO `comment` ( `comment`, `id_product`, `id_user`, `ngaybinhluan`) VALUES (?,?,?,?);";
  db.query(sqlInsert, [comment, idProduct, idUser, ngay], (err, result) => {
    console.log(err);
  });
});
