# ArtNotis
This is a library for quick and easy creation of custom notifications with flexible settings and a simple usage structure.
# Документация по библиотеке ArtNotis

Библиотека ArtNotis — это простая и гибкая JavaScript-библиотека для создания всплывающих уведомлений (тостов) в веб-приложениях. Она позволяет отображать сообщения разных типов (success, error, info, warning) с кастомизацией внешнего вида, анимациями, кнопками, прогресс-баром и другими функциями. Библиотека написана на чистом JavaScript (ES6), не зависит от фреймворков и легко интегрируется в любой проект.

Ключевые особенности:
- Поддержка разных типов уведомлений с предопределёнными стилями.
- Кастомизация позиции, размера, стилей, иконок и анимаций.
- Автоматическое закрытие с паузой на hover и прогресс-баром.
- Добавление кнопок с ссылками и кастомной логикой.
- Поддержка как предопределённых углов экрана, так и точной позиции в пикселях/процентах.
- Лёгкое использование: одна строка кода для создания уведомления.

## Основное использование

Создайте уведомление с помощью конструктора:
```javascript
new Notification({
  message: 'Привет, это уведомление!',
  type: 'success',
  duration: 5000
});
```

Или через глобальную функцию:
```javascript
notify({
  message: 'Ошибка произошла.',
  type: 'error'
});
```

Уведомление появится в указанной позиции, с анимацией и автоматически закроется через заданное время.

## Опции конструктора

Все опции передаются в объекте при создании экземпляра. По умолчанию используются разумные значения.

| Опция              | Тип                  | По умолчанию | Описание |
|--------------------|----------------------|--------------|----------|
| `type`            | string              | 'info'      | Тип уведомления: 'success', 'error', 'info', 'warning'. Определяет цвет и иконку. |
| `message`         | string              | 'Default message' | Текст уведомления. |
| `duration`        | number              | 3000        | Время отображения в миллисекундах. 0 — бесконечно (не закрывается автоматически). |
| `position`        | string \| object    | 'top-right' | Позиция: строки — 'top-right', 'top-left', 'bottom-right', 'bottom-left'. Объект — { top: '100px', left: '200px' } (или bottom/right; поддерживает px, %, vh и т.д.). Если объект — уведомление позиционируется абсолютно, без стекинга. |
| `onClose`         | function \| null    | null        | Колбэк, вызываемый при закрытии уведомления. |
| `customClass`     | string              | ''          | Кастомный CSS-класс для добавления к уведомлению. |
| `customIcon`      | string \| null      | null        | Кастомная иконка (HTML-строка, например, '<svg>...</svg>' или emoji). Заменяет стандартную. |
| `customStyles`    | object              | {}          | Объект inline-стилей для уведомления (например, { backgroundColor: '#000', color: '#fff' }). |
| `animationType`   | string              | 'fade'      | Тип анимации: 'fade', 'slide', 'bounce', 'zoom', 'flip'. |
| `autoClose`       | boolean             | true        | Автоматическое закрытие по истечении duration. |
| `closeButton`     | boolean             | true        | Показывать кнопку закрытия ('×'). |
| `progressBar`     | boolean             | false       | Показывать прогресс-бар (только если autoClose=true и duration>0). |
| `buttons`         | array               | []          | Массив кнопок: каждый элемент — объект { text: string, href?: string, style?: object, onClick?: function }. Если href — кнопка становится ссылкой. style — inline-стили для кнопки. |
| `pauseOnHover`    | boolean             | false       | Пауза таймера при наведении мыши (только если autoClose=true и duration>0). |
| `size`            | object              | {}          | Размер уведомления: { width: '300px', height: 'auto' } (поддерживает px, %, auto и т.д.). |

## Методы

Экземпляр Notification имеет следующие методы (обычно не нужно вызывать вручную, но можно):

- `show()`: Отображает уведомление (вызывается автоматически).
- `close()`: Закрывает уведомление с анимацией.
- `pauseTimer()`: Ставит таймер на паузу (используется internally для pauseOnHover).
- `resumeTimer()`: Возобновляет таймер.
- `startTimer()`: Запускает таймер (internal).

## CSS-классы и кастомизация

Библиотека использует BEM-подобную нотацию для классов. Вы можете переопределять стили в своём CSS.

### Основные классы:
- `.notification`: Базовый класс уведомления.
- `.notification--{type}`: Для типов (например, `.notification--success` — зелёная граница).
- `.notification--anim-{type}`: Для анимаций (например, `.notification--anim-fade`).
- `.notification--{position}`: Для предопределённых позиций (internal).
- `.notification__icon`: Иконка.
- `.notification__message`: Текст сообщения.
- `.notification__close`: Кнопка закрытия.
- `.notification__progress`: Прогресс-бар.
- `.notification__buttons`: Контейнер кнопок.
- `.notification__button`: Каждая кнопка.

### Контейнеры:
- `.notifications-container`: Общий контейнер для стекинга уведомлений.
- `.notifications-container--{position}`: Для конкретных позиций.

### Анимации:
Анимации определены в CSS с keyframes. Например, для 'bounce' — анимация подпрыгивания.

### Кастомизация стилей:
- Добавьте свои правила в CSS, переопределяя классы.
- Используйте `customClass` для уникальных стилей.
- Для кнопок: Передавайте `style` в объекте buttons (inline-стили имеют приоритет).

Пример кастомного CSS:
```css
.my-custom-class {
  background-color: #333;
  color: #fff;
  border-radius: 20px;
}
```

## Примеры

### Простое уведомление
```javascript
new Notification({
  message: 'Успех!',
  type: 'success',
  duration: 3000,
  position: 'top-right'
});
```

### С кнопками (пример куки)
```javascript
new Notification({
  message: 'Принять куки?',
  type: 'info',
  autoClose: false,
  buttons: [
    { text: 'Да', onClick: () => console.log('Accepted'), style: { backgroundColor: '#4caf50', color: 'white' } },
    { text: 'Нет', href: '#reject', style: { backgroundColor: '#f44336', color: 'white' } }
  ]
});
```

### Кастомная позиция и размер
```javascript
new Notification({
  message: 'Кастомная позиция',
  position: { top: '50px', right: '100px' },
  size: { width: '400px', height: '150px' },
  animationType: 'bounce',
  pauseOnHover: true,
  progressBar: true
});
```

### С кастомной иконкой и стилями
```javascript
new Notification({
  message: 'Инфо',
  customIcon: '<img src="custom-icon.png" alt="icon">',
  customStyles: { fontFamily: 'Arial', border: '2px dashed blue' },
  customClass: 'my-class'
});
```

## Ограничения и советы
- Библиотека не поддерживает стекинг для кастомных позиций (объект position) — каждое уведомление независимо.
- Для 'slide'-анимации позиция влияет на направление (left/right).
- Если duration=0, уведомление не закроется автоматически, даже с progressBar.
- Тестируйте в разных браузерах; анимации используют CSS transitions и keyframes (поддержка в IE10+).
- Интеграция с фреймворками: В React используйте в useEffect; в Vue — в mounted.
- Если кнопки не стилизуются: Убедитесь, что свойства в style полные (например, border: '1px solid #000') и нет конфликтов с базовыми стилями.
