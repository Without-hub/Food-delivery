Common.checkLogin();
let currentStatus = null;
let currentReviewOrder = null;
let currentReviewDishId = 1;
let currentRating = 5;

// 状态 Tab 切换
document.getElementById("statusTabs").addEventListener("click", function(e) {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    document.querySelectorAll("#statusTabs .tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const s = tab.dataset.status;
    currentStatus = s === "" ? null : parseInt(s);
    renderOrder();
});

function statusClass(s) {
    switch(s) { case 0: return "pending"; case 1: return "paid"; case 2: return "doing"; case 3: return "done"; case 4: return "cancel"; default: return ""; }
}

async function renderOrder() {
    const res = await Api.getOrderList(currentStatus);
    const box = document.getElementById("orderBox");
    if (res.code !== 200) return Common.showMsg("加载订单失败");
    const list = res.data;
    if (!list || list.length === 0) {
        box.innerHTML = '<div class="empty-state" style="margin-top:40px;"><div class="empty-icon">📋</div><div class="empty-text">暂无订单</div><a href="./index.html" class="btn btn-sm">去点餐</a></div>';
        return;
    }
    let html = "";
    list.forEach(item => {
        const canCancel = item.status === 0;
        const canReview = item.status === 3 && !item.hasReview;
        let thumbHtml = "";
        if (item.items && item.items.length > 0) {
            item.items.slice(0, 4).forEach(d => {
                const img = d.dishImage || `/images/food${((d.dishId - 1) % 12) + 1}.jpg`;
                thumbHtml += `<img src="${img}" alt="${d.dishName}">`;
            });
        }

        html += `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-no">订单号：${item.orderNo}</span>
                    <span class="status-tag ${statusClass(item.status)}">${item.statusText}</span>
                </div>
                ${item.shopName ? `<div class="shop-row"><img class="shop-avatar" src="/images/shop${item.shopId}.jpg" alt=""><span class="shop-name">${item.shopName}</span></div>` : ''}
                ${thumbHtml ? `<div class="dish-thumbs">${thumbHtml}</div>` : ''}
                <div class="order-footer">
                    <span class="order-time">${item.createTime || ''}</span>
                    <span class="order-total">${item.totalPrice ? parseFloat(item.totalPrice).toFixed(2) : '0.00'}</span>
                </div>
                <div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end;">
                    ${canCancel ? `<button class="btn-outline btn-xs" onclick="doCancel(${item.id})">取消订单</button>` : ''}
                    ${canReview ? `<button class="btn-xs" style="background:linear-gradient(135deg,var(--primary),#FF8C5A);color:#fff;border:none;border-radius:14px;padding:0 12px;font-size:12px;font-weight:600;cursor:pointer;" onclick="openReview(${item.id},${item.items&&item.items.length>0?item.items[0].dishId:0})">📝 评价</button>` : ''}
                    ${item.status === 3 && item.hasReview ? '<span style="font-size:12px;color:var(--text-muted);">✅ 已评价</span>' : ''}
                    ${item.status === 2 ? `<button class="btn-xs" style="background:var(--primary);color:#fff;border:none;border-radius:14px;padding:0 12px;font-size:12px;font-weight:600;cursor:pointer;" onclick="location.href='./tracking.html?orderId=${item.id}'">🚚 查看配送</button>` : ''}
                </div>
            </div>
        `;
    });
    box.innerHTML = html;
}

async function doCancel(id) {
    if (!confirm("确定取消订单？")) return;
    const res = await Api.cancelOrder(id);
    if (res.code === 200) { Common.showMsg("已取消"); renderOrder(); }
    else Common.showMsg(res.message || "取消失败");
}

// 配送演示入口
document.getElementById("trackingDemo").addEventListener("click", function() {
    location.href = "./tracking.html?orderId=demo";
});

// ===== 评价 =====
function buildStars() {
    let h = "";
    for (let i = 1; i <= 5; i++) h += `<span class="${i <= currentRating ? 'on' : ''}" data-r="${i}" style="color:${i <= currentRating ? '#FFB800' : '#ddd'};margin:0 2px;">★</span>`;
    document.getElementById("starBox").innerHTML = h;
}
document.getElementById("starBox").onclick = function(e) {
    if (e.target.tagName === "SPAN") { currentRating = parseInt(e.target.dataset.r); buildStars(); }
};
function openReview(oid, did) {
    currentReviewOrder = oid; currentReviewDishId = did || 1; currentRating = 5;
    buildStars(); document.getElementById("reviewContent").value = "";
    document.getElementById("reviewPop").style.display = "flex";
}
document.getElementById("closeReview").onclick = () => document.getElementById("reviewPop").style.display = "none";
document.getElementById("submitReview").onclick = async function() {
    const c = document.getElementById("reviewContent").value.trim();
    if (!c) return Common.showMsg("请输入评价内容");
    this.disabled = true; this.innerText = "提交中...";
    const r = await Api.addReview(currentReviewDishId, currentReviewOrder, c, currentRating);
    if (r.code === 200) { Common.showMsg("🎉 评价成功！"); document.getElementById("reviewPop").style.display = "none"; renderOrder(); }
    else { Common.showMsg(r.message || "评价失败"); this.disabled = false; this.innerText = "提交"; }
};

renderOrder();