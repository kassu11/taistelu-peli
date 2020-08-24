let Viholliset = {
  "lvl0": {
    id: "0",
    hp: 10,
    mp: 20,
    suoja: 10,
    aika: 6,
    kuva: "https://image.winudf.com/v2/image/Y29tLnN1YWRhaDA2MTEuYW5pbWVnaXJsa2F3YWlpYXBwX3NjcmVlbl8yXzE1MjM4OTA0OTRfMDI0/screen-2.jpg?fakeurl=1&type=.jpg",
    kuvaWidth: "249px",
    kuvaHeight: "320px",
    manaRegen: 2,
    tavarat: [
      Tavarat.test1,
      Tavarat.test2,
      Tavarat.test3,
      Tavarat.puumiekka,
      Tavarat.rautamiekka,
      Tavarat.hpPottu2
    ]
  },
  "lvl1": {
    id: "1",
    hp: 13,
    mp: 50,
    suoja: 10,
    aika: 10,
    kuva: "https://image.winudf.com/v2/image1/Y29tLmFuaW1lbGlzdHdhbGxwYXBlcnMucm9ja29ubWFuX3NjcmVlbl82XzE1NzU1NTAzOTNfMDE1/screen-6.jpg?fakeurl=1&type=.jpg",
    kuvaWidth: "249px",
    manaRegen: 2,
    tavarat: [
      Tavarat.test1,
      Tavarat.rautamiekka,
      Tavarat.hpPottu2,
    ]
  },
  "lvl2": {
    id: "2",
    hp: 35,
    mp: 20,
    suoja: 10,
    aika: 10,
    kuva: "https://trikky.ru/wp-content/blogs.dir/1/files/2020/03/03/s1200-2.jpg",
    kuvaWidth: "280px",
    kuvaLeft: "-8px",
    manaRegen: 2,
    tavarat: [
      Tavarat.test1,
      Tavarat.test2,
      Tavarat.puumiekka,
      Tavarat.hpPottu,
    ]
  }
}

for(let vihollinen in Viholliset) { // lisää soluja tauluun, joita ei tarvii joka kerta uudelleen kirjottaa :p
  if(!Viholliset[vihollinen].maxAika) Viholliset[vihollinen]["maxAika"] = Viholliset[vihollinen].aika;
  if(!Viholliset[vihollinen].maxMp) Viholliset[vihollinen]["maxMp"] = Viholliset[vihollinen].mp;
  if(!Viholliset[vihollinen].maxHp) Viholliset[vihollinen]["maxHp"] = Viholliset[vihollinen].hp;
  if(!Viholliset[vihollinen].kuva) Viholliset[vihollinen]["kuva"] = eiKuvaa;
  if(!Viholliset[vihollinen].kuvaTop) Viholliset[vihollinen]["kuvaTop"] = ""
  if(!Viholliset[vihollinen].kuvaLeft) Viholliset[vihollinen]["kuvaLeft"] = ""
  if(!Viholliset[vihollinen].kuvaWidth) Viholliset[vihollinen]["kuvaWidth"] = ""
  if(!Viholliset[vihollinen].kuvaHeight) Viholliset[vihollinen]["kuvaHeight"] = ""
}