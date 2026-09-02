/**
 * loading.js — helper loading spinner & skeleton
 * File tambahan; tidak mengubah store.js.
 */
(function (global) {
  'use strict';

  var DEFAULT_DELAY = 700;
  var SAFETY_MS = 4000;
  var hidden = false;

  function hidePageLoader() {
    if (hidden) return;
    hidden = true;
    var el = document.getElementById('pageLoader');
    if (!el) return;
    el.classList.add('is-hidden');
    el.setAttribute('aria-busy', 'false');
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 400);
  }

  function withLoading(callback, delay) {
    var ms = typeof delay === 'number' ? delay : DEFAULT_DELAY;
    setTimeout(function () {
      try {
        if (typeof callback === 'function') callback();
      } finally {
        hidePageLoader();
      }
    }, ms);
  }

  function revealContent(skeletonId, contentId) {
    var sk = document.getElementById(skeletonId);
    if (sk) sk.classList.add('is-done');
    if (contentId) {
      var ct = document.getElementById(contentId);
      if (ct) ct.classList.remove('is-loading-content');
    }
  }

  function pageReady(delay) {
    withLoading(function () {}, delay);
  }

  function armSafety() {
    setTimeout(function () {
      hidePageLoader();
      var locked = document.querySelectorAll('.is-loading-content');
      for (var i = 0; i < locked.length; i++) {
        locked[i].classList.remove('is-loading-content');
      }
      var skels = document.querySelectorAll('.skeleton-wrap:not(.is-done)');
      for (var j = 0; j < skels.length; j++) {
        skels[j].classList.add('is-done');
      }
    }, SAFETY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', armSafety);
  } else {
    armSafety();
  }

  global.PageLoading = {
    hidePageLoader: hidePageLoader,
    withLoading: withLoading,
    revealContent: revealContent,
    pageReady: pageReady,
    DEFAULT_DELAY: DEFAULT_DELAY
  };
})(typeof window !== 'undefined' ? window : this);
