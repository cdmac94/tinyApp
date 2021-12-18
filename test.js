const Arr = [1, 2, 3, 4];
const value = 3


const func = (arr, value) => {
  let found = false;
  for (v = 0; !found && v < arr.length; v++) {

    found = value==arr[v]
  }
  if (found) {
    console.log('yep')
  } else {
    console.log('nope')
  }
}


func(Arr, value);
