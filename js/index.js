// 计算在一起的天数
function calculateDaysTogether() {
    const startDate = new Date(2024, 5, 1); // 注意月份是从0开始计数的
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById("days-together").textContent = diffDays;
  }
  
  calculateDaysTogether();
  
  // 情话数组
  const loveQuotes = [
    "遇见你，是我一生中最美的意外。",
    "你是我心中的唯一，爱你直到永远。",
    "每天醒来，看到你的笑容，就是我最大的幸福。",
    "你是我的星辰大海，照亮我前行的路。",
    "即使世界末日，我也会在你身边守护你。",
    "你的微笑是我每天的动力，你的爱是我生命的意义。",
    "我愿意用一生去守护你，去爱你，去陪你走过每一个春夏秋冬。",
    "你是我生命中的阳光，温暖了我的每一个瞬间。",
    "无论未来多么未知，我都会紧紧握住你的手，永不放开。",
    "你的每一句话都是我心中的旋律，永远都不会停息。",
    "爱上你是我做过最正确的决定，和你在一起是我最幸福的时光。",
    "你是我心中的宝藏，我愿意用一生去探寻你的每一个秘密。",
    "无论天涯海角，我的心永远和你在一起。",
    "你的存在让我的世界变得完整，我爱你胜过一切。",
    "我会用余生的每一天去爱你，去守护你，去陪伴你。",
  ];
  
  // 随机选取情话
  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    return loveQuotes[randomIndex];
  }
  
  // 初始显示情话
  document.getElementById("quote-of-the-day").textContent = "今天的情话：" + getRandomQuote();
  
  // 点击按钮切换情话
  document.getElementById("new-quote-btn").addEventListener("click", () => {
    document.getElementById("quote-of-the-day").textContent = "今天的情话：" + getRandomQuote();
  });
  
  function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  }
  
  // 读取本地存储的留言
  function loadMessages() {
    const messageList = document.getElementById("message-list");
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
  
    // 清空留言列表
    messageList.innerHTML = "";
  
    // 将存储的留言渲染到页面
    storedMessages.forEach((message) => {
      const newMessage = document.createElement("li");
      newMessage.textContent = message;
      messageList.appendChild(newMessage);
    });
  }
  
  // 保存留言到本地存储
  function saveMessage(message) {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    storedMessages.push(message);
    localStorage.setItem("messages", JSON.stringify(storedMessages));
  }
  
  // 情侣留言功能
  document.getElementById("send-message-btn").addEventListener("click", () => {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();
  
    if (messageText) {
      // 添加日期和时间
      const now = new Date();
      const dateTime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
      const fullMessage = `${dateTime} - ${messageText}`;
  
      // 保存留言到本地存储
      saveMessage(fullMessage);
  
      // 更新页面显示
      const messageList = document.getElementById("message-list");
      const newMessage = document.createElement("li");
      newMessage.textContent = fullMessage;
      messageList.appendChild(newMessage);
  
      // 清空输入框
      messageInput.value = "";
    } else {
      alert("请输入留言内容！");
    }
  });
  
  // 页面加载时加载留言
  loadMessages();
  