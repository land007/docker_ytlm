// status fields and start button in UI
// subscription key and region for speech services.
var authorizationToken;
var SpeechSDK;
var recognizer;
var IndexedDBManager = (function() {
  var db = null;
  var dbName = 'myDatabase';
  var dbVersion = 1;

  var openDB = function() {
    return new Promise(function(resolve, reject) {
      var openRequest = indexedDB.open(dbName, dbVersion);

      openRequest.onupgradeneeded = function(event) {
        db = event.target.result;
        db.createObjectStore('myObjectStore');
      };

      openRequest.onsuccess = function(event) {
        db = event.target.result;
        resolve();
      };

      openRequest.onerror = function(event) {
        console.log('打开数据库失败：', event.target.error);
        reject(event.target.error);
      };
    });
  };

  var saveData = function(key, data) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['myObjectStore'], 'readwrite');
      var objectStore = transaction.objectStore('myObjectStore');

      var request = objectStore.put(data, key);
      request.onsuccess = function(event) {
        resolve();
      };

      request.onerror = function(event) {
        console.log('存储失败：', event.target.error);
        reject(event.target.error);
      };
    });
  };

  var getData = function(key) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['myObjectStore'], 'readonly');
      var objectStore = transaction.objectStore('myObjectStore');

      var request = objectStore.get(key);
      request.onsuccess = function(event) {
        var data = event.target.result;
        resolve(data);
      };

      request.onerror = function(event) {
        console.log('查询失败：', event.target.error);
        reject(event.target.error);
      };
    });
  };

  var deleteData = function(key) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['myObjectStore'], 'readwrite');
      var objectStore = transaction.objectStore('myObjectStore');

      var request = objectStore.delete(key);
      request.onsuccess = function(event) {
        resolve();
      };

      request.onerror = function(event) {
        console.log('删除失败：', event.target.error);
        reject(event.target.error);
      };
    });
  };

  return {
    saveDataToIndexedDB: async function(key, data) {
      await openDB();
      await saveData(key, data);
    },

    getDataFromIndexedDB: async function(key) {
      await openDB();
      return await getData(key);
    },

    deleteDataFromIndexedDB: async function(key) {
      await openDB();
      await deleteData(key);
    }
  };
})();

// async function testIndexedDBManager() {
//   try {
//     // 存储数据到 IndexedDB
//     await IndexedDBManager.saveDataToIndexedDB('myKey', { foo: 'bar' });
//     console.log('数据存储成功');

//     // 从 IndexedDB 获取数据
//     const data = await IndexedDBManager.getDataFromIndexedDB('myKey');
//     if (data) {
//       console.log('从 IndexedDB 获取到的数据：', data);
//     } else {
//       console.log('在 IndexedDB 中找不到指定的数据');
//     }

//     // 从 IndexedDB 删除数据
//     await IndexedDBManager.deleteDataFromIndexedDB('myKey');
//     console.log('数据删除成功');
//   } catch (error) {
//     console.log('发生错误：', error);
//   }
// }

