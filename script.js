// 全局变量
let weatherApiKey = '4da911dbf9534137838473f66fcbd2fd';
let cityId = '101010100'; // 默认北京
let cityName = '北京'; // 默认城市名称
let selectedCity = null;

// 视频文件路径
const videoFiles = [
    'static/videos/video1.mp4',
    'static/videos/video2.mp4',
    'static/videos/video3.mp4'
];

// 情话列表
const loveMessages = [
    "早安！今天也要元气满满哦！",
    "新的一天开始啦，要开开心心的！",
    "今天也要像Hello Kitty一样可爱呢！",
    "愿你的一天都充满粉色泡泡！",
    "今天也要做最可爱的自己！",
    "早安！今天也要保持好心情哦！",
    "新的一天，新的开始，要加油哦！",
    "今天也要像Hello Kitty一样温柔呢！",
    "愿你的一天都充满甜蜜！",
    "早安！今天也要保持微笑哦！",
    "张笑笑今天也是世界上最可爱的人！",
    "每天醒来，感谢有你在我的世界里！",
    "你的笑容比阳光还要灿烂呢！",
    "今天也要像你的名字一样，笑笑哦！",
    "你是我见过最可爱的小猫咪！",
    "愿你的每一天都像Hello Kitty一样甜蜜！",
    "你的存在就是这个世界最大的礼物！",
    "今天也要开心地度过每一分钟哦！",
    "你的眼睛里有整个宇宙的星星！",
    "和你在一起的每一天都是粉色的！"
];

// 天气图标映射
const weatherIcons = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '小雨': '🌦️',
    '中雨': '🌧️',
    '大雨': '🌧️',
    '暴雨': '⛈️',
    '雷阵雨': '⛈️',
    '小雪': '🌨️',
    '中雪': '🌨️',
    '大雪': '❄️',
    '雾': '🌫️',
    '霾': '😷',
    '风': '🌬️',
    '默认': '🌈'
};

// DOM 元素
const cityNameEl = document.getElementById('cityName');
const dateEl = document.getElementById('date');
const weatherEl = document.getElementById('weather');
const temperatureEl = document.getElementById('temperature');
const loveMessageEl = document.getElementById('loveMessage');
const refreshBtn = document.getElementById('refreshBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModalBtn = document.querySelector('.close');
const apiKeyInput = document.getElementById('apiKey');
const citySearchInput = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const cityList = document.getElementById('cityList');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const kittyContainer = document.getElementById('kittyContainer');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    fetchWeather();
    setupBackground();
    startKittyFall();
    addHeartDecorations();
    createBubbles();
    createStars();
    updateLoadingText();
    setupSeasonalTheme();
    addFloatingKitty();
    
    // 事件监听
    refreshBtn.addEventListener('click', fetchWeather);
    settingsBtn.addEventListener('click', openSettings);
    closeModalBtn.addEventListener('click', closeSettings);
    searchBtn.addEventListener('click', searchCity);
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            closeSettings();
        }
    });

    // 添加点击效果 - 在点击处生成爱心
    document.addEventListener('click', function(event) {
        // 排除按钮点击
        if (event.target.tagName !== 'BUTTON' && !event.target.closest('.modal-content')) {
            createClickHeart(event.clientX, event.clientY);
        }
    });
});

