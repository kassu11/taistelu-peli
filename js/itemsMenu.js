const itemsMenu = document.querySelector("#itemsMenu");
const itemsMenuHoverOpacitys = [];
let itemsMenuArray = [];

function generateItemsOnGrid(items) {
  const armorSlotNames = ["head", "chest", "legs"];
  itemsMenuArray = items;
  if(!Array.isArray(items)) return;
  const itemBox = itemsMenu.querySelector(".inventoryContainer .inventoryBox");
  itemBox.innerHTML = "";

  items.forEach(item => {
    let itemHover = item.hoverText?.() ?? "";
    const div = document.createElement("div");
    div.classList.add("inv");

    if(item.slot) {
      if(item.slot.startsWith("hotbarSlot")) {
        const slotNum = document.createElement("p");
        const num = item.slot.substr(10);
        slotNum.textContent = num;
        slotNum.classList.add("slotNum");
        div.classList.add("hotbar")
        div.append(slotNum);
        itemHover += `\nEquipped: §<c>#00ff1e<c><css>font-weight: 600<css>hotbar ${num}`;
      } else if(armorSlotNames.some(v => item.slot.startsWith(v))) {
        const index = armorSlotNames.findIndex(v => item.slot.startsWith(v));
        div.innerHTML += `<p class="slotNum">${index + 1}</p>`
        div.classList.add("armor");
        itemHover += `\nEquipped: §<c>#008eff<c><css>font-weight: 600<css>${armorSlotNames[index]}`;
      }
    }

    if(item.image) {
      const img = document.createElement("img");
      img.src = "./images/" + item.image;
      div.append(img);
    } if(item.amount) {
      const itemAmount = document.createElement("p");
      itemAmount.textContent = item.amount;
      itemAmount.classList.add("itemAmount");
      div.append(itemAmount);
    }

    addHover(div, itemHover, []);    
    itemBox.append(div);
  });
}

function updateItemsMenuHotbar() {
  const hotbarBox = itemsMenu.querySelector(".hotbarBox");
  hotbarBox.innerHTML = "";

  for(let i = 1; i <= Object.keys(player.hotbar).length; i++) {
    const item = player.hotbar["slot" + i];
    hotbarBox.innerHTML += `<div class="slot">
      <p class="slotNumber">${i}</p>
      <img src="${item.image ? "./images/" + item.image : ""}" class="slotImage">
      <p class="itemAmount">${item.amount ?? ""}</p>
    </div>`
  }

  hotbarBox.querySelectorAll(".slot").forEach((elem, i) => {
    const item = player.hotbar["slot" + (i + 1)] ?? {};
    if(item.id) addHover(elem, item?.hoverText?.() ?? "", []);
  });
}

itemsMenu.querySelector("#levelsMenuButton").addEventListener("click", e => {
  document.body.classList = "levelMenu"
});

