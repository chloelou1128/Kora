/* ============================================
   KORA — JS 滚动框架 & 动画控制
   ============================================ */

(function () {
  'use strict';

  /* ---------- 工具：定时器管理 ---------- */
  var chatTimers = [];

  function chatTimeout(fn, delay) {
    var id = setTimeout(function () {
      fn();
      var idx = chatTimers.indexOf(id);
      if (idx > -1) chatTimers.splice(idx, 1);
    }, delay);
    chatTimers.push(id);
    return id;
  }

  function clearChatTimers() {
    chatTimers.forEach(function (id) { clearTimeout(id); });
    chatTimers = [];
  }

  /* ---------- 打字机效果 ---------- */

  var typewriterIntervals = [];

  function resetTypewriter(el) {
    var fullText = el.getAttribute('data-text');
    if (fullText) {
      el.textContent = fullText;
      el.classList.remove('typewriter-cursor');
    }
  }

  function typewriter(el, speed, callback) {
    var fullText = el.getAttribute('data-text');
    if (!fullText) {
      fullText = el.textContent;
      el.setAttribute('data-text', fullText);
    }
    if (!fullText) return;

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
    typewriterIntervals.push(timer);
  }

  function clearTypewriters() {
    typewriterIntervals.forEach(function (id) { clearInterval(id); });
    typewriterIntervals = [];
  }

  /* ---------- 聊天气泡 ---------- */

  function showBubble(el, delay, callback) {
    return chatTimeout(function () {
      el.classList.add('visible');

      var twEls = el.querySelectorAll('.typewriter-text');
      twEls.forEach(function (twEl, idx) {
        chatTimeout(function () {
          resetTypewriter(twEl);
          var twSpeed = parseInt(twEl.getAttribute('data-tw-speed'), 10) || 25;
          typewriter(twEl, twSpeed);
        }, idx * 300);
      });

      if (callback) callback();
    }, delay);
  }

  function resetChatSequence() {
    clearChatTimers();
    clearTypewriters();

    var allBubbles = document.querySelectorAll('.chat-bubble');
    allBubbles.forEach(function (bubble) {
      bubble.classList.remove('visible', 'active');
    });

    var twEls = document.querySelectorAll('#demo .typewriter-text');
    twEls.forEach(function (twEl) {
      resetTypewriter(twEl);
    });
  }

  var chatPlayed = false;

  function animateChatSequence() {
    resetChatSequence();

    var userBubble = document.querySelector('.chat-bubble--user');
    var typingBubble = document.querySelector('.chat-bubble--typing');
    var botBubbles = document.querySelectorAll('.chat-bubble--bot:not(.chat-bubble--typing)');

    if (!userBubble || !typingBubble || botBubbles.length === 0) return;

    // 1. 用户气泡
    showBubble(userBubble, 300);

    // 2. typing indicator
    chatTimeout(function () {
      typingBubble.classList.add('active', 'visible');
    }, 700);

    // 3. 隐藏 typing，依次弹出推荐
    chatTimeout(function () {
      typingBubble.classList.remove('visible', 'active');
      botBubbles.forEach(function (bubble, index) {
        showBubble(bubble, index * 600);
      });
    }, 2200);
  }

  /* ---------- Intersection Observer（双向触发）---------- */

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.2,
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;

      if (entry.isIntersecting) {
        /* ---- 进入视口 ---- */

        // Section 整体淡入
        if (el.hasAttribute('data-animate')) {
          el.classList.add('visible');
        }

        // 聊天气泡序列（demo section）
        if (el.id === 'demo' && !chatPlayed) {
          chatPlayed = true;
          animateChatSequence();
        }

        // Stagger 子元素：用 CSS 变量控制延迟
        if (el.hasAttribute('data-stagger')) {
          var staggerIndex = parseInt(el.getAttribute('data-stagger'), 10);
          el.style.setProperty('--stagger-delay', ((staggerIndex - 1) * 0.2) + 's');
          el.classList.add('visible');
        }

      } else {
        /* ---- 离开视口 ---- */

        if (el.hasAttribute('data-animate')) {
          el.classList.remove('visible');
        }

        // 离开 demo section 时重置聊天序列，下次进入可重播
        if (el.id === 'demo') {
          chatPlayed = false;
          resetChatSequence();
        }

        if (el.hasAttribute('data-stagger')) {
          el.classList.remove('visible');
        }
      }
    });
  }, observerOptions);

  /* ---------- 注册观察目标 ---------- */

  function observeElements() {
    var targets = document.querySelectorAll('[data-animate], [data-stagger]');
    targets.forEach(function (el) {
      observer.observe(el);
    });

    var demoSection = document.getElementById('demo');
    if (demoSection) {
      observer.observe(demoSection);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
  } else {
    observeElements();
  }
})();
