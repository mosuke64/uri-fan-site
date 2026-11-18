/**
 * ウリちゃん 公式ファンコミュニティ LP
 * メインスクリプト: インタラクション、紙吹雪演出、ギャラリー、モーダル、フォーム
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCelebrationConfetti();
  initGallery();
  initContactForm();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Navigation & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');

  // スクロール時のヘッダー装飾
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // モバイルメニューのトグル
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.innerHTML = isOpen 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // リンククリック時に閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. Celebration Confetti (1万人記念の紙吹雪＆ハートアニメーション)
   -------------------------------------------------------------------------- */
function initCelebrationConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#f26a8d', '#fcd5ce', '#ffb703', '#fb8500', '#ff85a1', '#ffd166'];
  let particles = [];
  let isRunning = false;
  let animationId = null;

  class Particle {
    constructor(x, y) {
      this.x = x ?? Math.random() * width;
      this.y = y ?? -20;
      this.size = Math.random() * 8 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 6;
      this.isHeart = Math.random() > 0.65; // 一部はハート型
      this.opacity = 1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.02) * 1.5;
      this.rotation += this.rotationSpeed;
      if (this.y > height - 100) {
        this.opacity -= 0.015;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        // Draw Heart
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 1.4, 0, this.size);
        ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 1.4, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      } else {
        // Draw Ribbon / Confetti rectangle
        ctx.fillRect(-this.size / 2, -this.size / 3, this.size, this.size * 0.7);
      }
      ctx.restore();
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles = particles.filter(p => p.opacity > 0 && p.y < height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(render);
    } else {
      isRunning = false;
      cancelAnimationFrame(animationId);
    }
  }

  window.triggerConfetti = function(count = 70) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * -height * 0.3));
    }
    if (!isRunning) {
      isRunning = true;
      render();
    }
  };

  // 初回ロード時にお祝い演出（少しディレイ）
  setTimeout(() => {
    window.triggerConfetti(50);
  }, 800);

  // お祝いボタンクリックイベント
  const celebrateBtn = document.getElementById('celebrate-btn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      window.triggerConfetti(90);
    });
  }
}

/* --------------------------------------------------------------------------
   3. Gallery Filter & Lightbox Modal
   -------------------------------------------------------------------------- */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  // フィルタリング処理
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Lightbox 開閉処理
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-thumb-img');
      const title = card.querySelector('.gallery-caption-title')?.textContent || '';
      const desc = card.querySelector('.gallery-caption-desc')?.textContent || '';

      if (lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Contact Form Validation & Submission Modal
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const successClose = document.getElementById('success-modal-close');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#user-name')?.value.trim();
    const email = form.querySelector('#user-email')?.value.trim();
    const message = form.querySelector('#user-message')?.value.trim();

    if (!name || !email || !message) {
      alert('必須項目をすべてご入力ください。');
      return;
    }

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    submitBtn.disabled = true;

    // 擬似送信通信（1.2秒）
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.triggerConfetti) {
          window.triggerConfetti(60);
        }
      }
    }, 1200);
  });

  if (successClose && successModal) {
    successClose.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
