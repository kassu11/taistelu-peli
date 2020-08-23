let Viholliset = {
  "lvl0": {
    id: "0",
    hp: 10,
    mp: 20,
    suoja: 10,
    aika: 6,
    kuva: "https://image.winudf.com/v2/image/Y29tLnN1YWRhaDA2MTEuYW5pbWVnaXJsa2F3YWlpYXBwX3NjcmVlbl8yXzE1MjM4OTA0OTRfMDI0/screen-2.jpg?fakeurl=1&type=.jpg",
    kuva_width: "249px",
    kuva_height: "320px",
    mana_regen: 2,
    tavarat: [
      Tavarat.test1,
      Tavarat.test2,
      Tavarat.test3,
      Tavarat.puumiekka,
      Tavarat.rautamiekka,
      Tavarat.hp_pottu
    ]
  },
  "lvl1": {
    id: "1",
    hp: 13,
    mp: 50,
    suoja: 10,
    aika: 10,
    kuva: "https://image.winudf.com/v2/image1/Y29tLmFuaW1lbGlzdHdhbGxwYXBlcnMucm9ja29ubWFuX3NjcmVlbl82XzE1NzU1NTAzOTNfMDE1/screen-6.jpg?fakeurl=1&type=.jpg",
    kuva_width: "249px",
    mana_regen: 2,
    tavarat: [
      Tavarat.test1,
      Tavarat.rautamiekka
    ]
  },
  "lvl2": {
    id: "2",
    hp: 35,
    mp: 20,
    suoja: 10,
    aika: 10,
    kuva: "https://trikky.ru/wp-content/blogs.dir/1/files/2020/03/03/s1200-2.jpg",
    kuva_width: "280px",
    kuva_left: "-8px",
    mana_regen: 2,
    tavarat: [
      Tavarat.test1,
      Tavarat.test2,
      Tavarat.puumiekka,
      Tavarat.hp_pottu,
    ]
  }
}

for(let vihollinen in Viholliset) { // lisää soluja tauluun, joita ei tarvii joka kerta uudelleen kirjottaa :p
  if(!Viholliset[vihollinen].max_aika) Viholliset[vihollinen]["max_aika"] = Viholliset[vihollinen].aika;
  if(!Viholliset[vihollinen].max_mp) Viholliset[vihollinen]["max_mp"] = Viholliset[vihollinen].mp;
  if(!Viholliset[vihollinen].max_hp) Viholliset[vihollinen]["max_hp"] = Viholliset[vihollinen].hp;
  if(!Viholliset[vihollinen].kuva) Viholliset[vihollinen]["kuva"] = ei_kuvaa;
  if(!Viholliset[vihollinen].kuva_top) Viholliset[vihollinen]["kuva_top"] = ""
  if(!Viholliset[vihollinen].kuva_left) Viholliset[vihollinen]["kuva_left"] = ""
  if(!Viholliset[vihollinen].kuva_width) Viholliset[vihollinen]["kuva_width"] = ""
  if(!Viholliset[vihollinen].kuva_height) Viholliset[vihollinen]["kuva_height"] = ""
}