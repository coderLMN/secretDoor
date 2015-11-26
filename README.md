# secretDoor
An anonymous bulletin board node.js app hosted on Heroku

这是个最简单的树洞 (完全匿名的讨论区，后台数据库只保存输入的文字，一次最多能写256个字)，前端原生 JS + HTML + CSS，后端 Node.js + MongoDB，源代码在 Github 上，然后从 Github 直接自动布署到 Heroku 云平台。代码少，设置少，超简单，超省事。

server.js 是后端服务的 Node.js 程序，前端代码都在 public/index.html 里，核心代码就是这俩文件了。另外，package.json 是 Node.js 配置文件，Procfile 是布署到 Heroku 上需要的配置文件。

你可以下载所有代码，然后在自己的电脑上启动一个 MongoDB 服务，就可以把它作为一个 Node.js 项目来运行了。
