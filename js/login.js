document.addEventListener('DOMContentLoaded', function() {
	const tabs = document.querySelectorAll('.tab');
	const forms = document.querySelectorAll('.form-content form');
	const passwordToggles = document.querySelectorAll('.password-toggle');

	// 绑定眼睛按钮点击事件
	passwordToggles.forEach(toggle => {
		toggle.addEventListener('click', function() {
			const targetId = this.dataset.target;
			const targetInput = document.getElementById(targetId);
			if (targetInput.type === 'password') {
				targetInput.type = 'text'; // 显示密码
				this.querySelector('.eye-icon').classList.add('hide'); // 切换图标
			} else {
				targetInput.type = 'password'; // 隐藏密码
				this.querySelector('.eye-icon').classList.remove('hide'); // 切换图标
			}
		});
	});

	// 表单切换功能
	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			tabs.forEach(t => t.classList.remove('active'));
			forms.forEach(f => f.classList.remove('active'));

			tab.classList.add('active');
			forms[index].classList.add('active');
		});
	});

	// 登录表单验证和提交
	document.getElementById('loginForm').addEventListener('submit', function(e) {
		e.preventDefault();
		const username = document.getElementById('loginUsername');
		const password = document.getElementById('loginPassword');
		const rememberMe = document.getElementById('rememberMe');

		// 清除之前的错误提示
		clearErrors();

		// 验证用户名
		if (!username.value.trim()) {
			showError(username, '请输入用户名或邮箱');
			return;
		}

		// 验证密码
		if (!password.value.trim()) {
			showError(password, '请输入密码');
			return;
		}

		// 模拟登录请求
		console.log('登录信息:', {
			username: username.value,
			password: password.value,
			rememberMe: rememberMe.checked
		});

		// 如果选择了“记住我”，保存用户名到 localStorage
		if (rememberMe.checked) {
			localStorage.setItem('rememberedUsername', username.value);
		} else {
			localStorage.removeItem('rememberedUsername');
		}

		// 提示登录成功
		alert('登录成功！');
	});

	// 页面加载时，检查是否有记住的用户名
	document.addEventListener('DOMContentLoaded', function() {
		const rememberedUsername = localStorage.getItem('rememberedUsername');
		if (rememberedUsername) {
			document.getElementById('loginUsername').value = rememberedUsername;
			document.getElementById('rememberMe').checked = true;
		}
	});

	// 注册表单验证和提交
	document.getElementById('registerForm').addEventListener('submit', function(e) {
		e.preventDefault();
		    const username = document.getElementById('registerUsername');
		    const email = document.getElementById('registerEmail');
		    const password = document.getElementById('registerPassword');
		    const confirmPassword = document.getElementById('confirmPassword');

		clearErrors();

		// 依次验证字段
		if (!validateUsername(username)) return;
		if (!validateEmail(email)) return;
		if (!validatePassword(password)) return;
		if (!validateConfirmPassword(password, confirmPassword)) return;

		// 如果所有字段均通过验证，提交表单
		alert('注册成功！');
		console.log('注册信息:', {
			username: username.value,
			email: email.value,
			password: password.value,
		});
	});

	// 验证用户名
	function validateUsername(input) {
		if (!input.value.trim()) {
			showError(input, '用户名不能为空');
			return false;
		}
		if (input.value.length < 3) {
			showError(input, '用户名长度必须至少3个字符');
			return false;
		}
		return true;
	}
	
	// 验证邮箱
	function validateEmail(input) {
		const trimmedEmail = input.value.trim();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!trimmedEmail) {
			showError(input, '邮箱不能为空');
			return false;
		}
		if (!emailRegex.test(trimmedEmail)) {
			showError(input, '请输入有效的邮箱地址');
			return false;
		}
		return true;
	}
	
	// 验证密码
	function validatePassword(input) {
		if (!input.value.trim()) {
			showError(input, '密码不能为空');
			return false;
		}
		if (input.value.length < 6) {
			showError(input, '密码长度必须大于6位');
			return false;
		}
		if (/[ ' \\ = *]/.test(input.value)) {
			showError(input, '密码不能包含特殊字符 \' \\ = * 等');
			return false;
		}
		return true;
	}
	
	// 验证确认密码
	function validateConfirmPassword(passwordInput, confirmPasswordInput) {
	    if (confirmPasswordInput.value !== passwordInput.value) {
	        showError(confirmPasswordInput, '两次输入的密码不一致');
	        return false;
	    }
	    return true;
	}

	// 显示错误信息
	function showError(input, message) {
	    // 查找输入框所在的父容器 .input-group 中的 .error-message
	    const errorElement = input.closest('.input-group').querySelector('.error-message');
	    if (errorElement) {
	        errorElement.textContent = message; // 设置错误提示内容
	        input.classList.add('error'); // 给输入框添加错误样式
	    }
	}

	// 清除所有错误信息
	function clearErrors() {
	    document.querySelectorAll('.error-message').forEach(error => {
	        error.textContent = '';
	    });
	    document.querySelectorAll('input').forEach(input => {
	        input.classList.remove('error');
	    });
	}

});