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
    port.onMessage.addListener(function (message, sender) {
      listOfSentences = processPage(message.textList);
    });
  });

  var buttonElement = document.getElementById('button');
  buttonElement.addEventListener('click', handleCreatePoemClick);

  //var divs = document.querySelectorAll('div');
  //for (var i = 0; i < divs.length; i++) {
  //  divs[i].addEventListener('click', click);
  //}
});

function handleCreatePoemClick() {
  console.log('click');

  var poem = createPoem(listOfSentences);
  console.log(poem);
  var poemElement = document.getElementById('poem');
  poemElement.innerText = poem;
}




