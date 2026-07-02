/* ============================================
   KORA — JS 滚动框架 & 动画控制
   ============================================ */

(function () {
  'use strict';

  /* ---------- Intersection Observer ---------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.2,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;

      // 处理 data-animate
      if (el.hasAttribute('data-animate')) {
        el.classList.add('visible');
        console.log('[KORA] Section visible:', el.id || '(no id)');
      }

      // 处理 data-chat（气泡）
      if (el.hasAttribute('data-chat')) {
        var delay = parseInt(el.getAttribute('data-chat'), 10) * 150;
        setTimeout(function () {
          el.classList.add('visible');
        }, delay);
        console.log('[KORA] Chat bubble queued:', el.getAttribute('data-chat'));
      }

      // 处理 data-stagger（卡片/步骤）
      if (el.hasAttribute('data-stagger')) {
        var staggerIndex = parseInt(el.getAttribute('data-stagger'), 10);
        var staggerDelay = (staggerIndex - 1) * 200;
        setTimeout(function () {
          el.classList.add('visible');
        }, staggerDelay);
        console.log('[KORA] Stagger item queued:', staggerIndex);
      }

      // 只触发一次
      observer.unobserve(el);
    });
  }, observerOptions);

  /* ---------- 注册观察目标 ---------- */
  function observeElements() {
    var targets = document.querySelectorAll('[data-animate], [data-chat], [data-stagger]');
    targets.forEach(function (el) {
      observer.observe(el);
    });
    console.log('[KORA] Observing ' + targets.length + ' animated elements');
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
  } else {
    observeElements();
  }
})();
