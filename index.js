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

app.get("/api/users", (req, res) => {
  const sqlSelect = "SELECT * FROM `users` ";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
app.get("/api/slider", (req, res) => {
  const sqlSelect = "SELECT * FROM `slider` ";
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
  const phone = req.body.phone;
  const sqlInsert =
    "INSERT INTO `users` ( `fullname`, `password`,`phone`,`email`) VALUES (?,?,?,?);";
  db.query(sqlInsert, [fullname, password, phone, email], (err, result) => {
    console.log(err);
  });
});
// Thanh toan
app.post("/api/thanhtoan", (req) => {
  const { data } = req.body;
  const { id_user, fullname, note, address, newTimeString, carts } = data;
  const sqlInsert =
    "INSERT INTO `bill` ( `id_user`,`fullname`,`address`,`note`,`ngaydathang`) VALUES (?,?,?,?,?);";
  const sqlDetail =
    "INSERT INTO bill_dentail (total,price,id_bill,id_product) VALUES ?;";
  db.query(
    sqlInsert,
    [id_user, fullname, address, note, newTimeString],
    (err, result) => {
      if (result) {
        const dataCart = [];
        carts.forEach((cart) => {
          dataCart.push([
            cart.qty,
            cart.price,
            result.insertId,
            cart.id_product,
          ]);
        });
        db.query(sqlDetail, [dataCart], (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  );
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
  const content = req.body.comment;
  const idProduct = req.body.idProduct;
  const idUser = req.body.idUser;
  const ngay = req.body.newTimeString;
  const sqlInsert =
    "INSERT INTO `comment` ( `content`, `id_product`, `id_user`, `ngaybinhluan`) VALUES (?,?,?,?);";
  db.query(sqlInsert, [content, idProduct, idUser, ngay], (err, result) => {
    console.log(err);
  });
});

app.get("/api/bill", (req, res) => {
  db.connect(function (err) {
    db.query("SELECT * FROM bill", function (err, result) {
      if (err) throw err;
      console.log(result);

      res.send(result);
    });
  });
});

app.get("/api/bill_dentail", (req, res) => {
  db.connect(function (err) {
    db.query("SELECT * FROM bill_dentail", function (err, result) {
      if (err) throw err;
      console.log(result);

      res.send(result);
    });
  });
});

app.post("/api/huydon", (req) => {
  const idBill = req.body.idBill;
  const newStatus = req.body.newStatus;

  const sqlInsert = `UPDATE bill SET status = ${newStatus} WHERE id_bill = ${idBill}`;

  db.query(sqlInsert, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.post("/api/capnhattaikhoan", (req) => {
  const idUser = req.body.idUser;
  const fullName = req.body.fullName;
  const email = req.body.email;
  const image = req.body.image;
  const phone = req.body.phone;
  const password = req.body.password;

  const sqlInsert = `UPDATE users SET fullname = '${fullName}', password = '${password}', phone = '${phone}', email = '${email}', image = '${image}' WHERE id_user = ${idUser}`;

  db.query(sqlInsert, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(4000, () => {
  console.log("rungning in port 4000");
});
