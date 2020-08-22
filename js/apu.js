let ei_kuvaa = "https://steamuserimages-a.akamaihd.net/ugc/914659215888655432/82DCA20555DE13B0F76E9C833110411BC60DEB3F/"

function Random(min = 0, max = 0) {
  if(min < max) return Math.round(Math.random() * (max - min) + min);
  else return Math.round(Math.random() * (min - max) + max);
}
