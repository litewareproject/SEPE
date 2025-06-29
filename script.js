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
          <img src="/fotors/Sepe Concept ${isWhite ? 4 : 1}.webp" alt="${item}">
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

// Carousel functionality with smooth animation
document.querySelectorAll('.carousel').forEach((carousel, index) => {
  const images = carousel.querySelectorAll('img');
  let currentIndex = 0;
  const dots = [];

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
  }
});

// Telegram Mini App initialization
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand(); // Расширяем на полный экран
  document.body.style.backgroundColor = window.Telegram.WebApp.themeParams.bg_color || '#fff';
  document.body.style.color = window.Telegram.WebApp.themeParams.text_color || '#000';
  // Обновляем цвета кнопок и других элементов при смене темы
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