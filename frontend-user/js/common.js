// 全局工具函数
const Common = {
    // 存储token
    setToken(token) {
        localStorage.setItem("userToken", token);
    },
    // 获取token
    getToken() {
        return localStorage.getItem("userToken") || "";
    },
    // 删除token（退出登录）
    removeToken() {
        localStorage.removeItem("userToken");
    },
    // 存储userId
    setUserId(uid) {
        localStorage.setItem("userId", uid);
    },
    // 获取userId
    getUserId() {
        return localStorage.getItem("userId") || "1";
    },
    // 判断是否登录，未登录跳登录页
    checkLogin() {
        const token = this.getToken();
        if (!token) {
            location.href = "./login.html";
        }
    },
    // 弹窗提示
    showMsg(text, time = 1500) {
        let tip = document.querySelector(".msg-tip");
        if (!tip) {
            tip = document.createElement("div");
            tip.className = "msg-tip";
            document.body.appendChild(tip);
        }
        tip.innerText = text;
        tip.style.display = "block";
        setTimeout(() => {
            tip.style.display = "none";
        }, time);
    },
    // 价格计算，保留2位小数
    calcPrice(num) {
        return Number(num).toFixed(2);
    }
}