Common.checkLogin();
const shopId = new URLSearchParams(location.search).get("shopId");
let allDishes = [];
let cats = [];
let currentCatId = null;

async function loadShop() {
    const sr = await Api.getShopDetail(shopId);
    if (sr.code === 200) {
        const s = sr.data;
        document.getElementById("shopTitle").innerText = s.name;
        document.getElementById("shopName").innerText = s.name;
        document.getElementById("shopImg").src = s.logo || `/images/shop${shopId}.jpg`;
        const r = s.rating ? parseFloat(s.rating).toFixed(1) : "新店";
        const fee = s.deliveryFee ? parseFloat(s.deliveryFee).toFixed(0) : "免";
        const minP = s.minPrice ? parseFloat(s.minPrice).toFixed(0) : "0";
        document.getElementById("shopMeta").innerHTML = `⭐ ${r} | 月售${s.salesVolume||0} | 配送¥${fee} | 起送¥${minP}`;
        document.getElementById("shopDesc").innerText = s.description || "";
    }

    const cr = await Api.getDishCategory(shopId);
    cats = cr.code === 200 ? cr.data : [];

    const dr = await Api.getDishByShop(shopId);
    allDishes = dr.code === 200 ? dr.data : [];

    renderCats();
    renderDishes();
}

function renderCats() {
    let h = `<span class="tab active" data-cat="">全部</span>`;
    cats.forEach(c => { h += `<span class="tab" data-cat="${c.id}">${c.name}</span>`; });
    document.getElementById("catTabs").innerHTML = h;
    document.getElementById("catTabs").addEventListener("click", function(e) {
        const t = e.target.closest(".tab");
        if (!t) return;
        currentCatId = t.dataset.cat || null;
        currentCatId = currentCatId ? String(currentCatId) : null;
        document.querySelectorAll("#catTabs .tab").forEach(tab => tab.classList.remove("active"));
        t.classList.add("active");
        renderDishes();
    });
}

function renderDishes() {
    let dishes = allDishes;
    if (currentCatId) dishes = allDishes.filter(d => String(d.categoryId) === currentCatId);
    const box = document.getElementById("foodBox");
    if (!dishes.length) {
        box.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">该分类暂无菜品</div>';
        return;
    }
    let html = "";
    dishes.forEach(d => {
        const img = d.image || `/images/food${((d.id - 1) % 12) + 1}.jpg`;
        const hasOrig = d.originalPrice && parseFloat(d.originalPrice) > 0;
        html += `
            <div class="food-card" data-id="${d.id}" data-shop="${shopId}">
                <img class="food-img" src="${img}" alt="${d.name}" loading="lazy">
                <div class="food-body">
                    <div class="food-name">${d.name}</div>
                    <div class="food-meta">
                        <span>月售 ${d.salesVolume || 0}</span>
                    </div>
                    <div class="food-bottom">
                        <div>
                            <span class="price">${parseFloat(d.price).toFixed(2)}</span>
                            ${hasOrig ? `<span class="original-price">¥${parseFloat(d.originalPrice).toFixed(2)}</span>` : ''}
                        </div>
                        <span class="add-btn" data-id="${d.id}" data-shop="${shopId}">+</span>
                    </div>
                </div>
            </div>
        `;
    });
    box.innerHTML = html;

    box.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", async function(e) {
            e.stopPropagation();
            const did = this.dataset.id;
            const sid = this.dataset.shop;
            const r = await Api.addCart(did, sid, 1);
            if (r.code === 200) {
                Common.showMsg("✅ 已加入购物车");
                updateCartTotal();
            } else Common.showMsg(r.message || "添加失败");
        });
    });
}

async function updateCartTotal() {
    try {
        const r = await Api.getCartList();
        if (r.code === 200 && r.data) {
            const total = r.data.reduce((s, i) => s + Number(i.subtotal || i.price * i.quantity), 0);
            document.getElementById("cartTotalInShop").innerText = "¥" + total.toFixed(2);
        }
    } catch(e) {}
}

loadShop();
setInterval(updateCartTotal, 5000);
setTimeout(updateCartTotal, 500);