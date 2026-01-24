function downloadPDF() {
  let element = document.getElementById("privacy-content");
  let filename = 'CeylonVisor-Privacy Policy.pdf';
  if (!element) {
    element = document.getElementById("terms-content");
    filename = 'CeylonVisor-Terms and Conditions.pdf';
  }
  if (!element) return;

  const sidebar = element.querySelector('.sidebar');
  const contentGrid = element.querySelector('.content-grid');

  // Store original styles to restore them later
  const originalSidebarDisplay = sidebar ? sidebar.style.display : null;
  const originalGridColumns = contentGrid ? contentGrid.style.gridTemplateColumns : null;
  const originalFontSize = element.style.fontSize;

  // Temporarily hide sidebar and adjust grid to make content full-width for the PDF
  if (sidebar) {
    sidebar.style.display = 'none';
  }
  if (contentGrid) {
    contentGrid.style.gridTemplateColumns = '1fr';
  }

  // Temporarily reduce font size for a more compact PDF layout
  element.style.fontSize = '12px';

  const options = {
    margin: 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  const promise = typeof html2pdf !== 'undefined'
    ? html2pdf().set(options).from(element).save()
    : Promise.reject('html2pdf not found');

  promise.catch(err => console.error("PDF generation failed:", err))
    .finally(() => {
      // Restore original styles after PDF is saved or if an error occurs
      if (sidebar) {
        sidebar.style.display = originalSidebarDisplay;
      }
      if (contentGrid) {
        contentGrid.style.gridTemplateColumns = originalGridColumns;
      }

      // Restore original font size
      element.style.fontSize = originalFontSize;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-slide-left, .reveal-slide-right');
  revealElements.forEach(el => observer.observe(el));

});


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      // Optional: Close other items
      document.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });
});