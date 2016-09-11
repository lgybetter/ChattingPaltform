$(function(){
	var socket = io();
	var $logPage = $('.logPage');
	var $logList = $('.logList');
	var $chatPage = $('.chatPage');
	var $messageContent = $('.messageContent');
	var $messageList = $('.messageList');
	var $messageInput = $('.messageInput');
	var $usernameInput = $('.usernameInput');
	var $sendMessage = $('.sendMessage');
	var $addUser = $('.addUser');
	var $loginPage = $('.loginPage');
	var $messageInputBar = $('.messageInputBar');
	var $currentInput = $usernameInput.focus();

	var userName;
	var connect = false;

	$addUser.click(function(event) {
		/* Act on the event */
		userName = $usernameInput.val().trim();
		if (userName) {
      $loginPage.fadeOut();
      $chatPage.show();
      $messageInputBar.show();
      $loginPage.off('click');
      $currentInput = $messageInput.focus();
      // Tell the server your username
      socket.emit('add user', userName);
    }
	});

	function userLogin(data) {
		//登陆成功，输出信息
		connect = true;
		$logList.empty();
		$logList.append('<li><p>Name: ' + data.userName + ' is joined</p><li>');
		$logList.append('<li><p>CurrentNumber: ' + data.usersNumber + '</p></li>');
	}

	function addNewMessage(data,state) {
		if(state == 1) {
$messageList.append(
			'<div class="aui-chat-item aui-chat-right"><div class="aui-chat-inner"><div class="aui-chat-name">' + data.userName +'</div><div class="aui-chat-content">'+data.message+'</div></div></div>');
		}else {
			$messageList.append(
			'<div class="aui-chat-item aui-chat-left"><div class="aui-chat-inner"><div class="aui-chat-name">' + data.userName +'</div><div class="aui-chat-content">'+data.message+'</div></div></div>');
		}
	}

	function newUserJoin(data) {
		$logList.empty();
		$logList.append('<li><p>Name: ' + data.userName + ' is joined</p></li>');
		$logList.append('<li><p>CurrentNumber: ' + data.usersNumber + '</p></li>');
	}

	function userLeft(data) {
		$logList.empty();
		$logList.append('<li><p>User: ' + data.userName + ' has left</p><li>');
		$logList.append('<li><p>CurrentNumber: ' + data.usersNumber + '</p></li>');
	}

	$sendMessage.click(function(event) {
		/* Act on the event */
		var message = $messageInput.val();
		if (message && connect) {
      $messageInput.val('');
      addNewMessage({
        userName: userName,
        message: message
      },1);
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
	});	


	socket.on('new message',function(data) {
		addNewMessage(data,2);
	});

	socket.on('login',function(data) {
		userLogin(data);
	});

	socket.on('new user join',function(data) {
		newUserJoin(data);
	});

	socket.on('user left',function(data){
		userLeft(data);
	});

});