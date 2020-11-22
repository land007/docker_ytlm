// status fields and start button in UI
// subscription key and region for speech services.
var authorizationToken;
var SpeechSDK;
var recognizer;
var getQueryVariable = function(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
	   var pair = vars[i].split("=");
	   if(pair[0] == variable){return pair[1];}
   }
   return(false);
};
var startRecognize = function () {
  speechConfig = SpeechSDK.SpeechConfig.fromSubscription("6e83631f53fb4a07b0cde7cf8fab0b26", "westus");
  //speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.speechRecognitionLanguage = "zh-CN";
  var audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
	recognizer.recognized = (r, event) => {
	  console.log(event);
	  if(event.privResult.privText) {
//			phraseDiv.innerHTML += event.privResult.privText;
		console.log(event.privResult.privText);
		if(event.privResult.privText.length > 0) {
			var text = event.privResult.privText.substring(0, event.privResult.privText.length - 1);
			play_loop(text);
			if(text != '下一个') {
				$(".search-input")[0].value = text;
			}
			Outline.controller.search(text, Outline.controller, true);
		}
	  }
	};
	//弹出大纲
	recognizer.startContinuousRecognitionAsync();
	$(".mind-corner.left").showCorner({
        type: "outline",
        pos: "left"
    });
	mindUI.loadOutline();
};
document.addEventListener("DOMContentLoaded", function () {
  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
  }
});
//语音
var speak_list = [];
let signal1 = new Signal('end');
let signal2 = new Signal('end');
var audio1;
var audio2;
var i = 0;
var play_loop = function(speak) {
	console.log('i=' + i + ' signal1.state=' + signal1.state + ' signal2.state=' + signal2.state + ' speak=' + speak + ' speak_list=' + JSON.stringify(speak_list));
	if(speak === undefined || speak == '') {
		return;
	}
	if(speak != null) {
		speak = speak.replace(/<[^>]+>/g, ' ');
	}
	if(signal1.state == 'play' && signal2.state == 'play') {
		speak_list.unshift(speak);
		return;
	}
	if(speak == null) {
		speak = speak_list.pop();
	}
	if(!(speak === undefined || speak == null || speak == '')) {
		if(audio1 === undefined) {
			audio1 = document.getElementById("audioId1");
			audio1.addEventListener("ended",function(){  
			    signal1.state = 'end';
			    play_loop(null);
			});
			audio1.addEventListener("error", function () {
				signal1.state = 'end';
		        console.log("event error1: " + (new Date()).getTime());
		    });
		}
		if(audio2 === undefined) {
			audio2 = document.getElementById("audioId2");
			audio2.addEventListener("ended",function(){  
			    signal2.state = 'end';
			    play_loop(null);
			});
			audio2.addEventListener("error", function () {
				signal2.state = 'end';
		        console.log("event error2: " + (new Date()).getTime());
		    });
		}
		if(i%2 == 0) {
			let a1 = async function(audio1, signal2, speak) {
				if(signal2.state != 'end') {
					await signal2.until('end');
				}
				try {
					audio1.play();
				} catch(e) {
    				signal1.state = 'end';
    		        console.log("event play1: " + (new Date()).getTime());
    			}
			};
			try {
    			signal1.state = 'play';
    			audio1.src = 'https://speech.qhkly.com/v1/Speech?text=' + encodeURIComponent(speak) + '&lang=zh-CN&type=HuihuiRUS';
			} catch(e) {
				signal1.state = 'end';
		        console.log("event src1: " + (new Date()).getTime());
			}
			a1(audio1, signal2, speak);
//    	 		signal1 = new Signal('end');
		} else {
			let a2 = async function() {
				if(signal1.state != 'end') {
					await signal1.until('end');
				}
				try {
					audio2.play();
				} catch(e) {
    				signal2.state = 'end';
    		        console.log("event play2: " + (new Date()).getTime());
    			}
			};
			try {
    			signal2.state = 'play';
    			audio2.src = 'https://speech.qhkly.com/v1/Speech?text=' + encodeURIComponent(speak) + '&lang=zh-CN&type=HuihuiRUS';
			} catch(e) {
				signal2.state = 'end';
		        console.log("event src2: " + (new Date()).getTime());
			}
			a2(signal1);
//    	 		signal2 = new Signal('end');
		}
		i++;
		console.log('i++');
	}
};
var mind = null, hash = window.location.hash, chartId = "5def526fe4b0dba2615703d9", tutorial = true, chartTitle = "数据中心部署清单", teamId = "", orgId = "", collaRole = "editor";
var userId = "59118983e4b0f320c44f53ef", userName = "admin", fullName = "admin";
var isOpenColl2Owner = "true";
var isOpenShare2Owner = "true";
var isOpenPublish2Owner = "true";
var isOpenClone2Owner = "true";
var showCanvas = "false";
var exit = function() {
	if(confirm('你确定关闭窗口吗?')) {
		var win = nw.Window.get();
		win.close(); 
	}
};
var minimize = function() {
	var win = nw.Window.get();
	win.minimize();//会闪烁重新加载
};
var empty = function() {
	
};
var loadFile = function(fileName, content) {
	var aLink = document.createElement('a');
	var blob = new Blob([content], {
	    type: 'text/plain'
	 });
	var evt = new Event('click');
	aLink.download = fileName;
	aLink.href = URL.createObjectURL(blob);
	aLink.click();
	URL.revokeObjectURL(blob);
};
var getDef = function(a) {
	a(loadFromLocalStorage());
};
var demo_ret;
var getDemoProject = function() {
	return demo_ret;
};
var setDemoProject = function(ret) {
	demo_ret = ret;
    saveInLocalStorage(demo_ret);
    window.location.href = window.location.href;
};
var localStorageKey = getQueryVariable('name')? getQueryVariable('name'): 'global';
var loadFromLocalStorage =  function() {
	var ret;
	if (localStorage) {
		if (localStorage.getItem(localStorageKey)) {
			try {
				ret = JSON.parse(localStorage.getItem(localStorageKey));
				console.log('ret', ret);
			}catch(e) {
			}
		}
	}
//	alert(JSON.stringify(ret));
	if (!ret) {
//		ret = getDemoProject();
		 jsonp('./users/' + localStorageKey).then(function(data) {
//   		  console.log(data);
   		  saveInLocalStorage(data);
   		  window.location.href = window.location.href;
   	  });
	}
	return ret;
};
//C:\Users\【用户名】\AppData\Local\【nw应用名称】\User Data\Default\Local Storage\chrome-extension_【随机字符】_0.localstorage
var saveInLocalStorage = function(ret, callback) {
	if (localStorage) {
		localStorage.setItem(localStorageKey, JSON.stringify(ret));
		if(callback) {
			callback();
		}
	}
};
//var jsonp = function(url) {
//  var o = document.createElement("script"); 
//  o.src=url;
//  o.type="text/javascript";
//  document.body.appendChild(o);       
//};
var jsonp = function (uri) {
    return new Promise(function(resolve, reject) {
        var id = '_' + Math.round(10000 * Math.random());
//        var callbackName = 'jsonp_callback_' + id;
        var callbackName = 'jsonp_callback_';
        window[callbackName] = function(data) {
            delete window[callbackName];
            var ele = document.getElementById(id);
            ele.parentNode.removeChild(ele);
            resolve(data);
        }
        var src = uri + '?callback=' + callbackName;
        var script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.addEventListener('error', reject);
        (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
    });
};
var updateLocalStorage = function () {
  var data = loadFromLocalStorage();
//  alert(JSON.stringify(data));
  (async () => {
	  const rawResponse = await fetch('./users/' + localStorageKey, {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(data)
	  });
	  const content = await rawResponse.json();
	  alert('保存成功！');
	  console.log(content);
	})();
};
var refreshLocalStorage = function () {
	 jsonp('./users/' + localStorageKey).then(function(data) {
//		  console.log(data);
		  saveInLocalStorage(data);
		  window.location.href = window.location.href;
	  });
};
$(function(){
	var keys = Object.keys(localStorage);
	var mind_caidan = $("#mind_caidan")[0];
	for(let k in keys) {
		var key = keys[k];
		var newNode = document.createElement("div");
		newNode.innerHTML = '<div tit="btn_clone" class="dropdown-item" onclick="window.location.href=\'/?name=' + key + '\';">\
				<span class="mind-icons" onclick="if(confirm(\'你确定要删除吗？\')){localStorage.removeItem(\'' + key + '\');window.location.href=\'/\';};window.event? window.event.cancelBubble = true : e.stopPropagation();">&#x2718;</span>' + decodeURI(key) + '\
			</div>';
		mind_caidan.appendChild(newNode);
	}
});
