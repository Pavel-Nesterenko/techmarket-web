
const products = [
  {
    id: 1,
    name: 'Смарт ТВ приставка',
    category: 'TV Box',
    price: 4990,
    description: '4K Ultra HD, 8/128 ГБ, Android',
    image: '/images/product1.jpeg',
    fullDescription:
      'Смарт ТВ приставка предназначена для просмотра ' +
      'мультимедийного контента и использования приложений ' +
      'на телевизоре.',
    specifications: {
      'Операционная система': 'Android TV 15',
      'Процессор': 'Cortex A53',
      'Оперативная память': '8 ГБ',
      'Встроенная память': '128 ГБ',
      'Разрешение': '4K Ultra HD'
    }
  },
  {
    id: 2,
    name: 'Смарт ТВ приставка Mini',
    category: 'TV Stick',
    price: 2990,
    description: 'Full HD, 2/16 ГБ, Android',
    image: '/images/product2.jpeg',
    fullDescription:
      'Компактная смарт ТВ приставка Mini позволяет ' +
      'смотреть видео и пользоваться приложениями ' +
      'на телевизоре. Поддерживает разрешение Full HD.',
    specifications: {
      'Операционная система': 'Android',
      'Тип устройства': 'TV Stick',
      'Оперативная память': '2 ГБ',
      'Встроенная память': '16 ГБ',
      'Разрешение': 'Full HD'
    }
  },
  {
    id: 3,
    name: 'Цифровой ТВ ресивер',
    category: 'TV ресивер',
    price: 1990,
    description: 'DVB-T2, HDMI, USB',
    image: '/images/product1.jpeg',
    fullDescription:
      'Цифровой ТВ ресивер предназначен для приёма ' +
      'цифрового эфирного телевидения DVB-T2. ' +
      'Оснащён разъёмами HDMI и USB.',
    specifications: {
      'Стандарт телевидения': 'DVB-T2',
      'Подключение': 'HDMI',
      'USB': 'Есть',
      'Тип устройства': 'Цифровой ТВ ресивер'
    }
  }
];

module.exports = products;
