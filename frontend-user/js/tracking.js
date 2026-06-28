Common.checkLogin();
const params = new URLSearchParams(location.search);
const orderId = params.get("orderId");

// 模拟配送进度
let progress = 1; // 0:已接单 1:备餐中 2:配送中 3:已送达
const statusTexts = ["商家已接单", "商家正在备餐中", "配送员正在配送", "订单已送达"];
const etaTexts = ["预计 35 分钟送达", "预计 30 分钟送达", "预计 15 分钟送达", "已送达，感谢用餐！"];

async function loadTracking() {
    // 如果是 demo 或者有具体订单
    if (orderId && orderId !== "demo") {
        try {
            const res = await Api.getOrderList();
            if (res.code === 200 && res.data) {
                const order = res.data.find(o => String(o.id) === orderId);
                if (order) {
                    document.getElementById("infoOrderNo").innerText = order.orderNo || "---";
                    document.getElementById("infoTime").innerText = order.createTime || "---";
                    // 根据状态设置进度
                    if (order.status === 1) progress = 0;
                    else if (order.status === 2) progress = 2;
                    else if (order.status === 3) progress = 3;
                }
            }
        } catch(e) {}
    }

    updateProgress();

    // 模拟进度推进
    if (progress < 3) {
        setInterval(() => {
            if (progress < 3) {
                progress++;
                updateProgress();
            }
        }, 5000);
    }
}

function updateProgress() {
    const steps = document.querySelectorAll("#progressSteps .step");
    steps.forEach((s, i) => {
        s.classList.remove("active", "done");
        if (i < progress) s.classList.add("done");
        else if (i === progress) s.classList.add("active");
    });

    document.getElementById("statusTitle").innerText = statusTexts[progress] || "配送中";
    document.getElementById("etaText").innerText = etaTexts[progress] || "";
}

loadTracking();