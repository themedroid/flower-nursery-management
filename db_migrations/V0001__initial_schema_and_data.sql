CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    badge VARCHAR(50),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author VARCHAR(100) DEFAULT 'Бал цветов',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    customer_address TEXT,
    total_amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_method VARCHAR(50),
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, price, description, image_url, badge, stock) VALUES
('Пион Пинк Гавайи Корал', 'peonies', 1300, 'Роскошный коралово-розовый пион с крупными махровыми цветами. Отличается длительным цветением и устойчивостью к болезням.', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg', NULL, 15),
('Пион Команд Перфект', 'peonies', 1400, 'Идеальный махровый пион с плотными лепестками и насыщенным ароматом. Высота куста до 90 см.', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg', NULL, 12),
('Пион Сара Бернард', 'peonies', 1000, 'Классический розовый пион, один из самых популярных сортов. Цветёт в середине июня, морозоустойчив.', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg', NULL, 20),
('Пион Бартзелло', 'peonies', 1600, 'Редкий жёлтый пион с уникальной окраской. Ароматный, долго стоит в срезке. Эксклюзивный сорт.', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg', 'Хит', 8),
('Клематис фиолетовый крупноцветковый', 'clematis', 800, 'Изящная лиана с крупными фиолетовыми цветами до 15 см в диаметре. Цветёт обильно с июня по сентябрь.', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/464f7346-294d-460e-abe8-38d79ca5af8c.jpg', NULL, 18),
('Клематис белоснежный', 'clematis', 850, 'Элегантный белоснежный сорт с махровыми цветами. Идеален для арок и беседок.', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/464f7346-294d-460e-abe8-38d79ca5af8c.jpg', NULL, 15),
('Княжик альпийский', 'other', 900, 'Эксклюзивный сорт княжика с мелкими изящными цветами. Морозоустойчив, неприхотлив.', '/placeholder.svg', 'Новинка', 10),
('Гортензия метельчатая Ванилла Фрейз', 'shrubs', 1200, 'Популярный сорт с белыми цветами, розовеющими к осени. Высота до 2 метров.', '/placeholder.svg', 'Хит', 14),
('Гортензия крупнолистная', 'shrubs', 1100, 'Классическая садовая гортензия с шаровидными соцветиями. Цвет зависит от кислотности почвы.', '/placeholder.svg', NULL, 16),
('Семена гибискуса микс', 'seeds', 250, 'Семена гибискуса американской селекции. Разнообразие расцветок. Упаковка 10 шт.', '/placeholder.svg', NULL, 50),
('Семена мальвы махровой', 'seeds', 200, 'Высокорослые мальвы с махровыми цветами. Высота до 2 метров. Упаковка 20 шт.', '/placeholder.svg', NULL, 40),
('Удобрение для цветущих растений', 'fertilizers', 350, 'Органическое удобрение для пионов, роз и других цветов. Вес: 1 кг.', '/placeholder.svg', NULL, 30),
('Стимулятор роста корней', 'fertilizers', 280, 'Биостимулятор для лучшего укоренения саженцев. Объём: 500 мл.', '/placeholder.svg', NULL, 25);

INSERT INTO blog_posts (title, content, excerpt, image_url, published) VALUES
('Как правильно посадить пион', 'Пионы — это роскошные многолетники, которые при правильной посадке будут радовать вас десятилетиями. Вот основные правила посадки:\n\n1. **Выбор места**: Пионы любят солнечные места, защищенные от ветра.\n2. **Почва**: Предпочитают плодородную, хорошо дренированную почву с нейтральной или слабощелочной реакцией.\n3. **Глубина посадки**: Почки должны быть заглублены не более чем на 3-5 см от уровня почвы.\n4. **Расстояние**: Между кустами соблюдайте расстояние 80-100 см.\n5. **Полив**: После посадки обильно полейте и замульчируйте.\n\nПионы не любят пересадок, поэтому сразу выбирайте постоянное место!', 'Полное руководство по посадке пионов: выбор места, подготовка почвы, глубина посадки', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg', true),
('Уход за клематисами: секреты обильного цветения', 'Клематисы — это великолепные лианы, которые могут украсить любой сад. Чтобы они радовали обильным цветением:\n\n**Обрезка**: Самый важный момент. Группы обрезки различаются в зависимости от сорта.\n\n**Полив**: Клематисы любят влагу, но не переносят застоя воды. Поливайте регулярно, особенно в жаркую погоду.\n\n**Подкормка**: Весной — азотные удобрения, летом — комплексные, осенью — калийно-фосфорные.\n\n**Мульчирование**: Корни должны быть в тени, а побеги на солнце. Мульчируйте приствольный круг.\n\n**Опора**: Обязательно установите надежную опору высотой 2-3 метра.', 'Как добиться пышного цветения клематисов: правила обрезки, полива и подкормки', 'https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/464f7346-294d-460e-abe8-38d79ca5af8c.jpg', true),
('Новинки 2025: эксклюзивные сорта княжиков', 'В этом сезоне мы рады представить коллекцию редких княжиков — близких родственников клематисов.\n\nКняжики отличаются:\n- Повышенной морозостойкостью (до -40°C)\n- Более ранним цветением (май-июнь)\n- Неприхотливостью в уходе\n- Устойчивостью к болезням\n\nВ нашем ассортименте:\n- Княжик альпийский — классический сорт с голубыми колокольчиками\n- Княжик охотский — редкий дальневосточный вид\n- Княжик крупнолепестный — с крупными белыми цветами\n\nЗаказы принимаем уже сейчас! Количество ограничено.', 'Познакомьтесь с редкими княжиками — морозостойкими и неприхотливыми лианами для вашего сада', '/placeholder.svg', true);
