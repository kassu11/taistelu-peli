const itemsMenu = document.querySelector("#itemsMenu");
let itemsMenuArray = [];

generateItemsOnGrid(player.inventory.slice().sort(v => random(-1, 1)));

function generateItemsOnGrid(items) {
  itemsMenuArray = items;
  if(!Array.isArray(items)) return;
  const itemBox = itemsMenu.querySelector(".inventoryContainer .inventoryBox");
  itemBox.innerHTML = "";

  items.forEach(item => {
    let itemHover = item.hoverText?.() ?? "";
    const div = document.createElement("div");
    const img = document.createElement("img");
    const p = document.createElement("p");

    if(item.slot) {
      if(item.slot.startsWith("hotbarSlot")) {
        const slotNum = document.createElement("p");
        const num = item.slot.substr(10);
        slotNum.textContent = num;
        slotNum.classList.add("hotbarNum");
        div.append(slotNum);
        itemHover += `\nEquipped: §<c>#00ff1e<c><css>font-weight: 600<css>hotbar ${num}`;
      }
    }

    if(item.image) img.src = "./images/" + item.image;

    addHover(div, itemHover, []);

    div.append(img, p);
    itemBox.append(div);
  });
}

updateItemsMenuHotbar();

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
  const hasSlot = target.classList.contains("slot");
  for(let i = 0, parent = target; i < 10; i++, parent = parent?.parentNode) {
    if(parent?.classList?.contains("container")) return;
  } if(!target.parentNode?.classList.contains("inventoryBox") && !hasSlot) return closePopUp();

  const itemElements = itemsMenu.querySelector(".inventoryBox").childNodes;
  const hotbarElements = itemsMenu.querySelectorAll(".hotbarContainer .hotbarBox .slot");
  const hotbarIndex = Array.from(hotbarElements).indexOf(target) + 1;
  const index = hasSlot ? "hotbar" + hotbarIndex : Array.from(itemElements).indexOf(target);
  const item = hotbarIndex != 0 ? player.hotbar["slot" + hotbarIndex] : itemsMenuArray[index] ?? {};

  if(container.getAttribute("index") !== "" && index == container.getAttribute("index")) return closePopUp();
  if(hasSlot && item.id == null) return closePopUp();
  
  if(document.querySelector("#hoverBox div")) document.querySelector("#hoverBox div").style.opacity = 0;
  container.innerHTML = `
  <div class="equipBox">
    <p>Equip to hotbar:</p>
  </div>`

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

  const maxY = innerHeight - container.getBoundingClientRect().height - 10;
  const maxX = innerWidth - container.getBoundingClientRect().width - 10;
  container.style.left = Math.min(x + 10, maxX) + "px";
  container.style.top = Math.min(y + 10, maxY) + "px";
  container.setAttribute("index", index);

  function closePopUp() {
    container.setAttribute("index", "");
    container.innerHTML = "";
    if(document.querySelector("#hoverBox div")) document.querySelector("#hoverBox div").style.opacity = 1;
  }
});

itemsMenuInventoryResize();
window.addEventListener("resize", itemsMenuInventoryResize);
function itemsMenuInventoryResize() {
  const num1 = (innerWidth - 550);
  itemsMenu.querySelector(".inventoryContainer").style.width = num1 - 70 - num1 % 80 + "px";
}