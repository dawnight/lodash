function ArrayEach() {
  function arrayEach(array, iteratee) {
    let index = -1;
    debugger;
    const length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  function fn(el, index, arr) {
    return arr[index] === el;
  }

  let res = arrayEach([1,2,3,4,true,false], fn);

  console.log(res);

  return null;
}


export default ArrayEach;

