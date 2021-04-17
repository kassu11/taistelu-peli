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
    enemies: ["red_guy", "tongue_monster"]
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

  return enemies[id]?.drops?.map(row => {
    const slotsDiv = document.createElement("div");

    if(row.items) {
      const items = Array.isArray(row.items) ? row.items : [row.items];
      const amount = row.amount?.slice?.();
      const amounts = row.amount ? Array.isArray(amount) ? amount.length == 2 ? [amount[0] +"-"+ amount[1]] : amount.sort((e1, e2) => e1 - e2) : [row.amount] : [0];
      slotsDiv.classList.add("items");
      slotsDiv.setAttribute("percentage", Math.floor(row.chance * 100));
      if(items.length > 1) addHover(slotsDiv, "Tämä on Monta Tavaraa");
      items.forEach(item => {
        const amountDiv = document.createElement("div");
        amountDiv.classList.add("amount");
        amounts.forEach(amount => {
          const div = document.createElement("div");
          const img = document.createElement("img");
          const p = document.createElement("p");

          if(amount) p.textContent = amount;
          if(amounts.length > 2) {       
            amountDiv.append(div);
            slotsDiv.append(amountDiv);
          } else slotsDiv.append(div);

          addHover(div, "loool" ?? "");

          div.classList.add("slot");  
          img.src = "./images/" + item.image;
          div.append(img, p);
        });
      });

    } else if(row.type !== "empty") {
      slotsDiv.classList.add("row");
      const totalChance = row.reduce((acc, item) => item.type == "empty" ? acc : acc + item.chance, 0) ?? 1;
      let totalPercentage = 100;
      row.forEach(row => {
        if(row.type == "empty" || !row.items) return totalPercentage -= Math.floor((row.chance || 0) * 100);
        const items = Array.isArray(row.items) ? row.items : [row.items];
        const amount = row.amount?.slice?.();
        const amounts = row.amount ? Array.isArray(amount) ? amount.length == 2 ? [amount[0] +"-"+ amount[1]] : amount.sort((e1, e2) => e1 - e2) : [row.amount] : [0];
        const itemsDiv = document.createElement("div");
        itemsDiv.classList.add("items");
        itemsDiv.setAttribute("percentage", Math.floor(row.chance / totalChance * 100));
        if(items.length > 1) addHover(itemsDiv, ["", "Tämä on Monta Tavaraa"], ["shiftKey"]);
        // else addHover(itemsDiv, "");
        slotsDiv.append(itemsDiv);
        items.forEach(item => {
          const amountDiv = document.createElement("div");
          if(amounts.length > 2) {
            itemsDiv.append(amountDiv)
            amountDiv.classList.add("amount");
          }
          amounts.forEach(amount => {
            const div = document.createElement("div");
            const img = document.createElement("img");
            const p = document.createElement("p");

            if(amount) p.textContent = amount;
            if(amounts.length > 2) amountDiv.append(div);
            else itemsDiv.append(div);

            div.classList.add("slot")

            addHover(div, "loool" ?? "");

            img.src = "./images/" + item.image;
            div.append(img, p);
          });
        });
      });
      slotsDiv.setAttribute("percentage", totalPercentage);
      const percentageColor = ["#ff6363", "#fcff63", "#73ff63"][[35, 50, 100].findIndex(e => e >= totalPercentage)];
      addHover(slotsDiv, ["", `One of the following items \nwill drop §<c>${percentageColor}<c><b>700<b>${totalPercentage}% §of the time`], ["shiftKey"]);
    } return slotsDiv;
  }) ?? [];
}

levelMenu.querySelector(".levelInfoScreen .close").addEventListener("click", () => {
  levelMenu.querySelector(".levelInfoScreen").style.display = "none";
});