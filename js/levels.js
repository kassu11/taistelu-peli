const currentLevel = {
  id: "",
  enemies: new Map(),
  roundNum: 1,
  enemyRounds: 0,
  drops: []
}

const levels = {
  level_1: {
    enemies: ["week_slime"]
  },
  level_2: {
    enemies: ["red_guy"]
  },
  level_3: {
    enemies: ["week_slime", "week_slime", "week_slime"]
  },
  level_4: {
    enemies: ["octopus", "red_guy"]
  },
  level_5: {
    enemies: ["week_slime", "fish_dude", "week_slime"]
  },
}

document.querySelector("#inventoryButton").addEventListener("click", () => {
  document.body.classList = "itemsMenu";
  updateItemsMenuHotbar();
  updateItemsArmor();
  generateItemsOnGrid(player.inventory.slice());
});

const levelMenu = document.querySelector("#levelMenu");

for(const [key, value] of Object.entries(levels)) {
  const div = document.createElement("div");
  const p = document.createElement("p");
  div.classList.add("levelButton")
  p.textContent = key;
  div.append(p);
  levelMenu.querySelector(".levelButtons").append(div);

  const info = document.createElement("div");
  info.addEventListener("click", e => {
    e.stopPropagation();
    levelMenu.querySelector(".levelInfoScreen").style.display = null;
    
    levelMenu.querySelector(".levelInfoScreen .enemyRowContainer").innerHTML = "";

    const enemyRow = value.enemies.map(id => {
      const [row] = emmet("div.enemyRow>.enemyCard+.dropTree");
      const [img] = emmet("img");
      img.src = "./images/" + enemies[id].img;
      row.querySelector(".enemyCard").append(img);
      row.querySelector(".dropTree").append(...getEnemyDropTreeElements(id));
      return row;
    });

    levelMenu.querySelector(".levelInfoScreen .enemyRowContainer").append(...enemyRow);
  });
  info.classList.add("info")

  div.append(info);

  div.addEventListener("click", e => {
    startLevel(key);
  });
}

function getEnemyDropTreeElements(enemy) {
  const id = enemy?.id ?? enemy;

  return enemies[id]?.drops?.map(drop => {
    const slotsDiv = document.createElement("div");
    if(drop?.type == "all") typeAll(drop, slotsDiv);
    else if(drop?.type == "one") typeOne(drop, slotsDiv);
    else if(drop.amount?.length > 2) addAmount(drop, slotsDiv);
    else addItem(drop, slotsDiv);
  
    function typeAll(arr, elem, per) {
      const [allElem] = emmet(".items");
      allElem.setAttribute("percentage", per ?? arr.chance ?? "");
      elem.append(allElem);
      addHover(allElem, `You will get these\nitems §<b>700<b><c>${getPercentageColor(per ?? arr.chance)}<c>${per ?? arr.chance}%§ of the time`);
      arr.items.forEach(drop => {
        if(drop?.type == "all") typeAll(drop, allElem);
        else if(drop?.type == "one") typeOne(drop, allElem, per ?? arr.chance);
        else if(drop.amount?.length > 2) addAmount(drop, allElem);
        else addItemInsideAll(drop, allElem);
      });
    }
  
    function typeOne(arr, elem, per) {
      const combinedChances = arr.items.map(item => item.chance ?? 0).reduce((acc, v) => [...acc, (acc[acc.length - 1] || 0) + v], []);
      const totalChance = Math.max(...combinedChances);
      const [oneElem] = emmet(".row");
      oneElem.setAttribute("percentage", per ?? arr.chance ?? "");
      addHover(oneElem, `One of the following items \nwill drop §<c>${getPercentageColor(per ?? arr.chance)}<c><b>700<b>${per ?? arr.chance}% §of the time`);
      elem.append(oneElem);
      arr.items.forEach(drop => {
        if(drop?.type == "all") typeAll(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
        else if(drop?.type == "one") typeOne(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
        else if(drop.amount?.length > 2) addAmountInsideOne(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
        else addItem(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
      });
    }

    function addItem(arr, elem, per) {
      const nItem = new Item(arr.item);
      const [items] = emmet(".items>.slot>img+p");
      items.setAttribute("percentage", per ?? arr.chance ?? "");
      elem.append(items);
      items.querySelector("img").src = "./images/" + nItem.image;
      items.querySelector("p").textContent = arr.amount?.join?.("-") ?? arr.amount ?? "";
      addHover(items, `You will get this\nitem §<b>700<b><c>${getPercentageColor(per ?? arr.chance)}<c>${per ?? arr.chance}%§ of the time`);
      addHover(items.querySelector(".slot"), nItem.hoverText() ?? "");
    }

    function addItemInsideAll(arr, elem) {
      const nItem = new Item(arr.item);
      const [slot] = emmet(".slot>img+p");
      elem.append(slot);
      slot.querySelector("img").src = "./images/" + nItem.image;
      slot.querySelector("p").textContent = arr.amount?.join?.("-") ?? arr.amount ?? "";
      addHover(slot, nItem.hoverText() ?? "");
    }

    function addAmount(arr, elem) {
      const [amountElem] = emmet(".amount");
      const nItem = new Item(arr.item);
      elem.append(amountElem);
      addHover(amountElem, nItem.hoverText() ?? "");
      arr.amount.slice().sort().reverse().forEach(amount => {
        const [slot] = emmet(".slot>img+p");
        slot.querySelector("img").src = "./images/" + nItem.image;
        slot.querySelector("p").textContent = amount
        amountElem.append(slot);
      });
    }

    function addAmountInsideOne(arr, elem, per) {
      const [amountElem] = emmet(".items>.amount");
      const nItem = new Item(arr.item);
      amountElem.setAttribute("percentage", per ?? arr.chance ?? "");
      addHover(amountElem, nItem.hoverText() ?? "");
      elem.append(amountElem);
      arr.amount.slice().sort().reverse().forEach(amount => {
        const [slot] = emmet(".slot>img+p");
        slot.querySelector("img").src = "./images/" + nItem.image;
        slot.querySelector("p").textContent = amount
        amountElem.querySelector(".amount").append(slot);
      })
    } return slotsDiv.childNodes[0];
  }) ?? [];
}

function getPercentageColor(val = 0) {
  return ["#ff6363", "#fcff63", "#73ff63"][[35, 50, 100].findIndex(e => e >= val)];
}

levelMenu.querySelector(".levelInfoScreen .close").addEventListener("click", () => {
  levelMenu.querySelector(".levelInfoScreen").style.display = "none";
});