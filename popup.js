// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

console.log('popup.js');


var listOfSentences;

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded');
  chrome.tabs.executeScript(
      null,
      {file: 'content.js'}
  );

  chrome.runtime.onConnect.addListener(function (port) {
    //port.postMessage({greeting:"hello"});
    port.onMessage.addListener(function (message, sender) {
      //console.log(processPage);
      listOfSentences = processPage(message.textList);


      //window.textList = textList;
      //window.poem = poem;
      //console.log(poem);

    });
  });


  //var port = chrome.runtime.connect({name:"popup-port"});

  //port.onMessage.addListener(function(message,sender){
  //  console.log(message);
  //});


  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});

function click() {
  console.log('click');

  var poem = createPoem(listOfSentences);
  console.log(poem);

}


function createPoem(list) {

  function takeRandItemFromArray(arr) {
    return arr[arr.length * Math.random() << 0]
  }

  function takeRandProp(obj) {
    return takeRandItemFromArray(R.keys(obj));
  }


  var rhymes = R.range(0, 7);
  for (var i = 0; i < rhymes.length; i++) {
    var rhyme = takeRandProp(list);
    while (R.contains(rhyme, rhymes)) {
      rhyme = takeRandProp(list);
    }
    rhymes[i] = rhyme
  }


  function takePropByIndex(obj, i) {
    return obj[R.nth(i)(R.keys(obj))]
  }

  function wordFromListByIndexAndRhyme(rhyme, i) {
    return takePropByIndex(list[rhymes[rhyme]], i)[0].str
  }

  //a-b-a-b, c-d-c-d, e-f-e-f, g-g
  //0-1-0-1, 2-3-2-3, 4-5-4-5, 6-6
  var sonnet = [
    wordFromListByIndexAndRhyme(0, 0),
    wordFromListByIndexAndRhyme(1, 0),
    wordFromListByIndexAndRhyme(0, 1),
    wordFromListByIndexAndRhyme(1, 1),
    wordFromListByIndexAndRhyme(2, 0),
    wordFromListByIndexAndRhyme(3, 0),
    wordFromListByIndexAndRhyme(2, 1),
    wordFromListByIndexAndRhyme(3, 1),
    wordFromListByIndexAndRhyme(4, 0),
    wordFromListByIndexAndRhyme(5, 0),
    wordFromListByIndexAndRhyme(4, 1),
    wordFromListByIndexAndRhyme(5, 1),
    wordFromListByIndexAndRhyme(6, 0),
    wordFromListByIndexAndRhyme(6, 1)
  ];

  return sonnet.join("\n");

}

