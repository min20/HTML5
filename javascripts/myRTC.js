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

	hasClassName: function(eleNode, strClassName) {
		if (eleNode == null) {
			console.log("Target node not found");
			return false;
		}

		if (typeof strClassName == "undefined"
				|| strClassName == null) {
			console.log("Missing className to search");
			return false;
		}

		// 기존에 className가 없는 경우 함수를 종료합니다
		if (eleNode.className === "") {
			return false;
		}

		if (eleNode.className.toString().search(strClassName) !== -1) {
			return true;
		}
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
	this.strAnimationEnd;

	// #notSupport
	this.eleSupport = document.querySelector("#support");

	// #inputRoomName *
	this.eleRoomName = document.querySelector("#roomName");
	this.eleJoinButton = this.eleRoomName.querySelector("button");

	this.strRoomName;

	// #call, #call *
	this.eleCall = document.querySelector("#call");
	this.eleEndButton = document.querySelector("#call button");

	this._init();
}

MyRTC.prototype = {
	_init: function() {
		if (this._checkBrowserSupport() === false) {
			utils.appendClassName(this.eleRoomName, "done");
			utils.appendClassName(this.eleSupport, "no");

			return ;
		}

		this.webrtc = new SimpleWebRTC({
			localVideoEl: "localVideo",
			remoteVideosEl: "remoteVideos",
			autoRequestMedia: false
		});

		this.strAnimationEnd = this._getAnimationEndWithPrefix();

		this._initEvents();
	},

	_initEvents: function() {
		this.eleJoinButton.addEventListener("click", function() {
			var isInit = false;
			if (typeof this.strRoomName == "undefined") {
				isInit = true;
			}

			this.strRoomName =
					this.eleRoomName.querySelector("input[name=roomName]")
					.value;
			console.log("chatRoomName: " + this.strRoomName);

			this.webrtc.on("readyToCall", function () {
				this.webrtc.joinRoom(this.strRoomName);
			}.bind(this));

			if (isInit) {
				this.webrtc.startLocalVideo();
				utils.appendClassName(this.eleCall, "init");
			} else {
				utils.removeClassName(this.eleCall, "disconnected");
				utils.appendClassName(this.eleCall, "waiting");
			}

			utils.appendClassName(this.eleRoomName, "done");

		}.bind(this));

		this.eleCall.addEventListener(this.strAnimationEnd, function() {
			utils.removeClassName(this.eleCall, "init");
			utils.appendClassName(this.eleCall, "waiting");
		}.bind(this));

		this.eleEndButton.addEventListener("click", function() {
			this.webrtc.leaveRoom();
			utils.removeClassName(this.eleRoomName, "done");
			utils.removeClassName(this.eleCall,
					utils.hasClassName(this.eleCall, "waiting") ?
						"waiting" : "connected");
			utils.appendClassName(this.eleCall, "disconnected");
		}.bind(this));
	},

	_checkBrowserSupport: function() {
		if (typeof navigator.webkitGetUserMedia == "undefined" &&
				typeof navigator.mozGetUserMedia == "undefined" &&
				typeof navigator.getUserMedia == "undefined") {
			return false;
		}

		return true;
	},

	_getAnimationEndWithPrefix: function() {
		var strAnimationEnd = "AnimationEnd";
		var strBrowserPrefix = utils.getBrowserPrefix();

		return strBrowserPrefix === "" ?
			strAnimationEnd.toLower() : strBrowserPrefix + strAnimationEnd;
	}
};

function errorGetUserMedia() {
	console.log("getUserMedia() 실패");
	// TODO 권한에 대해 알려주는 UI 만들기
}