// 设置背景
function setupBackground() {
    // 使用随机视频作为背景
    const videoBackground = document.getElementById('videoBackground');
    const bgVideo = document.getElementById('bgVideo');
    
    if (videoBackground && bgVideo) {
        // 显示视频元素
        videoBackground.style.display = 'block';
        
        // 随机选择一个视频
        const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];
        bgVideo.src = randomVideo;
        
        // 设置透明度
        bgVideo.style.opacity = '0.5';
        
        // 添加必要的属性以提高自动播放成功率
        bgVideo.muted = true;
        bgVideo.playsInline = true;
        bgVideo.autoplay = true;
        
        // 播放视频
        bgVideo.oncanplaythrough = () => {
            // 尝试多种方式播放视频
            const playPromise = bgVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('视频自动播放成功');
                }).catch(e => {
                    console.error('视频自动播放失败:', e);
                    
                    // 添加用户交互提示
                    const playButton = document.createElement('button');
                    playButton.textContent = '点击播放背景';
                    playButton.className = 'button';
                    playButton.style.position = 'fixed';
                    playButton.style.bottom = '20px';
                    playButton.style.left = '50%';
                    playButton.style.transform = 'translateX(-50%)';
                    playButton.style.zIndex = '100';
                    
                    playButton.addEventListener('click', () => {
                        bgVideo.play().then(() => {
                            playButton.remove();
                        }).catch(err => {
                            console.error('点击后播放失败:', err);
                        });
                    });
                    
                    document.body.appendChild(playButton);
                    
                    // 如果视频播放失败，回退到图片背景
                    document.body.style.backgroundImage = "url('static/images/cherry_blossom.jpg')";
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundPosition = "center";
                    document.body.style.backgroundAttachment = "fixed";
                });
            }
        };
    } else {
        // 如果视频元素不存在，使用图片作为背景
        document.body.style.backgroundImage = "url('static/images/cherry_blossom.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
    }
}

// 开始Hello Kitty掉落效果
function startKittyFall() {
    // 初始掉落几个
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createKitty(), i * 300);
    }
    
    // 定期掉落
    setInterval(createKitty, 3000);
}

// 创建一个Hello Kitty元素 - 增加多样性
function createKitty() {
    const kitty = document.createElement('div');
    kitty.className = 'kitty';
    
    // 随机选择Hello Kitty图片
    const kittyImages = [
        'static/images/hello_kitty.jpg',
        'static/images/hello_kitty2.jpg',
        'static/images/hello_kitty3.jpg'
    ];
    
    const randomImage = kittyImages[Math.floor(Math.random() * kittyImages.length)] || 'static/images/hello_kitty.jpg';
    kitty.style.backgroundImage = `url('${randomImage}')`;
    
    // 随机位置和动画时间
    const startPositionX = Math.random() * window.innerWidth;
    const size = 40 + Math.random() * 30; // 40-70px的随机大小
    const animationDuration = 4 + Math.random() * 6; // 4-10秒
    const rotation = Math.random() * 360; // 随机旋转角度
    
    kitty.style.left = `${startPositionX}px`;
    kitty.style.width = `${size}px`;
    kitty.style.height = `${size}px`;
    kitty.style.animationDuration = `${animationDuration}s`;
    kitty.style.transform = `rotate(${rotation}deg)`;
    
    kittyContainer.appendChild(kitty);
    
    // 动画结束后移除元素
    setTimeout(() => {
        kitty.remove();
    }, animationDuration * 1000);
}

// 添加心形装饰
function addHeartDecorations() {
    const container = document.querySelector('.container');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💘'];
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-decoration';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // 随机位置
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        
        // 随机动画延迟
        heart.style.animationDelay = `${Math.random() * 3}s`;
        
        container.appendChild(heart);
    }
}

// 添加气泡效果
function createBubbles() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            // 随机大小和位置
            const size = 10 + Math.random() * 30;
            const left = Math.random() * 100;
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.bottom = '-20px';
            bubble.style.animationDuration = `${5 + Math.random() * 10}s`;
            
            container.appendChild(bubble);
            
            // 动画结束后移除
            setTimeout(() => {
                bubble.remove();
            }, 15000);
        }, i * 2000);
    }
    
    // 定期创建新气泡
    setTimeout(createBubbles, 30000);
}

// 添加闪烁星星
function createStars() {
    const container = document.querySelector('.container');
    const stars = ['✨', '⭐', '🌟'];
    
    for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        
        // 随机位置
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // 随机动画延迟
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(star);
    }
}

// 添加可爱的加载动画
function updateLoadingText() {
    const cityNameEl = document.getElementById('cityName');
    if (cityNameEl.textContent === '加载中...') {
        const loadingText = '加载中';
        const dots = '...';
        
        for (let i = 0; i < loadingText.length; i++) {
            const span = document.createElement('span');
            span.className = 'loading-text';
            span.textContent = loadingText[i];
            span.style.animationDelay = `${i * 0.1}s`;
            cityNameEl.appendChild(span);
        }
        
        for (let i = 0; i < dots.length; i++) {
            const span = document.createElement('span');
            span.className = 'loading-text';
            span.textContent = dots[i];
            span.style.animationDelay = `${(loadingText.length + i) * 0.1}s`;
            cityNameEl.appendChild(span);
        }
    }
}

