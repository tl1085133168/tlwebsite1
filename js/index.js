console.log('JS loaded');  // 添加在第一行
document.addEventListener('DOMContentLoaded', function() {
    // 获取必要的DOM元素
    const searchForm = document.querySelector('.search-form');
    const tripTypeInputs = document.querySelectorAll('input[name="trip-type"]');
    const returnDateInput = document.querySelector('input[type="date"]:last-of-type');
    const departureInput = document.querySelector('input[placeholder="请输入出发城市"]');
    const arrivalInput = document.querySelector('input[placeholder="请输入到达城市"]');
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const searchBtn = document.querySelector('.search-btn');

    // 城市数据（示例）
    const cities = [
        { name: "北京", pinyin: "beijing" },
        { name: "上海", pinyin: "shanghai" },
        { name: "广州", pinyin: "guangzhou" },
        { name: "深圳", pinyin: "shenzhen" },
        { name: "成都", pinyin: "chengdu" },
        { name: "杭州", pinyin: "hangzhou" },
        { name: "武汉", pinyin: "wuhan" },
        { name: "西安", pinyin: "xian" },
        { name: "南京", pinyin: "nanjing" },
        { name: "重庆", pinyin: "chongqing" },
        { name: "青岛", pinyin: "qingdao" },
        { name: "厦门", pinyin: "xiamen" },
        { name: "昆明", pinyin: "kunming" },
        { name: "大连", pinyin: "dalian" },
        { name: "长沙", pinyin: "changsha" },
        { name: "三亚", pinyin: "sanya" }
    ];

    // 初始化日期选择器
    function initializeDatePickers() {
        const today = new Date().toISOString().split('T')[0];
        dateInputs.forEach(input => {
            input.min = today;
        });
    }

    // 设置城市自动完成功能
    function setupCityAutocomplete(input) {
        let currentFocus = -1;

        // 输入事件处理
        input.addEventListener('input', function(e) {
            const val = this.value.toLowerCase();
            closeAllLists();

            if (!val) return false;

            // 创建自动完成列表容器
            const autocompleteList = document.createElement('div');
            autocompleteList.className = 'autocomplete-items';
            this.parentNode.appendChild(autocompleteList);

            // 匹配城市
            const matchedCities = cities.filter(city => 
                city.name.includes(val) || city.pinyin.includes(val)
            );

            matchedCities.forEach(city => {
                const div = document.createElement('div');
                div.className = 'city-item';
                div.innerHTML = `
                    <span class="city-name">${highlightMatch(city.name, val)}</span>
                    <span class="city-pinyin">${highlightMatch(city.pinyin, val)}</span>
                `;

                div.addEventListener('click', function() {
                    input.value = city.name;
                    closeAllLists();
                });

                autocompleteList.appendChild(div);
            });
        });

        // 键盘导航
        input.addEventListener('keydown', function(e) {
            let items = document.querySelector('.autocomplete-items');
            if (items) items = items.getElementsByTagName('div');
            
            switch(e.keyCode) {
                case 40: // 向下键
                    currentFocus++;
                    addActive(items);
                    break;
                case 38: // 向上键
                    currentFocus--;
                    addActive(items);
                    break;
                case 13: // 回车键
                    e.preventDefault();
                    if (currentFocus > -1 && items) {
                        items[currentFocus].click();
                    }
                    break;
                case 27: // ESC键
                    closeAllLists();
                    break;
            }
        });

        // 点击其他地方关闭列表
        document.addEventListener('click', function(e) {
            if (e.target !== input) {
                closeAllLists();
            }
        });
    }

    // 高亮匹配文本
    function highlightMatch(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index >= 0) {
            return text.substring(0, index) +
                   `<strong>${text.substring(index, index + query.length)}</strong>` +
                   text.substring(index + query.length);
        }
        return text;
    }

    // 添加活动项样式
    function addActive(items) {
        if (!items) return false;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add('autocomplete-active');
    }

    // 移除活动项样式
    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('autocomplete-active');
        }
    }

    // 关闭所有自动完成列表
    function closeAllLists() {
        const items = document.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < items.length; i++) {
            items[i].parentNode.removeChild(items[i]);
        }
        currentFocus = -1;
    }

    // 表单验证
    function validateForm() {
        let isValid = true;
        const errorMessages = [];

        // 验证城市选择
        if (!departureInput.value) {
            errorMessages.push('请输入出发城市');
            isValid = false;
        }

        if (!arrivalInput.value) {
            errorMessages.push('请输入到达城市');
            isValid = false;
        }

        if (departureInput.value === arrivalInput.value) {
            errorMessages.push('出发城市和到达城市不能相同');
            isValid = false;
        }

        // 验证日期选择
        const departDate = new Date(dateInputs[0].value);
        const returnDate = new Date(dateInputs[1].value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!dateInputs[0].value) {
            errorMessages.push('请选择出发日期');
            isValid = false;
        } else if (departDate < today) {
            errorMessages.push('出发日期不能早于今天');
            isValid = false;
        }

        const tripType = document.querySelector('input[name="trip-type"]:checked').value;
        if (tripType === 'round' && !dateInputs[1].disabled) {
            if (!dateInputs[1].value) {
                errorMessages.push('请选择返回日期');
                isValid = false;
            } else if (returnDate < departDate) {
                errorMessages.push('返回日期不能早于出发日期');
                isValid = false;
            }
        }

        if (!isValid) {
            showError(errorMessages);
        }

        return isValid;
    }

    // 显示错误信息
    function showError(messages) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>请检查以下问题：</h3>
                <ul>
                    ${messages.map(msg => `<li>${msg}</li>`).join('')}
                </ul>
                <button class="error-close">确定</button>
            </div>
        `;

        document.body.appendChild(errorDiv);

        const closeBtn = errorDiv.querySelector('.error-close');
        closeBtn.onclick = () => errorDiv.remove();
    }

    // 显示加载动画
    function showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>正在搜索航班...</p>
        `;
        document.body.appendChild(loader);
    }

    // 隐藏加载动画
    function hideLoading() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    }

    // 显示搜索结果
    function showSearchResults() {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        resultsDiv.innerHTML = `
            <div class="results-content">
                <h2>搜索结果</h2>
                <div class="flight-list">
                    <div class="flight-item">
                        <div class="flight-info">
                            <span class="time">08:00</span>
                            <span class="arrow">→</span>
                            <span class="time">10:30</span>
                        </div>
                        <div class="flight-details">
                            <span>航班号: CA1234</span>
                            <span>¥1280起</span>
                        </div>
                    </div>
                    <div class="flight-item">
                        <div class="flight-info">
                            <span class="time">10:30</span>
                            <span class="arrow">→</span>
                            <span class="time">13:00</span>
                        </div>
                        <div class="flight-details">
                            <span>航班号: MU5678</span>
                            <span>¥1580起</span>
                        </div>
                    </div>
                </div>
                <button class="close-results">关闭</button>
            </div>
        `;

        document.body.appendChild(resultsDiv);

        const closeBtn = resultsDiv.querySelector('.close-results');
        closeBtn.onclick = () => resultsDiv.remove();
    }

    // 处理往返切换
    function handleTripTypeChange() {
        tripTypeInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.value === 'single') {
                    returnDateInput.disabled = true;
                    returnDateInput.value = '';
                } else {
                    returnDateInput.disabled = false;
                }
            });
        });
    }

    // 表单提交处理
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            showLoading();
            // 模拟API请求延迟
            setTimeout(() => {
                hideLoading();
                showSearchResults();
            }, 1500);
        }
    });

    // 初始化
    initializeDatePickers();
    setupCityAutocomplete(departureInput);
    setupCityAutocomplete(arrivalInput);
    handleTripTypeChange();
});