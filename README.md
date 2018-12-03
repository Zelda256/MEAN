**安装依赖**：
1. `npm i`
2. `bower i`  /* 需全局安装bower: `npm i bower -g`*/

</br> 
**运行程序**：
`node server`

</br> 
**运行Express测试用例**：
- windows环境
1. `set NODE_ENV=test`
2. `mocha --reporter spec app/tests`

- linux环境
`NODE_ENV=test mocha --reporter spec app/tests`

**运行Angular测试用例**：
- windows环境
1. `npm i karma-cli -g`
2. `set NODE_ENV=test`
3. `karma start`

- linux环境
1. `npm i karma-cli -g`
2. `NODE_ENV=test karma start`