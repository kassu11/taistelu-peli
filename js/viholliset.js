let Viholliset = {
  "lvl0": {
    id: "0",
    hp: 10,
    mp: 10,
    suoja: 10,
    aika: 10,
    kuva: "https://image.winudf.com/v2/image/Y29tLnN1YWRhaDA2MTEuYW5pbWVnaXJsa2F3YWlpYXBwX3NjcmVlbl8yXzE1MjM4OTA0OTRfMDI0/screen-2.jpg?fakeurl=1&type=.jpg",
    kuva_width: "249px",
    kuva_height: "320px",
    tavarat: [
      Tavarat.puumiekka
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
  }
}

for(let vihollinen in Viholliset) { // lisää soluja tauluun, joita ei tarvii joka kerta uudelleen kirjottaa :p
  if(!Viholliset[vihollinen].max_aika) Viholliset[vihollinen]["max_aika"] = Viholliset[vihollinen].aika;
  if(!Viholliset[vihollinen].max_mp) Viholliset[vihollinen]["max_mp"] = Viholliset[vihollinen].mp;
  if(!Viholliset[vihollinen].max_hp) Viholliset[vihollinen]["max_hp"] = Viholliset[vihollinen].hp;
  if(!Viholliset[vihollinen].kuva) Viholliset[vihollinen]["kuva"] = "https://steamuserimages-a.akamaihd.net/ugc/914659215888655432/82DCA20555DE13B0F76E9C833110411BC60DEB3F/";
  if(!Viholliset[vihollinen].kuva_top) Viholliset[vihollinen]["kuva_top"] = ""
  if(!Viholliset[vihollinen].kuva_left) Viholliset[vihollinen]["kuva_left"] = ""
  if(!Viholliset[vihollinen].kuva_width) Viholliset[vihollinen]["kuva_width"] = ""
  if(!Viholliset[vihollinen].kuva_height) Viholliset[vihollinen]["kuva_height"] = ""
}