// ==UserScript==
// @name         모든 텍스트 영역 크기 조절
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  여러 개의 텍스트 영역 크기를 독립적으로 조절
// @match        https://crack.wrtn.ai/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const targetSelector = 'textarea.rc-textarea';

    function applyResizeLogic(textarea) {
        if (textarea.dataset.resizeHandled) return;
        textarea.dataset.resizeHandled = 'true';

        textarea.classList.remove('resize-none');
        textarea.style.resize = 'vertical';
        textarea.style.maxHeight = 'none';
        textarea.style.minHeight = '66px';

        const maxLength = textarea.getAttribute('maxlength') || 'none';
        const similarTextareas = Array.from(document.querySelectorAll(`textarea.rc-textarea[maxlength="${maxLength}"]`));
        const index = similarTextareas.indexOf(textarea) !== -1 ? similarTextareas.indexOf(textarea) : 0;

        const storageKey = `saved-textarea-height-${maxLength}-${index}`;

        const savedHeight = localStorage.getItem(storageKey);
        if (savedHeight) {
            textarea.style.height = savedHeight;
        }

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const currentHeight = entry.target.style.height;
                if (currentHeight) {
                    localStorage.setItem(storageKey, currentHeight);
                }
            }
        });

        resizeObserver.observe(textarea);
    }

    const observer = new MutationObserver(() => {
        const textareas = document.querySelectorAll(targetSelector);
        textareas.forEach(textarea => applyResizeLogic(textarea));
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();