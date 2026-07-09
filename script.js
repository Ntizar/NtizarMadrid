document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');
    const totalPanels = panels.length;
    
    // Set first panel as active
    panels[0].classList.add('active');

    let isScrolling = false;
    let currentPanel = 0;
    let touchStartY = 0;

    // Handle scroll/wheel
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        if (e.deltaY > 0) {
            // Scroll down
            if (currentPanel < totalPanels - 1) {
                isScrolling = true;
                panels[currentPanel].classList.remove('active');
                currentPanel++;
                panels[currentPanel].classList.add('active');
                
                // Smooth transition delay
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        } else if (e.deltaY < 0) {
            // Scroll up
            if (currentPanel > 0) {
                isScrolling = true;
                panels[currentPanel].classList.remove('active');
                currentPanel--;
                panels[currentPanel].classList.add('active');
                
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        }
    });

    // Handle touch events for mobile
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0 && currentPanel < totalPanels - 1) {
                // Swipe Up -> Next
                isScrolling = true;
                panels[currentPanel].classList.remove('active');
                currentPanel++;
                panels[currentPanel].classList.add('active');
                setTimeout(() => isScrolling = false, 800);
            } else if (diff < 0 && currentPanel > 0) {
                // Swipe Down -> Prev
                isScrolling = true;
                panels[currentPanel].classList.remove('active');
                currentPanel--;
                panels[currentPanel].classList.add('active');
                setTimeout(() => isScrolling = false, 800);
            }
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
            if (currentPanel < totalPanels - 1) {
                isScrolling = true;
                panels[currentPanel].classList.remove('active');
                currentPanel++;
                panels[currentPanel].classList.add('active');
                setTimeout(() => isScrolling = false, 800);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            if (currentPanel > 0) {
                isScrolling = true;
                panels[currentPanel].classList.remove('active');
                currentPanel--;
                panels[currentPanel].classList.add('active');
                setTimeout(() => isScrolling = false, 800);
            }
        }
    });
});
