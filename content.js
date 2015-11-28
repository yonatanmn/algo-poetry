//document.body.style.backgroundColor='blue';
console.log('content.js');



var port = chrome.runtime.connect({name:"mycontentscript"});

port.onMessage.addListener(function(message,sender){
  console.log(message);
});

var allNodes = document.querySelectorAll('*');
var list = Array.prototype.slice.call(allNodes,0);
var textList = list.map(function(a){return a.innerText});

port.postMessage({textList: textList});
