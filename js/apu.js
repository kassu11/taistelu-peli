function Random(min = 0, max = 0) {
  if(min < max) return Math.round(Math.random() * (max - min) + min);
  else return Math.round(Math.random() * (min - max) + max);
}
