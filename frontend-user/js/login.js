// 登录逻辑
const loginBtn = document.getElementById("loginBtn");
loginBtn.onclick = async function () {
    const username = document.getElementById("username").value.trim();
    const pwd = document.getElementById("pwd").value.trim();
    if (!username) return Common.showMsg("请输入用户名");
    if (!pwd) return Common.showMsg("请输入密码");

    try {
        const res = await Api.login({ username, password: pwd });
        if (res.code === 200) {
            Common.setToken(res.data);
            Common.setUserId(1);
            Common.showMsg("登录成功");
            // 跳首页
            setTimeout(() => location.href = "./index.html", 1200);
        } else {
            Common.showMsg(res.message || "登录失败");
        }
    } catch (err) {
        Common.showMsg("网络请求失败");
    }
}