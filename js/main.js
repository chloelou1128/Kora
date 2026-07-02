/* ============================================
   KORA — JS 滚动框架 & 动画控制
   ============================================ */

(function () {
  'use strict';

  /* ---------- 工具函数 ---------- */

  /**
   * 打字机效果
   * @param {Element} el - 目标元素
   * @param {number} speed - 每个字符的间隔 ms
   * @param {Function} [callback] - 完成回调
   */
  function typewriter(el, speed, callback) {
    var fullText = el.getAttribute('data-text') || el.textContent;
    if (!fullText) return;

    el.setAttribute('data-text', fullText);
    el.textContent = '';
    el.classList.add('typewriter-cursor');

    var i = 0;
    var timer = setInterval(function () {
      i++;
      el.textContent = fullText.slice(0, i);
      if (i >= fullText.length) {
        clearInterval(timer);
        el.classList.remove('typewriter-cursor');
        if (callback) callback();
      }
    }, speed);
  }

  /**
   * 显示气泡
   */
  function showBubble(el, delay, callback) {
    setTimeout(function () {
      el.classList.add('visible');

      // 对气泡内带 data-typewriter 的元素触发打字效果
      var twEls = el.querySelectorAll('[data-typewriter]');
      twEls.forEach(function (twEl) {
        var twSpeed = parseInt(twEl.getAttribute('data-typewriter'), 10) || 30;
        typewriter(twEl, twSpeed);
      });

      // 处理普通元素的打字效果（有 .typewriter 类的文本元素）
      var autoTwEls = el.querySelectorAll('.typewriter-text');
      autoTwEls.forEach(function (twEl, idx) {
        setTimeout(function () {
          var twSpeed = parseInt(twEl.getAttribute('data-tw-speed'), 10) || 25;
          typewriter(twEl, twSpeed);
        }, idx * 300);
      });

      if (callback) callback();
    }, delay);
  }

  /**
   * 隐藏气泡
   */
  function hideBubble(el, delay, callback) {
    setTimeout(function () {
      el.classList.remove('visible');
      el.classList.remove('active');
      if (callback) callback();
    }, delay);
  }

  /* ---------- 聊天气泡动画序列 ---------- */

  function animateChatSequence() {
    var userBubble = document.querySelector('.chat-bubble--user');
    var typingBubble = document.querySelector('.chat-bubble--typing');
    var botBubbles = document.querySelectorAll('.chat-bubble--bot:not(.chat-bubble--typing)');

    if (!userBubble || !typingBubble || botBubbles.length === 0) return;

    console.log('[KORA] Starting chat animation sequence');

    // 1. 用户气泡出现
    showBubble(userBubble, 200, function () {
      console.log('[KORA] User bubble shown');
    });

    // 2. typing indicator 出现
    setTimeout(function () {
      typingBubble.classList.add('active');
      typingBubble.classList.add('visible');
      console.log('[KORA] Typing indicator shown');
    }, 600);

    // 3. typing 持续 1.5s 后消失，开始出推荐
    hideBubble(typingBubble, 2100, function () {
      console.log('[KORA] Typing indicator hidden, showing recommendations');

      // 4. 餐厅推荐依次出现（每条间隔 600ms）
      botBubbles.forEach(function (bubble, index) {
        var delay = index * 600;
        showBubble(bubble, delay, function () {
          console.log('[KORA] Recommendation ' + (index + 1) + ' shown');
        });
      });
    });
  }

  /* ---------- Intersection Observer ---------- */

  var chatPlayed = false;
  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.2,
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;

      // 处理 data-animate（section 淡入）
      if (el.hasAttribute('data-animate')) {
        el.classList.add('visible');
      }

      // 处理 demo section 触发聊天气泡序列
      if (el.id === 'demo' && !chatPlayed) {
        chatPlayed = true;
        animateChatSequence();
      }

      // 处理 data-stagger（卡片/步骤依次出现）
      if (el.hasAttribute('data-stagger')) {
        var staggerIndex = parseInt(el.getAttribute('data-stagger'), 10);
        var staggerDelay = (staggerIndex - 1) * 200;
        setTimeout(function () {
          el.classList.add('visible');
        }, staggerDelay);
      }

      // 只触发一次
      observer.unobserve(el);
    });
  }, observerOptions);

  /* ---------- 注册观察目标 ---------- */

  function observeElements() {
    var targets = document.querySelectorAll('[data-animate], [data-stagger]');
    targets.forEach(function (el) {
      observer.observe(el);
    });

    // 聊天气泡不由 Observer 直接触发，单独注册 demo section
    var demoSection = document.getElementById('demo');
    if (demoSection) {
      observer.observe(demoSection);
    }

    console.log('[KORA] Observing ' + (targets.length + 1) + ' elements');
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
  } else {
    observeElements();
  }
})();
