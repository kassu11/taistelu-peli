function random(min = 0, max = 0) {
  if(min < max) return Math.round(Math.random() * (max - min) + min);
  else return Math.round(Math.random() * (min - max) + max);
}

const $e = e => document.createElement(e);
function $ (e, num = 0) {
  if(e[0] == ".") return document.getElementsByClassName(e.substring(1))[num];
  else return document.getElementById(e);
}