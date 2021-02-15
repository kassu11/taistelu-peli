const itemsMenu = document.querySelector("#itemsMenu");

generateItemsOnGrid(player.inventory);

function generateItemsOnGrid(items) {
  if(!Array.isArray(items)) return;
  const itemBox = itemsMenu.querySelector(".inventoryContainer .inventoryBox");

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