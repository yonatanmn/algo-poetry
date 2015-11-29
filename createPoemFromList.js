function createPoem(list) {

  function takeRandItemFromArray(arr) {
    return arr[arr.length * Math.random() << 0]
  }

  function takeRandProp(obj) {
    return takeRandItemFromArray(R.keys(obj));
  }

  function takePropByIndex(obj, i) {
    return obj[R.nth(i)(R.keys(obj))]
  }

  function sentenceFromListByRhymeAndIndex(rhyme, i) {
    return takePropByIndex(list[rhymes[rhyme]], i)[0].str
  }

//structure - in settings;

  var rhymesLength = R.uniq(structure);


  var rhymes = R.range(0, R.length(rhymesLength) + 1);
  for (var i = 0; i < rhymes.length; i++) {
    var rhyme = takeRandProp(list);
    while (R.contains(rhyme, rhymes)) { //choose only non used rhymes
      rhyme = takeRandProp(list);
    }
    rhymes[i] = rhyme
  }


  var sonnet = structure.map(function (e,i,a) {
    var rhymePosition = R.length(R.filter(R.equals(e),R.slice(0, i+1, a))) - 1; //count repeats of `e` so far
    return sentenceFromListByRhymeAndIndex(e, rhymePosition)
  });

  return sonnet.join("\n");

}