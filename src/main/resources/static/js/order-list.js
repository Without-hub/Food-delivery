Common.checkLogin();
let currentStatus = null;
let currentReviewOrder = null;
let currentRating = 5;

// 状态筛选
document.querySelector(".filter-bar").onclick = function(e) {
    if (e.target.tagName === "BUTTON") {
        document.querySelectorAll(".filter-bar button").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const s = e.target.dataset.status;
        currentStatus = s === "" ? null : parseInt(s);
        renderOrder();
    }
};

async function renderOrder() {
    const res = await Api.getOrderList(currentStatus);
    const box = document.getElementById("orderBox");
    if (res.code !== 200) return Common.showMsg("加载订单失败");
    const list = res.data;
    if (!list || list.length === 0) {
        box.innerHTML = "<div style='text-align:center;color:#999;margin-top:80px'>暂无订单记录</div>";
        return;
    }
    let html = "";
    list.forEach(item => {
        const canCancel = item.status === 0;
        const canReview = item.status === 3 && !item.hasReview;
        html += `
            <div class="order-item">
                <div class="order-top">
                    <span><b>订单号：</b>${item.orderNo}</span>
                    <span class="status-tag">${item.statusText}</span>
                </div>
                <div>💰 总价：<b>¥${item.totalPrice}</b></div>
                <div style="color:#999;margin-top:4px;">📅 ${item.createTime || ''}</div>
                <div class="order-actions">
                    ${canCancel ? `<button onclick="doCancel(${item.id})">取消订单</button>` : ''}
                    ${canReview ? `<button class="review-btn" onclick="openReview(${item.id})">📝 评价</button>` : ''}
                    ${item.status === 3 && item.hasReview ? `<span style="color:#999;font-size:13px;">✅ 已评价</span>` : ''}
                </div>
            </div>
        `;
    });
    box.innerHTML = html;
}

async function doCancel(orderId) {
    const res = await Api.cancelOrder(orderId);
    if (res.code === 200) {
        Common.showMsg("订单已取消");
        renderOrder();
    } else {
        Common.showMsg(res.message || "取消失败");
    }
}

// ===== 评价功能 =====
function buildStars() {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += `<span class="${i <= currentRating ? 'on' : ''}" data-r="${i}">★</span>`;
    }
    document.getElementById("starBox").innerHTML = html;
}

document.getElementById("starBox").onclick = function(e) {
    if (e.target.tagName === "SPAN") {
        currentRating = parseInt(e.target.dataset.r);
        buildStars();
    }
};

function openReview(orderId) {
    currentReviewOrder = orderId;
    currentRating = 5;
    buildStars();
    document.getElementById("reviewContent").value = "";
    document.getElementById("reviewPop").style.display = "flex";
}

document.getElementById("closeReview").onclick = function() {
    document.getElementById("reviewPop").style.display = "none";
};

document.getElementById("submitReview").onclick = async function() {
    const content = document.getElementById("reviewContent").value.trim();
    if (!content) return Common.showMsg("请输入评价内容");
    const res = await Api.addReview(1, 1, currentReviewOrder, content, currentRating);
    if (res.code === 200) {
        Common.showMsg("评价成功！");
        document.getElementById("reviewPop").style.display = "none";
        renderOrder();
    } else {
        Common.showMsg(res.message || "评价失败");
    }
};

renderOrder();
