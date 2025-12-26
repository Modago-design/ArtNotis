// notifications.js

class Notification {
  constructor(options = {}) {
    this.type = options.type || 'info';
    this.message = options.message || 'Default message';
    this.duration = options.duration || 3000;
    this.position = options.position || 'top-right'; // Строка или объект { top: '100px', left: '200px' }
    this.onClose = options.onClose || null;
    this.customClass = options.customClass || '';
    this.customIcon = options.customIcon || null;
    this.customStyles = options.customStyles || {};
    this.animationType = options.animationType || 'fade';
    this.autoClose = options.autoClose !== undefined ? options.autoClose : true;
    this.closeButton = options.closeButton !== undefined ? options.closeButton : true;
    this.progressBar = options.progressBar || false;
    this.buttons = options.buttons || [];
    this.pauseOnHover = options.pauseOnHover || false;
    this.size = options.size || {}; // { width: '300px', height: 'auto' }

    this.remainingTime = this.duration;
    this.isCustomPosition = typeof this.position === 'object';
    this.createElement();
    this.show();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('notification', `notification--${this.type}`, `notification--anim-${this.animationType}`);
    if (this.customClass) this.element.classList.add(this.customClass);
    Object.assign(this.element.style, this.customStyles);
    Object.assign(this.element.style, this.size); // Применяем размер

    const icon = this.customIcon ? this.createCustomIcon() : this.getIcon();
    const message = document.createElement('span');
    message.textContent = this.message;
    message.classList.add('notification__message');

    this.element.appendChild(icon);
    this.element.appendChild(message);

    if (this.buttons.length > 0) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('notification__buttons');
      this.buttons.forEach(btn => {
        const buttonElement = btn.href ? document.createElement('a') : document.createElement('button');
        buttonElement.textContent = btn.text || 'Button';
        buttonElement.classList.add('notification__button');
        if (btn.href) buttonElement.href = btn.href;
        if (btn.style) Object.assign(buttonElement.style, btn.style);
        if (btn.onClick) buttonElement.addEventListener('click', btn.onClick);
        buttonsContainer.appendChild(buttonElement);
      });
      this.element.appendChild(buttonsContainer);
    }

    if (this.closeButton) {
      const closeBtn = document.createElement('button');
      closeBtn.classList.add('notification__close');
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', () => this.close());
      this.element.appendChild(closeBtn);
    }

    if (this.progressBar && this.autoClose && this.duration > 0) {
      this.progress = document.createElement('div');
      this.progress.classList.add('notification__progress');
      this.element.appendChild(this.progress);
    }

    // Позиционирование
    if (this.isCustomPosition) {
      // Абсолютная позиция для кастомного объекта
      this.element.style.position = 'absolute';
      Object.assign(this.element.style, this.position); // Применяем { top, left, bottom, right }
      document.body.appendChild(this.element);
    } else {
      // Стандартный контейнер для предопределённых позиций
      this.element.classList.add(`notification--${this.position}`);
      let container = document.querySelector(`.notifications-container--${this.position}`);
      if (!container) {
        container = document.createElement('div');
        container.classList.add('notifications-container', `notifications-container--${this.position}`);
        document.body.appendChild(container);
      }
      container.appendChild(this.element);
    }

    if (this.pauseOnHover && this.autoClose && this.duration > 0) {
      this.element.addEventListener('mouseenter', () => this.pauseTimer());
      this.element.addEventListener('mouseleave', () => this.resumeTimer());
    }
  }

  getIcon() {
    const icon = document.createElement('span');
    icon.classList.add('notification__icon');
    switch (this.type) {
      case 'success': icon.innerHTML = '✔'; break;
      case 'error': icon.innerHTML = '✖'; break;
      case 'warning': icon.innerHTML = '⚠'; break;
      case 'info':
      default: icon.innerHTML = 'ℹ'; break;
    }
    return icon;
  }

  createCustomIcon() {
    const icon = document.createElement('span');
    icon.classList.add('notification__icon');
    icon.innerHTML = this.customIcon;
    return icon;
  }

  show() {
    setTimeout(() => {
      this.element.classList.add('notification--visible');
      if (this.progressBar && this.autoClose && this.duration > 0) {
        this.progress.style.animation = `progress ${this.duration}ms linear forwards`;
      }
    }, 100);

    if (this.autoClose && this.duration > 0) {
      this.startTimer();
    }
  }

  startTimer() {
    this.timeout = setTimeout(() => this.close(), this.remainingTime);
    if (this.progressBar) {
      this.progress.style.animationPlayState = 'running';
    }
  }

  pauseTimer() {
    clearTimeout(this.timeout);
    if (this.progressBar) {
      this.progress.style.animationPlayState = 'paused';
    }
  }

  resumeTimer() {
    this.startTimer();
  }

  close() {
    this.element.classList.remove('notification--visible');
    setTimeout(() => {
      this.element.remove();
      if (this.onClose) this.onClose();
    }, 500);
    clearTimeout(this.timeout);
  }
}

// Экспорт
export default Notification;
window.notify = (options) => new Notification(options);