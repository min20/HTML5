"use strict";

/**************************************************
 * MAIN
 **************************************************/
function MyRTC() {
	if (isBrowserSupport() === false) {
		appendClassName(document.querySelector("#support"), "no");

		return ;
	}
	appendClassName(document.querySelector("#main"), "okay");

	this.webrtc = new SimpleWebRTC({
		localVideoEl: "localVideo",
		remoteVideosEl: "remoteVideo",
		autoRequestMedia: true
	});

	while (typeof this.strChatRoomName == "undefined"
			|| this.strChatRoomName == null) {
		// 방 이름 입력받는 로직
		this.setChatRoomName(prompt("들어갈 방 이름?"));
	}

	this.webrtc.on("readyToCall", function () {
		this.webrtc.joinRoom(this.strChatRoomName);
	}.bind(this));
}

MyRTC.prototype.setChatRoomName = function(strChatRoomName) {
	this.strChatRoomName = strChatRoomName;
}

MyRTC.prototype.getChatRoomName = function() {
	return this.strChatRoomName;
}


/**************************************************
 * UTILITIES
 *    string getStyle(eleNode, strStyle)
 *    void appendClassName(eleNode, strClassName)
 *    void removeClassName(eleNode, strClassName)
 *    boolean isBrowserSupport()
 **************************************************/
function getStyle(eleNode, strStyle) {
	return window.getComputedStyle(eleNode).getPropertyValue(strStyle);
}

function appendClassName(eleNode, strClassName) {
	// 기존에 className가 없던 경우
	if (eleNode.className === "") {
		eleNode.className = strClassName;
		return ;
	}

	// eleNode에 className가 존재하는 경우
	if (eleNode.className.toString().search(strClassName) !== -1) {
		return;
	}

	// 기존에 className가 있는 경우 공백문자를 추가하여 넣어줍니다
	eleNode.className += " " + strClassName;
}

function removeClassName(eleNode, strClassName) {
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

function isBrowserSupport() {
	// exception 01. 웹 브라우저가 RTC를 지원하지 않는 경우
	if (typeof navigator.webkitGetUserMedia == "undefined" &&
			typeof navigator.mozGetUserMedia == "undefined" &&
			typeof navigator.getUserMedia == "undefined") {
		return false;
	}

	return true;
}

