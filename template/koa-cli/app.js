//数据库配置
require("./mongoose/index.js");
//koa实例
const Koa = require("koa");
const app = new Koa();
//跨域
let cors = require("koa2-cors");
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true
  })
);

// 解析数据
const bodyParser = require("koa-bodyparser");
app.use(bodyParser());
// 配置静态资源
const serve = require("koa-better-static2");
app.use(serve(".", { index: "./static/dist/index.html" }));

//登陆

//路由
require("./route")(app);

app.listen(3000);
