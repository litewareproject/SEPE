let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName) {
  cart.push(productName);
  localStorage.setItem('cart', JSON.stringify(cart));
  const notification = document.getElementById('cart-notification');
  if (notification) {
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  }
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  if (cartItems && cartTotal) {
    cartItems.innerHTML = cart.map((item, index) => {
      const isWhite = item.includes('Белая');
      return `
        <div class="cart-item">
          <img src="Sepe Concept ${isWhite ? 4 : 1}.webp" alt="${item}">
          <div class="item-details">${item}</div>
          <i class="fas fa-trash remove-item" data-index="${index}"></i>
        </div>
      `;
    }).join('');
    const total = cart.reduce((sum, item) => sum + (item.includes('Белая') ? 2700 : 2750), 0);
    cartTotal.textContent = `${total}р`;

    document.querySelectorAll('.remove-item').forEach(icon => {
      icon.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
      });
    });
  }
}

function clearCart() {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
}

function buyNow() {
  window.location.href = 'https://t.me/Kerebere42o'; // Замените на свою ссылку Telegram
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
  }
}

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
  this.reset();
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
});

document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href === 'cart.html') {
      window.location.href = href;
    } else if (href === 'index.html') {
      window.location.href = href;
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Carousel functionality with touch and wheel
document.querySelectorAll('.carousel').forEach((carousel, index) => {
  const images = carousel.querySelectorAll('img');
  let currentIndex = 0;
  const dots = [];
  let startX = 0;
  let isDragging = false;

  if (images.length > 0) {
    images[currentIndex].classList.add('active');

    const dotsDiv = document.createElement('div');
    dotsDiv.classList.add('carousel-dots');
    for (let i = 0; i < images.length; i++) {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => goToSlide(i));
      dots.push(dot);
      dotsDiv.appendChild(dot);
    }
    dots[currentIndex].classList.add('active');
    carousel.parentNode.insertBefore(dotsDiv, carousel.nextSibling);

    let interval = setInterval(nextSlide, 3000);
    carousel.addEventListener('mouseover', () => clearInterval(interval));
    carousel.addEventListener('mouseout', () => {
      interval = setInterval(nextSlide, 3000);
    });

    // Touch events for carousel
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: false });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      if (diff > 50) {
        nextSlide();
        isDragging = false;
      } else if (diff < -50) {
        prevSlide();
        isDragging = false;
      }
      e.preventDefault();
    }, { passive: false });

    carousel.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Wheel event for carousel
    carousel.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }, { passive: false });
  }

  function goToSlide(index) {
    if (currentIndex !== index) {
      images[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');
      currentIndex = index;
      images[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
    }
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = nextIndex;
    images[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    images[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = prevIndex;
    images[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }
});

// Page navigation with touch swipe and wheel
let startY = 0;
document.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  const currentY = e.touches[0].clientY;
  const diff = startY - currentY;
  if (Math.abs(diff) > 50) {
    if (diff > 0 && window.location.pathname.includes('index.html')) {
      window.location.href = 'cart.html';
    } else if (diff < 0 && window.location.pathname.includes('cart.html')) {
      window.location.href = 'index.html';
    }
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchend', () => {
  startY = 0;
});

document.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (window.location.pathname.includes('index.html')) {
    const sections = document.querySelectorAll('section');
    if (sections.length > 0) {
      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      const currentSection = Array.from(sections).findIndex(section => {
        return section.getBoundingClientRect().top >= 0;
      });
      let nextSectionIndex = currentSection + scrollDirection;
      if (nextSectionIndex >= sections.length) {
        nextSectionIndex = sections.length - 1;
      } else if (nextSectionIndex < 0) {
        nextSectionIndex = 0;
      }
      sections[nextSectionIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }
}, { passive: false });

// Telegram Mini App initialization
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  document.body.style.backgroundColor = window.Telegram.WebApp.themeParams.bg_color || '#fff';
  document.body.style.color = window.Telegram.WebApp.themeParams.text_color || '#000';
  const updateTheme = () => {
    document.querySelectorAll('button').forEach(btn => {
      btn.style.backgroundColor = window.Telegram.WebApp.themeParams.button_color || '#000';
      btn.style.color = window.Telegram.WebApp.themeParams.button_text_color || '#fff';
    });
    document.querySelector('.cart-notification').style.backgroundColor = window.Telegram.WebApp.themeParams.button_color || '#000';
  };
  updateTheme();
  window.Telegram.WebApp.onEvent('themeChanged', updateTheme);
}
if (document.querySelector('.cart-page')) {
  updateCartDisplay();
}