// 获取天气数据
function fetchWeather() {
    cityNameEl.innerHTML = ''; // 清空内容
    updateLoadingText(); // 添加动画加载文字
    weatherEl.textContent = '--';
    temperatureEl.textContent = '--';
    loveMessageEl.textContent = '--';
    
    const url = `https://devapi.qweather.com/v7/weather/3d?location=${cityId}&key=${weatherApiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.code === '200' && data.daily && data.daily.length > 0) {
                const weather = data.daily[0];
                const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
                
                const today = new Date();
                const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
                
                // 获取天气图标
                const dayWeatherIcon = getWeatherIcon(weather.textDay);
                const nightWeatherIcon = getWeatherIcon(weather.textNight);
                
                cityNameEl.textContent = cityName;
                dateEl.textContent = dateString;
                weatherEl.innerHTML = `白天: ${weather.textDay} ${dayWeatherIcon} 夜间: ${weather.textNight} ${nightWeatherIcon}`;
                temperatureEl.textContent = `${weather.tempMin}°C ~ ${weather.tempMax}°C 🌡️`;
                loveMessageEl.textContent = randomMessage;
                
                // 成功获取天气时额外掉落几个Kitty
                for (let i = 0; i < 5; i++) {
                    setTimeout(createKitty, i * 200);
                }
            } else {
                cityNameEl.textContent = '获取天气失败';
                console.error('获取天气数据失败:', data);
            }
        })
        .catch(error => {
            cityNameEl.textContent = '获取天气失败';
            console.error('获取天气信息失败:', error);
        });
}

// 获取天气图标
function getWeatherIcon(weatherText) {
    for (const key in weatherIcons) {
        if (weatherText.includes(key)) {
            return weatherIcons[key];
        }
    }
    return weatherIcons['默认'];
}

// 搜索城市
function searchCity() {
    const citySearchValue = citySearchInput.value.trim();
    if (!citySearchValue) return;
    
    const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(citySearchValue)}&key=${weatherApiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            cityList.innerHTML = '';
            
            if (data.code === '200' && data.location && data.location.length > 0) {
                data.location.forEach(city => {
                    const li = document.createElement('li');
                    li.textContent = `${city.name}, ${city.adm1}, ${city.adm2}`;
                    li.dataset.id = city.id;
                    li.dataset.name = city.name;
                    
                    li.addEventListener('click', () => {
                        // 移除之前选中的城市
                        document.querySelectorAll('.city-list li').forEach(item => {
                            item.classList.remove('selected');
                        });
                        
                        // 选中当前城市
                        li.classList.add('selected');
                        selectedCity = {
                            id: city.id,
                            name: city.name
                        };
                    });
                    
                    cityList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = '未找到城市';
                cityList.appendChild(li);
            }
        })
        .catch(error => {
            console.error('搜索城市失败:', error);
            cityList.innerHTML = '<li>搜索失败，请重试</li>';
        });
}

// 打开设置模态框
function openSettings() {
    apiKeyInput.value = weatherApiKey;
    citySearchInput.value = '';
    cityList.innerHTML = '';
    selectedCity = null;
    settingsModal.style.display = 'block';
}

// 关闭设置模态框
function closeSettings() {
    settingsModal.style.display = 'none';
}

// 保存设置
function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        alert('请输入API Key');
        return;
    }
    
    if (!selectedCity) {
        alert('请选择一个城市');
        return;
    }
    
    weatherApiKey = apiKey;
    cityId = selectedCity.id;
    cityName = selectedCity.name;
    
    // 保存到本地存储
    localStorage.setItem('weatherApiKey', apiKey);
    localStorage.setItem('cityId', cityId);
    localStorage.setItem('cityName', cityName);
    
    closeSettings();
    fetchWeather();
}

// 从本地存储加载设置
function loadSettings() {
    const savedApiKey = localStorage.getItem('weatherApiKey');
    const savedCityId = localStorage.getItem('cityId');
    const savedCityName = localStorage.getItem('cityName');
    
    if (savedApiKey) {
        weatherApiKey = savedApiKey;
    }
    
    if (savedCityId) {
        cityId = savedCityId;
    }
    
    if (savedCityName) {
        cityName = savedCityName;
    }
}

// 添加季节性主题 - 根据当前月份显示不同主题
function setupSeasonalTheme() {
    const month = new Date().getMonth(); // 0-11
    
    // 根据月份设置主题
    let theme = {};
    
    if (month >= 2 && month <= 4) {
        // 春季主题 (3-5月)
        theme = {
            emoji: '🌸',
            color: '#ffb7c5',
            message: '春暖花开，和Hello Kitty一起享受春天吧！'
        };
    } else if (month >= 5 && month <= 7) {
        // 夏季主题 (6-8月)
        theme = {
            emoji: '🍦',
            color: '#87ceeb',
            message: '夏日炎炎，和Hello Kitty一起吃冰淇淋吧！'
        };
    } else if (month >= 8 && month <= 10) {
        // 秋季主题 (9-11月)
        theme = {
            emoji: '🍁',
            color: '#ffa500',
            message: '秋高气爽，和Hello Kitty一起去看枫叶吧！'
        };
    } else {
        // 冬季主题 (12-2月)
        theme = {
            emoji: '❄️',
            color: '#add8e6',
            message: '冬日暖阳，和Hello Kitty一起堆雪人吧！'
        };
    }
    
    // 添加季节主题元素
    const seasonalElement = document.createElement('div');
    seasonalElement.className = 'seasonal-theme';
    seasonalElement.innerHTML = `
        <span class="seasonal-emoji">${theme.emoji}</span>
        <p class="seasonal-message">${theme.message}</p>
    `;
    
    // 设置主题颜色
    document.documentElement.style.setProperty('--seasonal-color', theme.color);
    
    // 添加到页面
    document.querySelector('.container').appendChild(seasonalElement);
}

// 添加浮动的Hello Kitty
function addFloatingKitty() {
    const floatingKitty = document.createElement('div');
    floatingKitty.className = 'floating-kitty';
    floatingKitty.innerHTML = `
        <img src="static/images/hello_kitty.jpg" alt="Hello Kitty">
        <div class="kitty-speech">点我有惊喜！</div>
    `;
    
    document.body.appendChild(floatingKitty);
    
    // 点击事件
    floatingKitty.addEventListener('click', () => {
        // 随机选择一个惊喜效果
        const surprises = [
            () => showKittyMessage('你今天真漂亮！'),
            () => showKittyMessage('要开心哦！'),
            () => showKittyMessage('张笑笑最可爱！'),
            () => createConfetti(),
            () => createRainbowEffect()
        ];
        
        const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
        randomSurprise();
    });
}

// 显示Kitty消息
function showKittyMessage(message) {
    const kittyMessage = document.querySelector('.kitty-speech');
    const originalMessage = kittyMessage.textContent;
    
    kittyMessage.textContent = message;
    kittyMessage.style.display = 'block';
    
    // 3秒后恢复原始消息
    setTimeout(() => {
        kittyMessage.textContent = originalMessage;
    }, 3000);
}

// 创建彩虹效果
function createRainbowEffect() {
    const rainbow = document.createElement('div');
    rainbow.className = 'rainbow-effect';
    
    document.body.appendChild(rainbow);
    
    setTimeout(() => {
        rainbow.remove();
    }, 2000);
}

// 创建五彩纸屑效果
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // 随机颜色
        const colors = ['#ff69b4', '#ffb6c1', '#ffc0cb', '#ff1493', '#db7093'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = randomColor;
        
        // 随机位置和大小
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.width = `${5 + Math.random() * 10}px`;
        confetti.style.height = `${5 + Math.random() * 10}px`;
        confetti.style.animationDuration = `${1 + Math.random() * 3}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.body.appendChild(confetti);
        
        // 动画结束后移除
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// 创建点击爱心效果
function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.textContent = '💖';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    document.body.appendChild(heart);
    
    // 动画结束后移除
    setTimeout(() => {
        heart.remove();
    }, 1000);
}