"use strict";

/**************************************************
 * UTILITIES
 *    string getStyle(eleNode, strStyle)
 *    void appendClassName(eleNode, strClassName)
 *    void removeClassName(eleNode, strClassName)
 *    string getBrowserPrefix()
 **************************************************/
var utils = {
	getStyle: function(eleNode, strStyle) {
		return window.getComputedStyle(eleNode).getPropertyValue(strStyle);
	},

	appendClassName: function(eleNode, strClassName) {
		if (eleNode == null) {
			console.log("appendClassName: Target node not found");
			return ;
		}
		if (typeof strClassName == "undefined"
				|| strClassName == null) {
			console.log("appendClassName: Missing className to append");
			return ;
		}

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
		if (eleNode == null) {
			console.log("removeClassName: Target node not found");
			return ;
		}

		if (typeof strClassName == "undefined"
				|| strClassName == null) {
			console.log("removeClassName: Missing className to remove");
			return ;
		}

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
	},

	getBrowserPrefix: function() {
		if (typeof document.body.style.webkitTransition !== "undefined") {
			return "webkit";
		} else if (typeof document.body.style.msTransition !== "undefined") {
			return "ms";
		} else if (typeof document.body.style.MozTransition !== "undefined") {
			return "moz";
		} else if (typeof document.body.style.oTransition !== "undefined") {
			return "o";
		} else {
			return "";
		}
	},
};


/**************************************************
 * MAIN
 **************************************************/

var isSuccessGetUserMedia;

function MyRTC() {
	this.webrtc;
	this.strBrowserPrefix;
	this.eleInputRoomName =
			document.querySelector("input[name=roomName]");
	this.eleJoinButton = document.querySelector("#inputRoomName button");

	this._init();
}

MyRTC.prototype = {
	_init: function() {
		if (this._checkBrowserSupport() === false) {
			var eleNotSupport = document.querySelector("#notSupport");

			utils.appendClassName(this.eleInputRoomName, "done");
			utils.appendClassName(eleNotSupport, "yes");

			return ;
		}

		this.strBrowserPrefix = utils.getBrowserPrefix();

		this.webrtc = new SimpleWebRTC({
			localVideoEl: "localVideo",
			remoteVideosEl: "remoteVideos",
			autoRequestMedia: false
		});

		this._initEvents();
	},

	_initEvents: function() {
		this.eleJoinButton.addEventListener("click", function() {
			console.log("chatRoomName: " + this.eleInputRoomName.value);
			this.webrtc.on("readyToCall", function () {
				this.webrtc.joinRoom(this.eleInputRoomName.value);
			}.bind(this));
			this.webrtc.startLocalVideo();
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

function successGetUserMedia() {
	if (typeof isSuccessGetUserMedia == "undefined"
			|| isSuccessGetUserMedia == false) {
		return;
	}

	utils.appendClassName(document.querySelector("#inputRoomName"), "done");
	utils.appendClassName(document.querySelector("#call"), "on");
}

