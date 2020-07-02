# 使用方法

+   需要 mongodb

    ```shell
    sudo apt install mongodb
    ```

    然后需要配置一下mongodb. 

    需要添加 web 数据库， 再里面添加 `users`, `tasks`, `pictures`, `scores`, 四个集合

+   需要 bower 来安装 bootstrap 和 jquery

    ```shell
    npm install bower 
    bower install jquery
    bower install bootstrap
    ```

    这样就可以把 jquery 和 bootstrap 安装进 `/public/bower/` 目录里了

准备工作完成后， 进行 `npm install` 安装其余模块。 

最后， 在 `public` 文件夹下建立 `pictures` 和 `resource` 两个文件夹。 


```shell
node index.js
```

即可启动程序
