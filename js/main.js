(function () {
  'use strict';

  var replayFrame = 0;

  function setStaggerDelay(el) {
    var staggerIndex = parseInt(el.getAttribute('data-stagger'), 10);
    if (!Number.isFinite(staggerIndex)) return;
    el.style.setProperty('--stagger-delay', ((staggerIndex - 1) * 0.2) + 's');
  }

  function restartCoverageAnimation(section) {
    if (!section) return;

    section.classList.remove('is-replaying-map');
    section.offsetHeight; // Force style flush so CSS animations restart on every entry.

    cancelAnimationFrame(replayFrame);
    replayFrame = requestAnimationFrame(function () {
      section.classList.add('is-replaying-map');
    });
  }

  function handleEntry(entry) {
    var el = entry.target;

    if (entry.isIntersecting) {
      if (el.hasAttribute('data-stagger')) setStaggerDelay(el);
      el.classList.add('visible');

      if (el.id === 'coverage') {
        restartCoverageAnimation(el);
      }

      return;
    }

    el.classList.remove('visible');

    if (el.id === 'coverage') {
      el.classList.remove('is-replaying-map');
    }
  }

  function observeElements() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(handleEntry);
    }, {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.22,
    });

    document.querySelectorAll('[data-animate], [data-stagger]').forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
  } else {
    observeElements();
  }
})();
