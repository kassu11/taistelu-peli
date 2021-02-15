const items = {
  wooden_sword: {
    id: "wooden_sword",
    name: "Wooden sword",
    minMeleDmg: 10,
    maxMeleDmg: 20,
    useTime: 2,
    image: "miekka1.png"
  },
  stone_sword: {
    id: "stone_sword",
    name: "Stone sword",
    minMeleDmg: 15,
    maxMeleDmg: 25,
    useTime: 0,
    image: "heikkous.png",
    particle: "explosion2"
  },
  weak_stick: {
    id: "weak_stick",
    name: "Weak stick",
    minMeleDmg: 2,
    maxMeleDmg: 4,
    useTime: 1,
    image: "taika.png",
    particle: "explosion"
  },
  dmgBooster: {
    id: "dmgBooster",
    name: "Damage booster",
    useTime: 2,
    image: "voimaLääke.png",
    // particle: "explosion",
    selfEffect: [
      {id: "Strength", power: 5, duration: 2}
    ],
    giveEffect: [
      {id: "Strength", power: 50, duration: 20}
    ]
  }
}

function Item(item, user) {
  const base = items[item.id];
  this.user = user;
  this.id = item.id;
  this.name = item.name;
  this.minMeleDmg = base.minMeleDmg;
  this.maxMeleDmg = base.maxMeleDmg;
  this.useTime = base.useTime;
  this.image = base.image;
  this.particle = base.particle;
  this.slot = item.slot;

  this.selfEffect = item.selfEffect?.map(effect => new Effect(effect)) ?? [];
  this.giveEffect = item.giveEffect?.map(effect => new Effect(effect)) ?? [];
}

Item.prototype.calcDamage = function() {
  const dmgPercentage = this.user?.effects?.reduce((arr, effect) => arr += effect.dmgPercentage || 0, 1) || 1;

  const minMeleDmg = (this.minMeleDmg ?? this.maxMeleDmg ?? 0) * dmgPercentage;
  const maxMeleDmg = (this.maxMeleDmg ?? 0) * dmgPercentage;

  return {
    meleDmg: Math.max( Math.floor( random(minMeleDmg, maxMeleDmg) ), 0 )
  }
}

Item.prototype.hoverText = function() {
  let text = `<cl>itemTitle<cl>${this.name}§`;
  if(this.minMeleDmg && this.maxMeleDmg) text +=`\nDamage: §<c>#ff3636<c><css>font-weight: 600<css>${this.minMeleDmg}-${this.maxMeleDmg}§`;
  else if(this.minMeleDmg || this.maxMeleDmg) text +=`\nDamage: §<c>#ff3636<c><css>font-weight: 600<css>${this.minMeleDmg ?? this.maxMeleDmg}§`;
  if(this.useTime) text += `\nUse time: §${this.useTime} Rounds <c>yellow<c>§`;

  return text;
}