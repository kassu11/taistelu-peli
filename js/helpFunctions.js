function random(num1, num2) {
  return Math.round(Math.random() * (num2 - num1) + num1);
}

function removeElement(elem, time) {
  setTimeout(v => {
    elem.remove();
  }, time);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));