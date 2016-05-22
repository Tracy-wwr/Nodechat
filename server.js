/**
 * Created by tracy on 16/5/22.
 */
//引入express模块
var express = require('express'),
    app = express(),
//创建一个服务器
    server = require('http').createServer(app);
    io = require('socket.io').listen(server);//引入socket.io模块并绑定到服务器
    users=[];//保存所有在线用户的昵称
    app.use('/', express.static(__dirname + '/app')); //指定静态HTML文件的位置
//监听8080端口
    server.listen(3000);
    console.log('server started');

//socket部分
    io.sockets.on('connection', function(socket) {
    //接收并处理客户端发送的foo事件
        socket.on('login', function(nickname) {
            if (users.indexOf(nickname) > -1) {
                socket.emit('nickExisted');
            } else {
                socket.userIndex = users.length;
                socket.nickname = nickname;
                users.push(nickname);
                socket.emit('loginSuccess');
                io.sockets.emit('system', nickname, users.length, 'login');//向所有连接到服务器的客户端发送当前登陆用户的昵称
            }
        });
        //断开连接的事件
        socket.on('disconnect', function() {
            //将断开连接的用户从users中删除
            users.splice(socket.userIndex, 1);
            //通知除自己以外的所有人
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        });
    });