var SHORT_SENTNCE_LENGTH = 2; //sentences shorter than this will be removed;

var DIVIDE_SENTENCE_EVERY_n_WORDS = 3;
//long sentences will be divided, like that:
// ['1 2 3 4 5 6 7 8 9 10 11 12']  = ["1 2 3", "4 5 6", "7 8 9", "10 11 12"]
// ['1 2 3 4 5 6 7 8 9 10 11']  = ["1 2 3", "4 5 6", "7 8 9 10 11"]

var ONLY_HEB = true; //change to false for only English (not tested: might not work correctly)


//==== structures =====//

//a-b-a-b, c-d-c-d, e-f-e-f, g-g
//0-1-0-1, 2-3-2-3, 4-5-4-5, 6-6
var shakespeareanSonnetStructure = [
  0,
  1,
  0,
  1,
  2,
  3,
  2,
  3,
  4,
  5,
  4,
  5,
  6,
  6
];

var simpleSongStructure = [
  0,0,1,1,2,2
];

// you can create more structures,
//rules: numbers divided by commas,
// not more than two of each number (will work on this later), once is ok.
// bad => [0,1,0,1,0] (0 is 3 times)
// numbers (regardless of order) should be following, starting from 0, with no jumps
// bad => [0,0,4,4] ; [1,2,1,2];
// good => [3,2,1,3,1,2,0] (contains 0,1,2,3)

var structure = shakespeareanSonnetStructure; // choose here one of the structures