(function() {
const css = `
	.ytp-mute-button {
		background: var(--yt-spec-static-overlay-additive-background,rgba(40,40,40,.6)) !important;

		height: 40px;
		border-radius: 28px;

		padding: 0;

	}
	
	.ytp-button {
		opacity: .9 !important;
	}

  /* 1. Popover layout (unchanged) */
  .ytp-volume-popover {
	bottom: 15px !important;
	left: 160px;
  
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    white-space: nowrap !important;
  }

  /* 2. Reset container sizing/orientation */
  .ytp-volume-popover .ytp-input-slider-section,
  .ytp-volume-popover .ytp-vertical-slider {
    display: flex !important;
    flex-direction: row !important;
    width: auto !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 3. Rotate the actual slider 180° to invert direction */
  .ytp-volume-popover .ytp-input-slider {
    transform: rotate(180deg) !important;
    writing-mode: horizontal-tb !important;
    width: 100px !important;
    height: 6px !important;
    min-width: 0 !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    flex-shrink: 0 !important;
    -webkit-appearance: none !important;
    appearance: none !important;
  }

  /* 4. (Optional) Thumb sizing */
  .ytp-volume-popover .ytp-input-slider::-webkit-slider-thumb {
    width: 12px !important;
    height: 12px !important;
  }
`;
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);




  function moveElements() {
    const player = document.querySelector('.html5-video-player');
    if (!player) return;

    const leftControls = player.querySelector('.ytp-left-controls');
    const nextBtn      = leftControls && leftControls.querySelector('.ytp-next-button.ytp-button');
    const muteBtn      = player.querySelector('.ytp-mute-button.ytp-button');
    const timeDisplay  = leftControls && leftControls.querySelector('.ytp-time-display.notranslate');

    if (leftControls && nextBtn && muteBtn && !leftControls.contains(muteBtn)) {
      // Insert Mute button right after the Next button
      leftControls.insertBefore(muteBtn, nextBtn.nextSibling);
    }

    // Move volume popover into left-controls (so it follows the moved button)
    const popover = player.querySelector('.ytp-volume-popover');
    if (popover && muteBtn && popover.parentElement !== muteBtn.parentElement) {
      muteBtn.parentElement.appendChild(popover);
    }

    // Add hover listeners to shift time display
    if (muteBtn && timeDisplay) {
      muteBtn.addEventListener('mouseenter', () => {
        const popW = popover ? popover.offsetWidth : 0;
        timeDisplay.style.transition = 'margin-left 0.1s';
        timeDisplay.style.marginLeft = (popW + 8) + 'px';
      });
      muteBtn.addEventListener('mouseleave', () => {
        timeDisplay.style.marginLeft = '';
      });
    }
  }

  // Initial attempt
  moveElements();

  // Watch for dynamic re-builds
  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.addedNodes.length) {
        moveElements();
        break;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
