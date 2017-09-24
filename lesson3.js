
const express = require('express');
// 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = express();

app.get('/', (req, res, next) => {
  console.log(req)
  superagent.get('https://www.v2ex.com/')
    .end((err, sres) => {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      let $ = cheerio.load(sres.text);
      let items = [];
      $('.item_title a').each((idx, element) => {
        let $element = $(element);
        items.push({
          title: $element.text(),
          href: $element.attr('href')
        });
      });

      res.send(items);
    });
});

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});