itemsMenu.addEventListener("click", ({target, x, y}) => {
  const container = itemsMenu.querySelector("#itemMenuPopUp .container");
  const isHotbarItem = target.classList.contains("slot");
  const isInvItem = target.classList.contains("inv");
  const isArmorSlot = target.classList.contains("armorSlot");

  for(let i = 10, parent = target; --i > 0; parent = parent?.parentNode) {
    if(parent?.classList?.contains("container")) return;
  } 

  const itemElements = isInvItem ? itemsMenu.querySelector(".inventoryBox").childNodes : null;
  const hotbarElements = isHotbarItem ? itemsMenu.querySelectorAll(".hotbarContainer .hotbarBox .slot") : null;
  const index = itemElements ? Array.from(itemElements).indexOf(target)
  : hotbarElements ? Array.from(hotbarElements).indexOf(target) + 1
  : isArmorSlot ? target.classList[1] : null;
  const item = isInvItem ? itemsMenuArray[index]
  : isHotbarItem ? player.hotbar["slot" + index]
  : isArmorSlot ? player.armor[target.classList[1]] : {};
  
  if(!item.id) return closePopUp();
  if(container.getAttribute("index") !== "" && index == container.getAttribute("index")) return closePopUp();

  const hoverBlock = document.querySelector("#hoverBox div");
  const hoverText = item.hoverText?.() ?? "";
  
  if(hoverBlock) {
    hoverBlock.style.opacity = 0;
    itemsMenuHoverOpacitys.push(hoverBlock);
  }

  container.innerHTML = `
  <div class="itemInfo"></div>
  <div class="equipBox">
    <p>NAME HERE</p>
  </div>`

  container.querySelector(".itemInfo").append(customTextSyntax(hoverText));

  if(item.canEquipTo == "hotbar") {
    container.querySelector("p").textContent = "Equip to hotbar:";
    for(let i = 1; i <= Object.keys(player.hotbar).length; i++) {
      const hotbarItem = player.hotbar["slot" + i] ?? {};
      const num = item.slot?.startsWith("hotbarSlot") ? +item.slot.substr(10) : -1;
      const div = document.createElement("div");
      div.classList.add("equipHotbar");
      if(num == i) {
        div.classList.add("remove");
        div.innerHTML = `<p class="slotText">${i}. Unequip ${hotbarItem.name ?? ""}</p>`
      } else if(hotbarItem.id && num == -1) {
        div.classList.add("replace");
        div.innerHTML = `<p class="slotText">${i}. Replace ${hotbarItem.name ?? ""}</p>`
      } else if(hotbarItem.id && num !== -1) {
        div.classList.add("swap");
        div.innerHTML = `<p class="slotText">${i}. Swap with ${hotbarItem.name ?? ""}</p>`
      } else if(num !== -1) {
        div.classList.add("switch");
        div.innerHTML = `<p class="slotText">${i}. Switch to empty</p>`
      } else {
        div.classList.add("add");
        div.innerHTML = `<p class="slotText">${i}. Add to empty</p>`
      }
  
      div.addEventListener("click", ({}, slot = i) => {
        if(num > -1 && num != slot) {
          if(player.hotbar["slot" + slot].id) {
            player.hotbar["slot" + num] = player.hotbar["slot" + slot];
            player.hotbar["slot" + num].slot = "hotbarSlot" + num;
            player.hotbar["slot" + slot] = {};
          } else player.hotbar["slot" + num] = {};
        }
        player.hotbar["slot" + slot].slot = null;
        player.hotbar["slot" + slot] = item;
        item.slot = "hotbarSlot" + slot;
  
        if(num == slot) {
          player.hotbar["slot" + slot] = {};
          item.slot = null;
        }
  
        updateItemsMenuHotbar();
        generateItemsOnGrid(itemsMenuArray);
        closePopUp();
      });
  
      container.append(div);
    }
  } else if(["head", "legs", "chest"].indexOf(item.canEquipTo) != -1) {
    const slotName = item.canEquipTo;
    container.querySelector("p").textContent = `Equip to ${slotName}:`;
    const div = document.createElement("div");
    div.classList.add("equipHotbar");

    if(item.slot == `${slotName}Slot`) {
      div.classList.add("remove");
      div.innerHTML = `<p class="slotText">Unequip ${item.name ?? ""}</p>`
    } else if(player.armor[slotName].id) {
      div.classList.add("replace");
      div.innerHTML = `<p class="slotText">Replace ${item.name ?? ""}</p>`
    } else {
      div.classList.add("add");
      div.innerHTML = `<p class="slotText">Add to empty</p>`
    } container.append(div);

    div.addEventListener("click", () => {
      const slotItem = player.armor?.[slotName] ?? {};
      if(item.slot == `${slotName}Slot`) {
        item.slot = "";
        player.armor[slotName] = {};
      } else {
        slotItem.slot = "";
        player.armor[slotName] = item;
        item.slot = `${slotName}Slot`;
      } 
      
      updateItemsArmor();
      generateItemsOnGrid(itemsMenuArray);
      closePopUp();
    });
  }


  const maxY = innerHeight - container.getBoundingClientRect().height - 10;
  const maxX = innerWidth - container.getBoundingClientRect().width - 10;
  container.style.left = Math.min(x + 10, maxX) + "px";
  container.style.top = Math.min(y + 10, maxY) + "px";
  container.setAttribute("index", index);

  function closePopUp() {
    container.setAttribute("index", "");
    container.innerHTML = "";
    while(itemsMenuHoverOpacitys.length) itemsMenuHoverOpacitys.pop().style.opacity = null;
  }
});

function updateItemsArmor() {
  const armorBox = itemsMenu.querySelector(".menuWindow .armorContainer .armorBox");
  armorBox.innerHTML = "";

  ["head", "chest", "legs"].forEach(v => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const item = player.armor[v] ?? {};
    div.classList.add(`armorSlot`, v);

    if(player.armor[v]?.id) img.src = "./images/" + item.image;
    else {
      img.src = "./images/base" + v + ".png";
      div.classList.add("empty");
    }
    addHover(div, item.hoverText?.() ?? "", []);
    div.append(img);
    armorBox.append(div);
  });
}

window.addEventListener("resize", itemsMenuInventoryResize);
function itemsMenuInventoryResize() {
  const num1 = (innerWidth - 550);
  itemsMenu.querySelector(".inventoryContainer").style.width = Math.max(num1 - 70 - num1 % 80, 0) + "px";
} itemsMenuInventoryResize();