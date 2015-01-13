m.css基于Pure.css修改，删除一些没用的，增加一些常用的，以便今后使用
m.js基于jQuery封装了一些常用的方法

### 安装

```sh
git clone git@github.com:houjiazong/m.git
cd mBasic
npm run init
```

### Build

```sh
gulp default
```
- 执行完毕后引用./dist/css/m.min.css及./dist/js/m.min.js即可

### 调试

```sh
gulp browser-sync
```
- 更改./src/*.html即可看到效果

m.css基于Pure.css更改，添加一些常用的，删除一些没用的。