// testIndexedDBManager();


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
var old_speak = undefined;
var old_speak_timeout = undefined;
var play_loop = function(speak) {
	if(recognizer === undefined) {
		return;
	}
//	console.log('i=' + i + ' signal1.state=' + signal1.state + ' signal2.state=' + signal2.state + ' speak=' + speak + ' speak_list=' + JSON.stringify(speak_list));
	if(speak === undefined || speak == '') {
		return;
	}
	if(speak != null) {
		speak = speak.replace(/<[^>]+>/g, ' ');
	}
//	console.log('speak', speak);
	if(speak != null) {
		if(old_speak !== undefined && old_speak == speak) {
//			console.log('阻断');
			return;
		} else {
			clearTimeout(old_speak_timeout)
			old_speak = speak;
			old_speak_timeout = setTimeout(() => {
//				console.log('清空');
				old_speak = undefined;;
			}, 2000);
		}
	}
	if(signal1.state == 'play' && signal2.state == 'play') {
//		console.log('缓存');
		speak_list.unshift(speak);
		return;
	}
	if(speak == null) {
//		console.log('取缓存');
		speak = speak_list.pop();
	}
//	console.log('播放');
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
//		console.log('i++');
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
var getDef = async function(a) {
  var data = await loadFromLocalStorage();
  a(data);
};
var demo_ret;
var getDemoProject = function() {
	return demo_ret;
};
var setDemoProject = async function(ret) {
  demo_ret = ret;
  try {
    await saveInLocalStorage(demo_ret);
    window.location.href = window.location.href;
  } catch (error) {
    console.log('存储数据到 IndexedDB 出错：', error);
  }
};

var localStorageKey = getQueryVariable('name')? getQueryVariable('name'): 'global';
var room = localStorageKey;//'global';//cached
var options = {
    rememberUpgrade:true,
    transports: ['websocket'],
    secure:true,
    rejectUnauthorized: false
}
var socket = io('',options);
// socket.on('event_name', function(msg){
//     console.log('msg', msg);
// });
socket.on('chat message', function(g){
    console.log('msg', g);
    mindColla.callback_io(g);
});
// socket.on('chat message', function(msg){
//     console.log('msg', msg);
// });
socket.on('get room', function (data) {
    console.log('get room：' + JSON.stringify(data));
    socket.emit('subscribe', { room: room });
});
var loadFromLocalStorage = async function() {
  try {
    var ret = await IndexedDBManager.getDataFromIndexedDB(localStorageKey);
    console.log('ret', ret);
    if (!ret) {
      ret = await jsonp('./users/' + localStorageKey);
      await IndexedDBManager.saveDataToIndexedDB(localStorageKey, ret);
      window.location.href = window.location.href;
    }
    return ret;
  } catch (error) {
    console.log('获取数据出错：', error);
    return null;
  }
};
const delay = (ms)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
};
//C:\Users\【用户名】\AppData\Local\【nw应用名称】\User Data\Default\Local Storage\chrome-extension_【随机字符】_0.localstorage
var saveInLocalStorage = async function(ret) {
    try {
      await IndexedDBManager.saveDataToIndexedDB(localStorageKey, ret);
    } catch (error) {
      console.log('存储数据到 IndexedDB 出错：', error);
    }
};
var saveBakInLocalStorage = async function() {
    let ret = await IndexedDBManager.getDataFromIndexedDB(localStorageKey);
    IndexedDBManager.saveDataToIndexedDB(localStorageKey+'_bak', ret);
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
var updateLocalStorage = async function() {
  var data = await loadFromLocalStorage();
  try {
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
  } catch (error) {
    // console.log(error);
    alert('你的网络开小差了，请稍后再试。');
  }
};
var refreshLocalStorage = async function() {
  if (confirm('警告！！！如果点击确认会丢失当前修改。')) {
    saveBakInLocalStorage();
    try {
      var data = await jsonp('./users/' + localStorageKey);
      await saveInLocalStorage(data);
      window.location.href = window.location.href;
    } catch (error) {
      console.log('请求数据出错：', error);
    }
  }
};
var HREF = window.location.href;
var HREF_INDEX = HREF.lastIndexOf('?');
if(HREF_INDEX > 0) {
	HREF = HREF.substring(0,HREF.lastIndexOf('?'));
}
$(function(){
	var keys = Object.keys(localStorage);
	var mind_caidan = $("#mind_caidan")[0];
	for(let k in keys) {
		var key = keys[k];
		var newNode = document.createElement("div");
		newNode.innerHTML = '<div tit="btn_clone" class="dropdown-item" onclick="window.location.href=\'' + HREF + '?name=' + key + '\';">\
				<span class="mind-icons" onclick="if(confirm(\'你确定要删除吗？\')){localStorage.removeItem(\'' + key + '\');window.location.href=\'' + HREF + '\';};window.event? window.event.cancelBubble = true : e.stopPropagation();">&#x2718;</span>' + decodeURI(key) + '\
			</div>';
		mind_caidan.appendChild(newNode);
	}
});
var onClickCtrl = false;
var onClickCtrlTimeout = undefined;
window.onload = function () {
    /**
        * 键盘事件不能绑定div，一般绑定给容易获取焦点的对象 eg：input
        * onkeydown
        *      - 按下按键,如果一直按着会一直触发
        *      - 连续触发时，第一次和第二次间隔稍微长，以后就非常快
        * onkeyup  松开按键，只会触发一次
        */
    document.onkeydown = function (event) {
        event = event || window.event;
        /**
            * 通过keyCode属性返回的ASCII编码来判断按下的按键，注意区分大小写
            * 事件单独提供了ctrlkey shiftkey altkey 用来判断ctrl、shift、alt是否被按下，
            * 被按下时返回true
            */
        if (event.ctrlKey) {
            // console.log("我按下了ctrl");
            onClickCtrl = true;
            if(onClickCtrlTimeout) {
                clearTimeout(onClickCtrlTimeout);
            }
            onClickCtrlTimeout = setTimeout(function() {
                onClickCtrl = false;
                onClickCtrlTimeout = undefined;
                // console.log("我松开了ctrl");
            }, 1000);
        }
        //if (event.keyCode ===  89 && event.altKey){
        //    console.log("我按下了y和 Alt")
        //}
        //当文本框返回一个return false 取消默认行为时，文本框不再显示输入内容
        /* *
        *test.onkeydown = function () {
        *  return false;
        * };
        */
    };
};
