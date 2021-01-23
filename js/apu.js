function random(min = 0, max = 0) {
  if(min < max) return Math.round(Math.random() * (max - min) + min);
  else return Math.round(Math.random() * (min - max) + max);
}

const $e = e => document.createElement(e);
function $(e, num = 0) {
  if(e[0] == ".") return document.getElementsByClassName(e.substring(1))[num];
  else return document.getElementById(e);
}

function poistaElem(elem, aika = 0) {
  if(aika == 0) elem.remove();
  else setTimeout(() => {elem.remove()}, aika);
};

function lisaValitNumeroon(num) {
  let text = `${num}`;
  let tyhjaText = "";
  for(let i = 0; i < text.length; i++) {
  if((text.length - i) % 3 == 0 && i !== 0) tyhjaText += " ";
    tyhjaText += text[i];
  } return tyhjaText
}