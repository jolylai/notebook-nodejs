# Notebook Nodejs

## express

```js
const express = require("express");
const app = new express();

let whiteList = ["http://localhost:3000"];
app.use((req, res, next) => {
  let origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    res.setHeader("Acess-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "name");
    res.setHeader("Access-Control-Allow-Methods", "PUT");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Max-Age", 6);
    res.setHeader("Access-Control-Expose-Headers", "name");
    if (req.method === "OPTIONS") {
      res.end();
    }
  }
  next();
});

app.put("/api/refundOrder/search", function(req, res) {
  res.setHeader("name", "jw");
  res.end("hello Express!!!");
});

app.use(express.static(__dirname));

app.listen(3000);
```

## koa

```js
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const app = new Koa();
const router = new Router();

mongoose.connect("mongodb://192.168.72.128:27017/koa", {
  useNewUrlParser: true
});

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number
});

// 实例方法
UserSchema.method("getFullName", function() {
  return `${this.firstName} ${this.lastName}`;
});

// 静态方法
UserSchema.static("getAllUser", function() {
  return this.find();
});

// 虚拟字段
// UserSchema.virtual("fullName").get(function() {
//   console.log("this: ", this);
//   return `${this.firstName} ${this.lastName}`;
// });

UserSchema.virtual("virtual").get(function() {
  console.log("this: ", this);
  return `${this.firstName} ${this.lastName}`;
});
// 前置钩子
UserSchema.pre("find", function(next) {
  // console.log("pre", this.firstName);
  // if (this.firstName) return next();
  // do something
  next();
});

UserSchema.post("find", function(doc) {
  // console.log("doc", doc);
});

const User = model("User", UserSchema);

router.get("/", async ctx => {
  const user = new User({ firstName: "Jone", lastName: "Snow" });
  const fullName = user.getFullName();
  ctx.body = { fullName };
});

router.post("/user/create", async ctx => {
  const user = await User.create(ctx.request.body);
  ctx.body = { user };
});

router.post("/user/query", async ctx => {
  const users = await User.find({
    age: { $gt: 10, $lt: 16 }
  });
  ctx.body = users;
});

router.get("/user/:id", async ctx => {
  const user = await User.findById(ctx.params.id, null, { virtual: true });
  ctx.body = { user };
});

router.get("/user/list", async ctx => {
  // const user = new User({ firstName: "Jone", lastName: "Snow" });
  const users = await User.find({}).exec();
  ctx.body = { users };
});

router.get("/user/remove", async ctx => {
  const data = await User.remove({});
  ctx.body = data;
});

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);
```
