function Effect(effect) {
  this.id = effect.id;
  this.power = effect.power;
  this.title = `${effect.id} ${effect.power}`;
  this.duration = effect.duration;
  this.effectStatus = effect.effectStatus ?? "good";

  switch(effect.id) {
    case "Strength":
      this.dmgPercentage = .25 * effect.power;
      this.img = "./images/dmgBuff.png"
      break;
  }
}