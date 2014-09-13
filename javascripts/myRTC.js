"use strict";

/**************************************************
 * UTILITIES
 *    string getStyle(eleNode, strStyle)
 *    void appendClassName(eleNode, strClassName)
 *    void removeClassName(eleNode, strClassName)
 **************************************************/
var utils = {
	getStyle: function(eleNode, strStyle) {
		return window.getComputedStyle(eleNode).getPropertyValue(strStyle);
	},

	appendClassName: function(eleNode, strClassName) {
		// 기존에 className가 없던 경우
		if (eleNode.className === "") {
			eleNode.className = strClassName;
			return ;
		}

		// eleNode에 className가 존재하는 경우
		if (eleNode.className.toString().search(strClassName) !== -1) {
			return ;
		}

		// 기존에 className가 있는 경우 공백문자를 추가하여 넣어줍니다
		eleNode.className += " " + strClassName;
	},

	removeClassName: function(eleNode, strClassName) {
		// 기존에 className가 없는 경우 함수를 종료합니다
		if (eleNode.className === "") {
			return ;
		}

		// eleNode에 className이 존재하고, target className 하나만 있는 경우
		if (eleNode.className.length === strClassName.length) {
			eleNode.className = "";
			return ;
		}

		// eleNode에 className가 다수 존재하는 경우의 target className 삭제
		// eleNode.className에 replace 결과물을 대입합니다.
		eleNode.className =
			eleNode.className.replace(" " + strClassName, "").toString();
	}

};


/**************************************************
 * MAIN
 **************************************************/

var isSuccessGetUserMedia;

function MyRTC() {
	this.webrtc;
	this.elePermissionButton =
			document.querySelector("#requestPermission button");
	this.eleInputChatRoomName =
			document.querySelector("input[name=chatRoomName]");
	this.eleJoinButton = document.querySelector("#chatRoomName button");
	this.chatRoomName;

	this._init();

/*
	eleJoinButton.addEventListener("click", function() {
		getChatRoomName()
	}.bind(this));

	var getChatRoomName = function(strChatRoomName) {
		this.webrtc.on("readyToCall", function () {
			this.webrtc.joinRoom(eleInputChatRoomName.value);
		}.bind(this));
	}
*/
}

MyRTC.prototype = {
	_init: function() {
		if (this._checkBrowserSupport() === false) {
			var eleNotSupport = document.querySelector("#notSupport");
			utils.appendClassName(eleNotSupport, "yes");

			return ;
		}

		this.webrtc = new SimpleWebRTC({
			localVideoEl: "localVideo",
			remoteVideosEl: "remoteVideos",
			autoRequestMedia: false
		});

		this._initEvents();
	},

	_initEvents: function() {
		this.elePermissionButton.addEventListener("click", function() {
			this.webrtc.startLocalVideo();
		}.bind(this));

		this.eleJoinButton.addEventListener("click", function() {
			this.chatRoomName = this.eleInputChatRoomName.value;
			console.log("chatRoomName: " + this.chatRoomName);
		}.bind(this));
	},

	_checkBrowserSupport: function() {
		if (typeof navigator.webkitGetUserMedia == "undefined" &&
				typeof navigator.mozGetUserMedia == "undefined" &&
				typeof navigator.getUserMedia == "undefined") {
			return false;
		}

		return true;
	}

};

function acceptGetUserMedia() {
	if (typeof isSuccessGetUserMedia == "undefined"
			|| isSuccessGetUserMedia == false) {
		return;
	}

	utils.appendClassName(document.querySelector("#requestPermission"), "pass");
	utils.appendClassName(document.querySelector("#main"), "do");
}


