'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  useEffect(() => {
    const isFormElement = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
    };

    const onFocusIn = (event: FocusEvent) => {
      if (isFormElement(event.target)) {
        document.body.classList.add('keyboard-open');
      }
    };

    const onFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement) || !isFormElement(active)) {
          document.body.classList.remove('keyboard-open');
        }
      }, 80);
    };

    const viewport = window.visualViewport;
    const onViewportResize = () => {
      if (!viewport) return;
      const keyboardLikelyOpen = window.innerHeight - viewport.height > 140;
      document.body.classList.toggle('keyboard-open', keyboardLikelyOpen);
    };

    window.addEventListener('focusin', onFocusIn);
    window.addEventListener('focusout', onFocusOut);
    viewport?.addEventListener('resize', onViewportResize);

    return () => {
      window.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('focusout', onFocusOut);
      viewport?.removeEventListener('resize', onViewportResize);
      document.body.classList.remove('keyboard-open');
    };
  }, []);

  return null;
}
