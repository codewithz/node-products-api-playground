const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connect to MySQL

const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "admin",
  database: "products_db",
});

db.connect((error) => {
  if (error) {
    console.log("Database Connection Error:", error.stack);
    return;
  } else {
    console.log("Connected to DB");
  }
});

app.get("/hello", (request, response) => {
  response.send("Hello World from Node App");
});

// GET ALL PRODUCTS -- /products
// GET Single PRODUCTS -- /products/id
// CREATE A PRODUCT --    /products  request body   DB?-- INSERT  HTTP VERB ?-- POST
// UPDATE A PRODUCT --    /products/id  request body
// DELETE A PRODCT --    /products/id

// GET ALL PRODUCTS -- /products

app.get("/products", (request, response) => {
  db.query("Select * from products", (error, results) => {
    if (error) {
      throw error;
    } else {
      response.json(results);
    }
  });
});

// GET Single PRODUCTS -- /products/id
app.get("/products/:id", (request, response) => {
  const id = request.params.id;

  db.query("Select * from products where id=?", [id], (error, result) => {
    if (error) {
      throw error;
    } else {
      response.json(result);
    }
  });
});

// CREATE A PRODUCT --    /products  request body   DB?-- INSERT  HTTP VERB ?-- POST

app.post("/products", (request, response) => {
  const { name, category, brand, price } = request.body;
  db.query(
    "Insert into products (name,price,category,brand) values (?,?,?,?)",
    [name, price, category, brand],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        response.json({ id: request.insertId, ...request.body });
      }
    }
  );
});

// Update a product
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, brand, category } = req.body;
  db.query(
    "UPDATE products SET name = ?, price = ?, brand = ?, category = ? WHERE id = ?",
    [name, price, brand, category, id],
    (err) => {
      if (err) throw err;
      res.send("Product updated successfully.");
    }
  );
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.send("Product deleted successfully.");
  });
});

const PORT = 3000;

// Start the server

app.listen(PORT, () => {
  console.log("Server is listening on http://localhost:" + PORT);
});
