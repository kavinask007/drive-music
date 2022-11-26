export function CreateShuffleList(length) {
  var array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }

  return shuffleArray(array);
}
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
