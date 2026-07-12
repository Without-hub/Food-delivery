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
            // 登录成功后获取用户信息，存真实 userId
            try {
                const userRes = await Api.getUserInfo();
                if (userRes.code === 200 && userRes.data) {
                    Common.setUserId(userRes.data.id);
                }
            } catch(e) {
                Common.setUserId(1);
            }
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
