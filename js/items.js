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
    useTime: 0,
    image: "taika.png",
    particle: "explosion"
  },
  dmgBooster: {
    id: "dmgBooster",
    name: "Damage booster",
    useTime: 1,
    image: "voimaLääke.png",
    // particle: "explosion",
    selfEffect: [
      {id: "Strength", power: 5, duration: 3, effectStatus: "bad"},
      {id: "Speed", power: 1, duration: 2, effectStatus: "good"},
      {id: "Weakness", power: 10, duration: 6, effectStatus: "bad"},
      {id: "Resistance", power: 3, duration: 2, effectStatus: "bad"},
      {id: "Regenaration", power: 2, duration: 14},
    ],
    giveEffect: [
      {id: "Strength", power: 50, duration: 20}
    ],
    amount: 2,
    needTarget: false
  },
  helmet: {
    id: "helmet",
    name: "Helmet",
    image: "helmet.png",
    canEquipTo: "head",
    hp: 50
  },
  chestplate: {
    id: "chestplate",
    name: "Panssari",
    image: "basechest.png",
    canEquipTo: "chest",
    hp: 50
  },
  legs: {
    id: "legs",
    name: "Jalat",
    image: "baselegs.png",
    canEquipTo: "legs",
    hp: 50
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
  this.amount = item.amount;
  this.canEquipTo = base.canEquipTo ?? "hotbar";
  this.hp = base.hp;

  this.needTarget = base.needTarget ?? true;

  this.selfEffect = base.selfEffect?.map(effect => new Effect(effect)) ?? [];
  this.giveEffect = base.giveEffect?.map(effect => new Effect(effect)) ?? [];
}

Item.prototype.calcDamage = function() {
  const dmgPercentage = this.user?.effects?.reduce((arr, effect) => arr += effect.dmgPercentage || 0, 1) || 1;

  const minMeleDmg = (this.minMeleDmg ?? this.maxMeleDmg ?? 0) * dmgPercentage;
  const maxMeleDmg = (this.maxMeleDmg ?? 0) * dmgPercentage;

  return {
    meleDmg: Math.max( Math.floor( random(minMeleDmg, maxMeleDmg) ), 0 ),
    minMeleDmg: Math.floor(minMeleDmg),
    maxMeleDmg: Math.floor(maxMeleDmg)
  }
}

Item.prototype.hoverText = function() {
  const text = [`<cl>itemTitle<cl>${this.name}§`];
  const calcDmg = this.calcDamage();

  if(calcDmg.minMeleDmg && calcDmg.maxMeleDmg) text.push(`\nDamage: §<c>#ff3636<c><css>font-weight: 600<css>${calcDmg.minMeleDmg}-${calcDmg.maxMeleDmg}§`);
  else if(calcDmg.minMeleDmg || calcDmg.maxMeleDmg) text.push(`\nDamage: §<c>#ff3636<c><css>font-weight: 600<css>${calcDmg.minMeleDmg ?? calcDmg.maxMeleDmg}§`);
  if(this.useTime) text.push(`\nUse time: §${this.useTime} ${this.useTime > 1 ? "Rounds" : "Round"} <c>yellow<c>§`);

  if(this.hp) text.push(`\nHealth boost: §${this.hp}HP<c>lime<c><b>700<b>§`);

  if(this.selfEffect?.length > 0) {
    text.push(`\n\n§<cl>selfEffect<cl>Gives the user§`);
    this.selfEffect.forEach(effect => {
      if(effect.effectStatus == "good") text.push(`\n§<cl>goodEffect<cl>§<cl>effect<cl> ${effect.title} § for § <cl>effectDuration<cl>${effect.duration} rounds `);
      else text.push(`\n§<cl>badEffect<cl>§<cl>effect<cl> ${effect.title} § for § <cl>effectDuration<cl>${effect.duration} rounds `);
    }); text.push("§")
  }

  return text.join("");
}