/**
 * Created by tracy on 16/5/22.
 */
//定义了整个程序需要使用的类NodeChat，之后处理消息显示消息等所有业务逻辑均写在这个类里
window.onload = function() {
    //实例并初始化程序
    var nodechat = new NodeChat();
    nodechat.init();
};

//定义nodechat类
var NodeChat = function() {
    this.socket = null;
};

//向原型添加业务方法
NodeChat.prototype = {
    init: function() {//此方法初始化程序
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', function() {
            //连接到服务器后，显示昵称输入框
            document.getElementById('wrapper_login').style.display = 'block';
            document.getElementById('input_name').focus();
        });
        this.socket.on('nickExisted', function() {
            document.getElementById('hint').textContent = '昵称被占用啦，请换一个吧~'; //显示昵称被占用的提示
        });
        this.socket.on('loginSuccess', function() {
            document.title = 'nodechat | ' + document.getElementById('input_name').value;
            document.getElementById('wrapper_chat').style.display = 'block';
            document.getElementById('wrapper_login').style.display = 'none';//隐藏遮罩层显聊天界面
            document.getElementById('input_msg').focus();//让消息输入框获得焦点
        });
        this.socket.on('system', function(nickName, userCount, type) {
            //判断用户是连接还是离开以显示不同的信息
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            var p = document.createElement('h2');
            p.textContent = msg;
            document.getElementById('historyMsg').appendChild(p);
            //将在线人数显示到页面顶部
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
        //昵称设置的确定按钮
        document.getElementById('btn_login').addEventListener('click', function() {
            var nickName = document.getElementById('input_name').value;
            //检查昵称输入框是否为空
            if (nickName.trim().length != 0) {
                //不为空，则发起一个login事件并将输入的昵称发送到服务器
                that.socket.emit('login', nickName);
            } else {
                //否则输入框获得焦点
                document.getElementById('input_name').focus();
            };
        }, false);
    }
};