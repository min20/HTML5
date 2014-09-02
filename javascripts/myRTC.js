/*
 *  adapter.js에서 생성한 RTC 관련 함수/변수들을 사용한다.
 *  다음은 그 목록이다.
 *
 *      RTCPeerConnection     : 함수. peer와 peer를 연결해준다.
 *      getUserMedia          : 함수. 사용자의 기기로부터 데이터를 받는다.
 *      attachMediaStream     : 
 *      reattachMediaStream   : 
 *      webrtcDetectedBrowser : 현재 사용중인 브라우저 이름.
 *                              RTC를 지원하지 않으면 null이다.
 *      webrtcDetectedVersion : 현재 사용중인 브라우저의 버젼 숫자.
 *
 */


"use strict";

var initialize = function() {
	// exception 01. 웹 브라우저가 RTC를 지원하지 않는 경우
	if (webrtcDetectedBrowser == null) {
		// TODO 브라우저가 RTC를 지원하지 않음을 사용자에게 알려준다.
		// UI 작업이 대부분일 것.
		// 이후 다른 로직을 진행하지 않고 바로 종료되도록 한다.
		objUtil.appendClassName(document.querySelector("#support"), "no");

		return ;
	}

}

var objUtil = {
	getStyle: function (node, style) {
		 return window.getComputedStyle(node, null).getPropertyValue(style);
	},

	//Node에 className를 추가하는 함수
	appendClassName: function (node, strClassName) {
		// 기존에 className가 없던 경우
		if (node.className === "") {
			node.className = strClassName;
				return ;
		}

		// node에 className가 존재하는 경우
		if (node.className.toString().search(strClassName) !== -1) {
			return;
		}

		// 기존에 className가 있는 경우 공백문자를 추가하여 넣어줍니다
		node.className += " " + strClassName;
	},

	//Node에 특정 className을 제거하는 함수
	removeClassName: function (node, strClassName) {
		// 기존에 className가 없는 경우 함수를 종료합니다
		if (node.className === "") {
			return ;
		}

		// node에 className이 존재하고, target className 하나만 있는 경우
		if (node.className.length === strClassName.length) {
			node.className = "";
			return ;
		}

		// node에 className가 다수 존재하는 경우의 target className 삭제
		// node.className에 replace 결과물을 대입합니다.
		 node.className =
				node.className.replace(" " + strClassName, "").toString();
	}
}

