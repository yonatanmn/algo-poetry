
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
  var removeShortSentences = R.filter(R.compose(biggerThan(SHORT_SENTNCE_LENGTH),R.length,strToArrayOfWords));

  //var removeLongItems = R.filter(R.compose(smallerThan(50),R.length));

  //must be smarter way...
  var cutLongSentences = R.reduce(function(a,b){
    var words = R.split(' ',b);
    var numOfWords = R.length(words);
    if(numOfWords < DIVIDE_SENTENCE_EVERY_n_WORDS){
      return a.concat(b)
    }
    var arr = R.splitEvery(DIVIDE_SENTENCE_EVERY_n_WORDS)(words);

    if(numOfWords % DIVIDE_SENTENCE_EVERY_n_WORDS !== 0){
      var body  = R.init(arr);
      var last = R.last(body);
      var lastWord  = R.last(arr);
      arr = R.concat(R.init(body),[R.concat(last,lastWord)]);
    }
    return a.concat(
        R.map(R.join(' '))(arr)
    )
  },[]);


  var languageLetters = ONLY_HEB ? '\u0590-\u05FF' : 'a-zA-Z';
  var lettersRegex = new RegExp('[^' + languageLetters +'\ ]+' ,"g");
  var removeNonLanguage = R.replace(lettersRegex,'');

  //var newLineRegex =new RegExp('\n','g');
  var newLineAndTabRegex =new RegExp('(\r\n|\n|\r|\t)','gm');
  var replaceNewLineWithSpace = R.replace(newLineAndTabRegex, ' ');

  var listRemoveNonLanguage = R.map( R.compose(R.trim, removeNonLanguage , replaceNewLineWithSpace));

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

  var removeStartingLetters = function(word){
    //more rules = less hebrew duplications, but also less variety of results

    var firstLetter = R.head(word);
    var secondLetter = R.head(R.tail(word));

    var bet = String.fromCharCode(1489);
    var heh = String.fromCharCode(1492);
    var vav = String.fromCharCode(1493);
    var kaf = String.fromCharCode(1499);
    var lamed = String.fromCharCode(1500);
    var mem = String.fromCharCode(1502);
    var shin = String.fromCharCode(1513);

    function firstLetterIsOneOf(list){return R.contains(firstLetter, list); }
    //function secondLetterIsOneOf(list){return R.contains(secondLetter, list); }

    if(secondLetter === heh && firstLetterIsOneOf([vav, mem, shin])){
        return R.tail(R.tail(word));
    }
    if (firstLetterIsOneOf([vav, heh, bet, shin, lamed])){
      return R.tail(word);
    }
    return word;
  };

  var groupByLastWord = R.groupBy(R.compose(removeStartingLetters,lastWord));
  var groupedGroupByWords = R.mapObjIndexed(groupByLastWord , grouped);

  var moreThan1key = R.compose(biggerThan(1),R.length,R.keys);

  var moreThan1wordList = R.pickBy(moreThan1key)(groupedGroupByWords);

  return moreThan1wordList;

};