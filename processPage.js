var processPage = function (textList) {

  var filterEmpty = R.filter(R.compose(R.not,R.isEmpty));
  var emptyAndUnique = R.compose(filterEmpty,R.uniq);

  var newLineChar = String.fromCharCode(10);
  var dotChar = '.';
  var splitterByCharFunc = function(char){return function(a,b){return a.concat(R.split(char,b));};};

  //var newLineSplitter = function(a,b){return a.concat(R.split(newLineChar,b));};
  var listTolistSplitedWithChar = function (char) {return R.reduce(splitterByCharFunc(char),[]); };
  //var listToListSplittedWhenNewLine = R.reduce(splitterFunc(newLineChar),[]);

  var strToArrayOfWords = R.split(' ');

  var biggerThan  = function (min) {
    return function(num){return num > min};
  };
  var smallerThan  = function (max) {
    return function(num){return num < max};
  };
  var removeShortSentences = R.filter(R.compose(biggerThan(2),R.length,strToArrayOfWords));

  //var removeLongItems = R.filter(R.compose(smallerThan(50),R.length));

  //must be smarter way...
  var cutLongSentences = R.reduce(function(a,b){
    var MAX_SENTENCE_LENGTH = 3;
    var words = R.split(' ',b);
    var numOfWords = R.length(words);
    if(numOfWords < MAX_SENTENCE_LENGTH){
      return a.concat(b)
    }
    var arr = R.splitEvery(MAX_SENTENCE_LENGTH)(words);

    if(numOfWords % MAX_SENTENCE_LENGTH !== 0){
      var body  = R.init(arr);
      var last = R.last(body);
      var lastWord  = R.last(arr);
      arr = R.concat(R.init(body),[R.concat(last,lastWord)]);
    }
    return a.concat(
        R.map(R.join(' '))(arr)
    )
  },[]);

  var ONLY_HEB = true;

  var languageLetters = ONLY_HEB ? '\u0590-\u05FF' : 'a-zA-Z';
  var re = new RegExp('[^' + languageLetters +'\ ]+' ,"g");
  var removeNonLanguage = R.replace(re,'');
  var listRemoveNonLanguage = R.map(R.compose(R.trim,removeNonLanguage));

  var createNicerList = R.compose(
      //emptyAndUnique,
      removeShortSentences,
      //removeLongItems,
      cutLongSentences,
      emptyAndUnique,
      listRemoveNonLanguage,
      listTolistSplitedWithChar(newLineChar),
      listTolistSplitedWithChar(dotChar)
  );


  //return createNicerList(textList);
  var nicerList = createNicerList(textList);

  var objList = nicerList.map(function(a){return {str:a,last3:a.slice(a.length-3,a.length),words:a.split(' ').filter(function(e){return e}).length} });

  var grouped = R.groupBy(function(obj){return obj.last3},objList);

  var getWords = R.prop('str');
  var getWordsAsArray = R.compose(strToArrayOfWords,getWords);
  var lastWord = R.compose(R.last,getWordsAsArray);
  var uniqueLastWord = R.uniqBy(lastWord);

  var removeBetVavHeh = function(word){
    var firstLetter = R.head(word);
    var bet = String.fromCharCode(1489);
    var heh = String.fromCharCode(1492);
    var vav = String.fromCharCode(1493);
    if(firstLetter === vav && R.head(R.tail(word)) === heh){
      return R.tail(R.tail(word));
    }
    if (firstLetter === vav || firstLetter === heh || firstLetter === bet){
      return R.tail(word);
    }
    return word;
  };

  var groupByLastWord = R.groupBy(R.compose(removeBetVavHeh,lastWord));
  var groupedGroupByWords = R.mapObjIndexed(groupByLastWord , grouped);

  var moreThan1key = R.compose(biggerThan(1),R.length,R.keys);

  var moreThan1wordList = R.pickBy(moreThan1key)(groupedGroupByWords);

  return moreThan1wordList;

};