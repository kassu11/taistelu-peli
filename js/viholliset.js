let Viholliset = {
  "lvl0": {
    id: "0",
    hp: 10,
    mp: 30,
    suoja: 10,
    aika: 5,
    kuva: "https://image.winudf.com/v2/image/Y29tLnN1YWRhaDA2MTEuYW5pbWVnaXJsa2F3YWlpYXBwX3NjcmVlbl8yXzE1MjM4OTA0OTRfMDI0/screen-2.jpg?fakeurl=1&type=.jpg",
    kuva_width: "249px",
    kuva_height: "320px",
    tavarat: [
      Tavarat.test1,
      Tavarat.test2,
      Tavarat.puumiekka,
      Tavarat.rautamiekka
    ]
  },
  "lvl1": {
    id: "1",
    hp: 45,
    mp: 20,
    suoja: 10,
    aika: 10,
    kuva: "https://image.winudf.com/v2/image1/Y29tLmFuaW1lbGlzdHdhbGxwYXBlcnMucm9ja29ubWFuX3NjcmVlbl82XzE1NzU1NTAzOTNfMDE1/screen-6.jpg?fakeurl=1&type=.jpg",
    kuva_width: "249px",
    tavarat: [
      Tavarat.rautamiekka
    ]
  },
  "lvl2": {
    id: "2",
    hp: 45,
    mp: 20,
    suoja: 10,
    aika: 10,
    kuva: "",
    kuva_width: "249px",
    tavarat: [
      Tavarat.test1,
      Tavarat.test2,
      Tavarat.puumiekka
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