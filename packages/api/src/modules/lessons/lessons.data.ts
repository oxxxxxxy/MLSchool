import { Lesson, Badge } from '@ml-school/shared';

export const LESSONS_DATABASE: Lesson[] = [
  // LESSON 1
  {
    id: 1,
    slug: 'function-intro',
    title: 'Урок 1. Что такое функция? Машина, превращающая одно число в другое',
    subtitle: 'Первая идея, без которой невозможно понять Machine Learning: вход x, правило f(x) и выход y',
    durationMinutes: 15,
    xpReward: 150,
    icon: 'Brain',
    color: 'from-indigo-500 to-purple-600',
    summary: 'Узнаем, что функция — это автомат, превращающий вход x в выход y по строгому правилу f(x). Разберем рождение графика на координатной плоскости и запретные значения (деление на ноль).',
    sections: [
      {
        id: 'l1-conveyor',
        title: '💡 Блок 1. Магический конвейер',
        badge: 'Базовая интуиция',
        content: [
          'Представь автомат. Ты кладёшь внутрь число, автомат что-то с ним делает, и на другой стороне появляется новое число.',
          'Например, внутри написано: «Умножь вход на 2 и прибавь 1». Кладём $x = 3$ ➔ получаем $y = 7$.',
          'Такой автомат в математике называется функцией: $y = f(x)$ («Возьми x, обработай правилом f и получи y»).'
        ],
        keyTakeaway: 'Функция не угадывает ответ. Она строго выполняет своё правило для каждого входного числа.',
        sandboxId: 'function-conveyor'
      },
      {
        id: 'l1-one-to-one',
        title: '🔒 Блок 2. Один вход — один ответ',
        badge: 'Свойство функции',
        content: [
          'У обычной функции есть важное свойство: одному конкретному входу $x$ соответствует ровно один конкретный выход $y$.',
          'Если автомат получил $x = 5$, он не может сегодня сказать 8, а через секунду 27, если правило не поменялось. ML-модель — это тоже функция, получающая данные и выдающая результат.'
        ],
        keyTakeaway: 'Одному значению x всегда соответствует ровно одно значение f(x).'
      },
      {
        id: 'l1-graph-birth',
        title: '📈 Блок 3. Как появляется график на плоскости',
        badge: 'График',
        content: [
          'Каждый запуск функции создаёт пару чисел $(x, y)$. Например: $x = 2, y = 5$ ➔ точка $(2, 5)$.',
          'Если запустить функцию много раз и нарисовать все точки, появится её ГРАФИК — непрерывный визуальный след автомата!'
        ],
        keyTakeaway: 'График функции — это визуальный след всех пар (вход x, выход y) на плоскости координат.',
        sandboxId: 'cartesian-tracer-pro'
      },
      {
        id: 'l1-zero-danger',
        title: '⚠️ Блок 4. Запрещённые значения (Деление на ноль)',
        badge: 'Область определения',
        content: [
          'Иногда функция работает не со всеми числами. Например, в формуле $f(x) = \\frac{10}{x}$.',
          'Можно делить 10 на 2, на 0.5, на -4. Но нельзя делить на 0! Деление на 0 не даёт математического результата: это не бесконечность, результат просто не определён.'
        ],
        keyTakeaway: 'Для x = 0 функция 10/x не определена. Всегда нужно помнить о запретных делениях на 0.',
        sandboxId: 'sneak-to-zero'
      },
      {
        id: 'l1-rule-breaker',
        title: '🎮 Блок 5. Игра «Взломщик правил»',
        badge: 'Мини-игра',
        content: [
          'Формула внутри ящика спрятана! Посмотри на примеры пар чисел и отгадай скрытое математическое правило.'
        ],
        keyTakeaway: 'Наблюдая за парами (вход, выход), можно восстановить правило работы функции.',
        sandboxId: 'rule-breaker-game'
      }
    ],
    sandboxes: [
      { id: 'function-conveyor', type: 'FunctionConveyor', title: 'Конвейер функций', description: 'Бросай шары с числами.', defaultParams: {} },
      { id: 'cartesian-tracer-pro', type: 'CartesianTracerPro', title: 'Трассировщик графика', description: 'Светящийся след.', defaultParams: {} },
      { id: 'sneak-to-zero', type: 'SneakToZero', title: 'Подкрадись к нулю', description: 'Запретные деления.', defaultParams: {} },
      { id: 'rule-breaker-game', type: 'RuleBreakerGame', title: 'Взломщик правил', description: 'Угадай формулу.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q1-1',
        prompt: 'Если у нас есть функция $f(x) = 2x + 1$, чему равен выход $y$ при входном значении $x = 4$?',
        options: [
          { id: 'opt1', text: '9', isCorrect: true, explanation: 'Верно! 2 × 4 = 8, и 8 + 1 = 9.' },
          { id: 'opt2', text: '8', isCorrect: false, explanation: 'Не забудь прибавить 1.' }
        ],
        hint: 'Умножь 4 на 2 и прибавь 1.',
        points: 25
      }
    ]
  },

  // LESSON 2
  {
    id: 2,
    slug: 'linear-function',
    title: 'Урок 2. Линейная функция y = kx + b: Два числа, которые управляют прямой',
    subtitle: 'Наклон k, сдвиг b, треугольник крутизны, такси-калькулятор и прямая через 2 точки',
    durationMinutes: 20,
    xpReward: 200,
    icon: 'TrendingUp',
    color: 'from-blue-500 to-cyan-500',
    summary: 'Разбираем формулу y = kx + b. Коэффициент k отвечает за наклон (крутизну), а b — за высоту пересечения оси Y. Смотрим на тариф такси и строим прямую через две точки.',
    sections: [
      {
        id: 'l2-k-slope',
        title: '📐 Блок 1 & 2. Что делает k (Наклон и Знак)',
        badge: 'Наклон k',
        content: [
          'В формуле $y = kx$ число $k$ отвечает за крутизну. Когда $x$ увеличивается на $1$, $y$ увеличивается на $k$.',
          'Если $k > 0$ — прямая растет, если $k < 0$ — падает, если $k = 0$ — прямая горизонтальна.'
        ],
        keyTakeaway: 'k — угловой коэффициент: подъем y при шаге по x на 1 (Δy / Δx).',
        sandboxId: 'rotate-line-inspector'
      },
      {
        id: 'l2-b-shift',
        title: '🎛️ Блок 3. Что делает b (Два пульта управления)',
        badge: 'Сдвиг b',
        content: [
          'При $x = 0$ получаем $y = k \\cdot 0 + b = b$.',
          'Число $b$ двигает всю прямую вверх или вниз по вертикальной оси, не меняя её наклона.'
        ],
        keyTakeaway: 'Параметр b показывает точку пересечения прямой с осью Y.',
        sandboxId: 'two-dials-lab'
      },
      {
        id: 'l2-taxi',
        title: '🚖 Блок 4. Такси-Калькулятор',
        badge: 'Жизненный пример',
        content: [
          'Посадка стоит 100 рублей (это $b$), а каждый километр добавляет 30 рублей (это $k$).',
          'Итоговая цена: $\\text{Цена} = 30x + 100$.'
        ],
        keyTakeaway: 'Стартовая цена = b, тариф за километр = k.',
        sandboxId: 'taxi-fare-builder'
      },
      {
        id: 'l2-two-points',
        title: '📍 Блок 5. Прямая через две точки',
        badge: 'Геометрия',
        content: [
          'Зная точки $A(x_1, y_1)$ и $B(x_2, y_2)$, наклон находится как $k = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}$.',
          'Если $x_1 = x_2$ (вертикальная прямая), прямую нельзя записать как $y = kx + b$.'
        ],
        keyTakeaway: 'Наклон прямой — это всегда отношение подъема Δy к шагу Δx.',
        sandboxId: 'two-points-line-drag'
      }
    ],
    sandboxes: [
      { id: 'rotate-line-inspector', type: 'RotateLineInspector', title: 'Поверни прямую', description: 'Крути k.', defaultParams: {} },
      { id: 'two-dials-lab', type: 'TwoDialsLab', title: 'Два пульта', description: 'Крути k и b.', defaultParams: {} },
      { id: 'taxi-fare-builder', type: 'TaxiFareBuilder', title: 'Такси', description: 'Тариф поездки.', defaultParams: {} },
      { id: 'two-points-line-drag', type: 'TwoPointsLineDrag', title: 'Прямая через 2 точки', description: 'Тащи A и B.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q2-1',
        prompt: 'В уравнении $y = 3x - 5$, чему равен наклон k и в какой точке прямая пересекает ось Y?',
        options: [
          { id: 'opt1', text: 'k = 3 (наклон), пересекает Y в точке -5', isCorrect: true, explanation: 'Верно! k = 3, b = -5.' },
          { id: 'opt2', text: 'k = -5, пересекает Y в точке 3', isCorrect: false, explanation: 'k стоит перед x, а b — свободное число.' }
        ],
        hint: 'В формуле y = kx + b число перед x — это k, а свободное число — b.',
        points: 25
      }
    ]
  },

  // LESSON 3
  {
    id: 3,
    slug: 'derivative-and-gradient',
    title: 'Урок 3. Производная и градиент: Как узнать, куда функция растёт и куда падает',
    subtitle: 'Спидометр, стягивание секущей в касательную, градиент ∇L и спуск к минимуму -∇L',
    durationMinutes: 25,
    xpReward: 250,
    icon: 'Compass',
    color: 'from-amber-500 to-orange-600',
    summary: 'Производная — это спидометр мгновенных изменений. В 3D пространстве производная превращается в вектор градиента ∇L (рост) и антиградиента -∇L (спуск к минимуму ошибки).',
    sections: [
      {
        id: 'l3-speedometer',
        title: '🏎️ Блок 1 & 2. Мгновенная скорость и Наклон кривой',
        badge: 'Спидометр',
        content: [
          'Спидометр показывает скорость прямо сейчас. Производная показывает скорость изменения функции прямо в выбранной точке.',
          'Уменьшая шаг $\\Delta x \\to 0$, секущая линия превращается в касательную. Наклон касательной — это и есть производная!'
        ],
        keyTakeaway: 'Производная f\'(x) — это мгновенный наклон графика в конкретной точке.',
        sandboxId: 'secant-to-tangent'
      },
      {
        id: 'l3-slope-quest',
        title: '🧭 Блок 3. Знак производной: Куда идти вниз?',
        badge: 'Направление',
        content: [
          'Если $f\'(x) > 0$ — график растет. Если $f\'(x) < 0$ — падает. Если $f\'(x) = 0$ — точка минимума или максимума.'
        ],
        keyTakeaway: 'Чтобы уменьшить значение функции, нужно двигаться против знака производной.',
        sandboxId: 'slope-direction-quest'
      },
      {
        id: 'l3-gradient-bowl',
        title: '🏔️ Блок 4 & 5. 3D Чаша: Градиент ∇L vs Антиградиент -∇L',
        badge: '3D Градиент',
        content: [
          'Когда параметров два ($k$ и $b$), ошибка $L(k,b)$ образует 3D чашу.',
          'Градиент $\\nabla L$ показывает направление САМОГО БЫСТРОГО РОСТА ошибки. Но нам нужна маленькая ошибка! Поэтому при обучении мы идем $-\\nabla L$ (против градиента на дно чаши).'
        ],
        keyTakeaway: 'Обучение ML — это спуск по антиградиенту -∇L на дно чаши ошибки.',
        sandboxId: 'bowl-3d-gradient'
      },
      {
        id: 'l3-cv-example',
        title: '👁️ Блок 6. Градиенты в Компьютерном Зрении (CV)',
        badge: 'Применение в CV',
        content: [
          'Изображение для компьютера — это сетка чисел яркости пикселей. Резкий перепад яркости (производная) показывает границу предмета!'
        ],
        keyTakeaway: 'Контуры объектов в CV — это всплески производной яркости пикселей.',
        sandboxId: 'cv-edge-detection'
      }
    ],
    sandboxes: [
      { id: 'secant-to-tangent', type: 'SecantToTangentVisualizer', title: 'Секущая в касательную', description: 'Δx → 0.', defaultParams: {} },
      { id: 'slope-direction-quest', type: 'SlopeDirectionQuest', title: 'Квест: Куда идти вниз?', description: 'Знак производной.', defaultParams: {} },
      { id: 'bowl-3d-gradient', type: 'Bowl3DGradient', title: '3D Чаша и Градиент', description: '∇L и -∇L.', defaultParams: {} },
      { id: 'cv-edge-detection', type: 'CVEdgeDetectionDemo', title: 'Контуры CV', description: 'Градиенты пикселей.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q3-1',
        prompt: 'Куда указывает стрелка градиента ∇L и куда мы двигаемся во время обучения модели?',
        options: [
          { id: 'opt1', text: '∇L указывает вверх (рост ошибки), а мы идем вниз по -∇L (уменьшаем ошибку)', isCorrect: true, explanation: 'В яблочко! Градиент показывает подъем, а для обучения мы идем по антиградиенту.' },
          { id: 'opt2', text: '∇L всегда указывает вниз на дно', isCorrect: false, explanation: 'Градиент математически указывает в сторону быстрейшего роста.' }
        ],
        hint: 'Градиент = подъем, обучение = спуск (-∇L).',
        points: 25
      }
    ]
  },

  // LESSON 4
  {
    id: 4,
    slug: 'three-ml-tasks',
    title: 'Урок 4. Три главные задачи ML: Регрессия, классификация и кластеризация',
    subtitle: 'Понятия: признак x, target y, prediction ŷ, model f, parameters (k, b) и 3 парадигмы',
    durationMinutes: 20,
    xpReward: 200,
    icon: 'Sparkles',
    color: 'from-purple-500 to-indigo-600',
    summary: 'Узнаем разницу между классическим программированием и ML. Изучаем ключевой словарь: x, y, ŷ, модель, параметры и 3 суперсилы: регрессию, классификацию и кластеризацию.',
    sections: [
      {
        id: 'l4-paradigms',
        title: '🤖 Блок 1 & 2. Парадигма ML и словарь терминов',
        badge: 'Словарь ML',
        content: [
          '• **Признак ($x$)**: информация на входе модели (площадь, температура).',
          '• **Target ($y$)**: правильный ответ в обучающем примере.',
          '• **Prediction ($\\hat{y}$)**: прогноз, который выдала модель.',
          '• **Model**: функция, превращающая $x$ в $\\hat{y}$.',
          '• **Parameters**: внутренние числа ($k, b$), которые настраиваются во время обучения.'
        ],
        keyTakeaway: 'x — вход, y — истина, ŷ — прогноз модели, k и b — обучаемые параметры.',
        sandboxId: 'ml-vs-classic-diagram'
      },
      {
        id: 'l4-three-types',
        title: '⚡ Блоки 3, 4, 5. Регрессия, Классификация, Кластеризация',
        badge: '3 Задачи',
        content: [
          '1. **Регрессия**: прогноз числа (цена, температура).',
          '2. **Классификация**: выбор категории (спам/нет, кот/пес).',
          '3. **Кластеризация**: поиск скрытых групп без учителя (созвездия, плейлисты).'
        ],
        keyTakeaway: 'Число ➔ Регрессия. Категория ➔ Классификация. Группы без меток ➔ Кластеризация.',
        sandboxId: 'regression-mini-preview'
      },
      {
        id: 'l4-game',
        title: '🎮 Игра «Разложи 12 задач ML»',
        badge: 'Мини-игра',
        content: [
          'Разложи 12 реальных задач из жизни и технологий по 3 корзинам: Регрессия, Классификация или Кластеризация!'
        ],
        keyTakeaway: 'Умение определить тип задачи — фундаментальный навык в ML.',
        sandboxId: 'task-sorter-12-game'
      }
    ],
    sandboxes: [
      { id: 'ml-vs-classic-diagram', type: 'MLvsClassicDiagram', title: 'Парадигмы', description: 'Классика vs ML.', defaultParams: {} },
      { id: 'regression-mini-preview', type: 'RegressionMiniPreview', title: 'Демо Регрессии', description: 'Число.', defaultParams: {} },
      { id: 'task-sorter-12-game', type: 'TaskSorter12Game', title: '12 Задач ML', description: 'Сортировщик.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q4-1',
        prompt: 'Чем Target (y) отличается от Prediction (ŷ)?',
        options: [
          { id: 'opt1', text: 'y — это настоящий правильный ответ из данных, а ŷ — прогноз модели', isCorrect: true, explanation: 'Верно! y — факт, ŷ — предсказание.' },
          { id: 'opt2', text: 'Они абсолютно одинаковые', isCorrect: false, explanation: 'ŷ вычисляется моделью и может ошибаться.' }
        ],
        hint: 'Шляпка над y означает прогноз.',
        points: 25
      }
    ]
  },

  // LESSON 5
  {
    id: 5,
    slug: 'regression-prediction',
    title: 'Урок 5. Регрессия: предсказываем число (Как прямая превращается в модель)',
    subtitle: 'Обозначение ŷ = kx + b, пример квартиры, шум реальных данных и ручной подбор линии',
    durationMinutes: 20,
    xpReward: 200,
    icon: 'Target',
    color: 'from-blue-500 to-indigo-600',
    summary: 'Пишем формулу прогноза ŷ = kx + b. Разбираем реальные данные с шумом и пробуем вручную провести лучшую прямую через облако точек.',
    sections: [
      {
        id: 'l5-prediction-tracer',
        title: '🏠 Блок 1. Трассировщик Prediction ŷ',
        badge: 'Прогноз ŷ',
        content: [
          'В регрессии мы пилем формулу: $\\hat{y} = kx + b$. Шляпка означает prediction (прогноз модели).',
          'Например, для квартиры площадью $x = 50$ по модели $\\hat{y} = 0.12x + 2$ получаем $\\hat{y} = 8$ млн ₽.'
        ],
        keyTakeaway: 'Подавая 1 признак x, по прямой линии ŷ = kx + b мы получаем числовой прогноз ŷ.',
        sandboxId: 'prediction-tracer'
      },
      {
        id: 'l5-noise',
        title: '📊 Блок 2. Настоящие данные и Шум (Noise)',
        badge: 'Облако точек',
        content: [
          'Реальные квартиры не лежат на идеальной прямой: влияет этаж, район и ремонт. Данные выглядят как облако точек вокруг тренда.'
        ],
        keyTakeaway: 'Реальные данные содержат разброс и шум.',
        sandboxId: 'noise-cloud-lab'
      },
      {
        id: 'l5-manual-fit',
        title: '📉 Блок 3. Ручной подбор модели',
        badge: 'Линия тренда',
        content: [
          'Попробуй вручную подобрать $k$ и $b$, чтобы линия прошла сквозь облако точек. Мы видим глазами, какая линия лучше, но компьютеру нужно точное число ошибки!'
        ],
        keyTakeaway: 'Глазами можно оценить качество, но для обучения компьютеру нужна точная числовая формула ошибки.',
        sandboxId: 'visual-line-fitting'
      }
    ],
    sandboxes: [
      { id: 'prediction-tracer', type: 'PredictionTracer', title: 'Трассировщик ŷ', description: 'ŷ = 0.12x + 2.', defaultParams: {} },
      { id: 'noise-cloud-lab', type: 'NoiseCloudLab', title: 'Шум данных', description: 'Ползунок Noise.', defaultParams: {} },
      { id: 'visual-line-fitting', type: 'VisualLineFitting', title: 'Подбор линии', description: 'Прямая сквозь точки.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q5-1',
        prompt: 'Если формула модели ŷ = 0.12x + 2, какой прогноз цены выдаст модель для квартиры площадью x = 50 м²?',
        options: [
          { id: 'opt1', text: '8 млн ₽', isCorrect: true, explanation: 'Верно! 0.12 × 50 = 6, и 6 + 2 = 8.' },
          { id: 'opt2', text: '6 млн ₽', isCorrect: false, explanation: 'Не забудь прибавить 2.' }
        ],
        hint: '0.12 * 50 + 2 = ?',
        points: 25
      }
    ]
  },

  // LESSON 6
  {
    id: 6,
    slug: 'classification-boundaries',
    title: 'Урок 6. Классификация: Разделяющие границы и принятие решений',
    subtitle: '1D порог экзамена, 2D коты и собаки, вероятности спам-фильтра и распознавание цифр',
    durationMinutes: 25,
    xpReward: 250,
    icon: 'Tag',
    color: 'from-emerald-500 to-teal-600',
    summary: 'Изучаем, как модель принимает решения: от 1D порога до разделяющей прямой в 2D (коты vs собаки с реальным пересечением), вероятностей спама и распознавания цифр.',
    sections: [
      {
        id: 'l6-threshold-1d',
        title: '🎯 Блок 1. Порог классификации с 1 признаком',
        badge: '1 Признак',
        content: [
          'Если балл $\\ge \\text{threshold}$, класс «Сдал», иначе «Не сдал». Порог делит числовую прямую на две зоны.'
        ],
        keyTakeaway: 'Порог отсекает положительный класс от отрицательного.',
        sandboxId: 'threshold-classifier-1d'
      },
      {
        id: 'l6-cats-dogs',
        title: '🐱 Блок 2. Два признака: Коты и Собаки',
        badge: 'Разделяющая граница',
        content: [
          'При двух признаках ($x_1$ масса, $x_2$ длина ушей) границей становится прямая. Реальные данные пересекаются, поэтому идеальной границы может не быть.'
        ],
        keyTakeaway: 'Модель проводит границу так, чтобы ошибаться как можно реже.',
        sandboxId: 'cats-dogs-boundary'
      },
      {
        id: 'l6-spam',
        title: '🛡️ Блок 3. Вероятность и Спам-фильтр',
        badge: 'Вероятность',
        content: [
          'Модель выдает вероятность $P(\\text{spam}) = 0.82$. Регулируя threshold, мы балансируем между ложными тревогами и пропуском спама.'
        ],
        keyTakeaway: 'Порог вероятности определяет строгость фильтра.',
        sandboxId: 'spam-filter-sim'
      },
      {
        id: 'l6-digits',
        title: '🔢 Блок 4. Несколько классов: Распознавание цифр',
        badge: 'Много классов',
        content: [
          'Для пиксельной сетки модель вычисляет баллы для цифр 0, 1, 7 и выбирает класс с максимальным score!'
        ],
        keyTakeaway: 'В многоклассовой классификации побеждает класс с максимальной вероятностью.',
        sandboxId: 'digit-recognizer-mini'
      }
    ],
    sandboxes: [
      { id: 'threshold-classifier-1d', type: 'ThresholdClassifier1D', title: '1D Порог', description: 'Сдал / Не сдал.', defaultParams: {} },
      { id: 'cats-dogs-boundary', type: 'CatsDogsBoundary', title: 'Коты и Собаки', description: 'Разделяющая прямая.', defaultParams: {} },
      { id: 'spam-filter-sim', type: 'SpamFilterSimulator', title: 'Спам-фильтр', description: 'Порог вероятности.', defaultParams: {} },
      { id: 'digit-recognizer-mini', type: 'DigitRecognizerMini', title: 'Цифры', description: '0, 1, 7.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q6-1',
        prompt: 'Почему в реальных задачах разделяющая граница не всегда может разделить все точки на 100% без ошибок?',
        options: [
          { id: 'opt1', text: 'Потому что реальные данные содержат шум и пересечения (например, крупный кот может весить больше мелкой собаки)', isCorrect: true, explanation: 'Верно! В жизни признаки классов могут перекрываться.' },
          { id: 'opt2', text: 'Потому что прямые линии запрещены', isCorrect: false, explanation: 'Дело в свойствах самих данных.' }
        ],
        hint: 'Подумай о перекрытии признаков у реальных животных.',
        points: 25
      }
    ]
  },

  // LESSON 7
  {
    id: 7,
    slug: 'clustering-kmeans',
    title: 'Урок 7. Кластеризация: Поиск скрытых групп без учителя',
    subtitle: 'Сладости и признаки x₁ и x₂, евклидово расстояние d = √(Δx² + Δy²) и покадровый K-Means',
    durationMinutes: 20,
    xpReward: 250,
    icon: 'Layers',
    color: 'from-purple-500 to-pink-600',
    summary: 'В кластеризации учителя нет: алгоритм сам ищет структуру по расстоянию между точками. Разбираем формулу расстояния и полный пошаговый алгоритм K-Means.',
    sections: [
      {
        id: 'l7-candy',
        title: '🍬 Блок 1 & 2. Учителя нет: Сладости на плоскости признаков',
        badge: 'Без учителя',
        content: [
          'В кластеризации нет правильных ответов. Компьютер видит признаки: $x_1$ размер, $x_2$ твердость, и сам группирует похожие объекты.'
        ],
        keyTakeaway: 'Кластеризация находит группы объектов без готовых меток.',
        sandboxId: 'candy-grouping-lab'
      },
      {
        id: 'l7-distance',
        title: '📏 Блок 3. Евклидово расстояние между объектами',
        badge: 'Расстояние',
        content: [
          'Сходство измеряется расстоянием по теореме Пифагора: $d = \\sqrt{\\Delta x^2 + \\Delta y^2}$. Чем ближе точки, тем они более похожи.'
        ],
        keyTakeaway: 'd = √(Δx² + Δy²) — мера близости объектов.',
        sandboxId: 'euclidean-distance-explorer'
      },
      {
        id: 'l7-kmeans-steps',
        title: '🧲 Блок 4. Полный алгоритм K-Means покадрово',
        badge: 'Алгоритм K-Means',
        content: [
          '1. Выбираем K центров. 2. Точки выбирают ближайший центр. 3. Центры перемещаются в среднее положение своих точек. 4. Повторяем до сходимости!'
        ],
        keyTakeaway: 'K-Means итеративно приближает центры кластеров к среднему положению своих точек.',
        sandboxId: 'kmeans-step-by-step-full'
      }
    ],
    sandboxes: [
      { id: 'candy-grouping-lab', type: 'CandyGroupingLab', title: 'Сладости', description: 'Кучки.', defaultParams: {} },
      { id: 'euclidean-distance-explorer', type: 'EuclideanDistanceExplorer', title: 'Расстояние', description: '√(Δx² + Δy²).', defaultParams: {} },
      { id: 'kmeans-step-by-step-full', type: 'KMeansStepByStepFull', title: 'K-Means покадрово', description: 'Пошаговый алгоритм.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q7-1',
        prompt: 'Куда перемещается центроид на каждом шаге алгоритма K-Means?',
        options: [
          { id: 'opt1', text: 'В среднее геометрическое положение всех точек, которые к нему прикрепились', isCorrect: true, explanation: 'Верно! Центроид вычисляется как среднее арифметическое своих точек.' },
          { id: 'opt2', text: 'В случайную точку экрана', isCorrect: false, explanation: 'Он точно рассчитывает среднее положение.' }
        ],
        hint: 'Центроид ищет центр масс своей группы.',
        points: 25
      }
    ]
  },

  // LESSON 8
  {
    id: 8,
    slug: 'prediction-error',
    title: 'Урок 8. Ошибка прогноза: От «линия выглядит нормально» к точному числу ошибки',
    subtitle: 'Факт y vs прогноз ŷ, residual e = ŷ - y, почему сумма со знаками плоха и зачем нужен квадрат e²',
    durationMinutes: 20,
    xpReward: 200,
    icon: 'AlertCircle',
    color: 'from-rose-500 to-red-600',
    summary: 'Вводим точную меру промаха: residual e = ŷ - y. Разбираем, почему сумма ошибок со знаком взаимно уничтожается в ноль (+5 и -5), и почему квадрат e² идеально подходит для штрафа.',
    sections: [
      {
        id: 'l8-residual',
        title: '🎯 Блок 1 & 2. Fact y, Prediction ŷ и Residual e',
        badge: 'Residual e = ŷ - y',
        content: [
          'Факт $y = 8$, прогноз $\\hat{y} = 6$ ➔ ошибка $e = \\hat{y} - y = 6 - 8 = -2$ (недобор).',
          'Если $e > 0$ — модель завысила прогноз. Если $e < 0$ — занизила.'
        ],
        keyTakeaway: 'Residual e = ŷ - y — это точная ошибка прогноза для одной конкретной точки.',
        sandboxId: 'true-vs-predicted-residual'
      },
      {
        id: 'l8-cancellation',
        title: '💥 Блок 3 & 4. Почему сумма со знаками плоха (Σe = 0)',
        badge: 'Ловушка суммы',
        content: [
          'Если $e_1 = +5$, а $e_2 = -5$, их сумма $\\Sigma e = 0$. Модель ошиблась дважды, а сумма врет, что ошибки нет!'
        ],
        keyTakeaway: 'Простая сумма со знаками не подходит как общая мера качества.',
        sandboxId: 'error-cancellation-lab'
      },
      {
        id: 'l8-squared-penalty',
        title: '📈 Блок 5. Квадрат ошибки e² и парабола штрафа',
        badge: 'Квадрат e²',
        content: [
          'Квадрат уничтожает знак: $(-5)^2 = 25$ и $5^2 = 25$. А главное — сильно наказывает за большие промахи ($10^2 = 100$).'
        ],
        keyTakeaway: 'e² уничтожает знак и жестко штрафует за крупные промахи.',
        sandboxId: 'squared-penalty-comparison'
      }
    ],
    sandboxes: [
      { id: 'true-vs-predicted-residual', type: 'TrueVsPredictedResidual', title: 'Факт vs Прогноз', description: 'e = ŷ - y.', defaultParams: {} },
      { id: 'error-cancellation-lab', type: 'ErrorCancellationLab', title: 'Ловушка суммы', description: 'Взаимное уничтожение.', defaultParams: {} },
      { id: 'squared-penalty-comparison', type: 'SquaredPenaltyComparison', title: 'Парабола штрафа', description: 'e².', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q8-1',
        prompt: 'Если истинная цена квартиры y = 10 млн, а модель предсказала ŷ = 7 млн, чему равен residual e и квадрат ошибки e²?',
        options: [
          { id: 'opt1', text: 'e = -3 млн, e² = 9', isCorrect: true, explanation: 'Верно! e = 7 - 10 = -3, а (-3)² = 9.' },
          { id: 'opt2', text: 'e = +3 млн, e² = -9', isCorrect: false, explanation: 'Квадрат любого вещественного числа неотрицателен.' }
        ],
        hint: 'e = ŷ - y = 7 - 10.',
        points: 25
      }
    ]
  },

  // LESSON 9
  {
    id: 9,
    slug: 'mse-loss-function',
    title: 'Урок 9. MSE — функция потерь: Одно число, которое говорит, насколько хороша модель',
    subtitle: 'Среднее, формула MSE = (1/n) Σ(ŷᵢ - yᵢ)², пошаговый расчет, Два Мира и 3D Loss Landscape',
    durationMinutes: 25,
    xpReward: 250,
    icon: 'BarChart2',
    color: 'from-blue-600 to-indigo-700',
    summary: 'Mean Squared Error — главная функция потерь. Показываем пошаговый расчет MSE, исследуем связь между Миром данных (слева) и Миром параметров (справа) и смотрим на 3D ландшафт потерь.',
    sections: [
      {
        id: 'l9-mse-steps',
        title: '🧮 Блок 1 & 2. Формула MSE по 5 шагам',
        badge: 'MSE = (1/n) Σe²',
        content: [
          '1. Считаем прогнозы $\\hat{y}$. 2. Считаем ошибки $e = \\hat{y} - y$. 3. Возводим в квадрат $e^2$. 4. Складываем $\\sum e^2$. 5. Делим на $n$.',
          'Получаем **Mean Squared Error (MSE)** — среднюю квадратичную ошибку по всему датасету (Loss Function).'
        ],
        keyTakeaway: 'MSE = (1/n) Σ(ŷᵢ - yᵢ)² — единое число, показывающее качество модели.',
        sandboxId: 'mse-step-by-step-calc'
      },
      {
        id: 'l9-two-worlds',
        title: '🌍 Блок 3 & 4. Главный интерактив «Два Мира»',
        badge: 'Мир данных vs Мир параметров',
        content: [
          'Prediction зависит от $k$ и $b$. Значит и MSE зависит от $k$ и $b$: $L(k,b)$.',
          'Слева — Мир данных с точками и линией. Справа — Мир параметров, где каждая точка $(k, b)$ задает линию, а цвет показывает величину Loss!'
        ],
        keyTakeaway: 'Обучение регрессии — это поиск точки (k, b), где Loss минимален.',
        sandboxId: 'two-worlds-split-screen'
      }
    ],
    sandboxes: [
      { id: 'mse-step-by-step-calc', type: 'MSEStepByStepCalc', title: 'Расчет MSE', description: '5 шагов.', defaultParams: {} },
      { id: 'two-worlds-split-screen', type: 'TwoWorldsSplitScreen', title: 'Два Мира', description: 'Данные vs Параметры.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q9-1',
        prompt: 'Что происходит с качеством модели, когда функция потерь Loss (MSE) уменьшается?',
        options: [
          { id: 'opt1', text: 'Качество улучшается: линия проходит ближе к реальным точкам', isCorrect: true, explanation: 'Верно! Чем меньше Loss, тем точнее модель описывает данные.' },
          { id: 'opt2', text: 'Качество падает', isCorrect: false, explanation: 'Меньше ошибка — значит лучше прогноз.' }
        ],
        hint: 'Loss — это величина ошибки.',
        points: 25
      }
    ]
  },

  // LESSON 10
  {
    id: 10,
    slug: 'regression-gradient',
    title: 'Урок 10. Градиент линейной регрессии: Как узнать, куда двигать k и b',
    subtitle: 'Заморозка b, частные производные ∂L/∂k и ∂L/∂b, вывод формул градиентов и вектор (dk, db)',
    durationMinutes: 30,
    xpReward: 300,
    icon: 'GitBranch',
    color: 'from-orange-500 to-amber-600',
    summary: 'Как найти минимум Loss(k,b)? Выводим частные производные: db = (2/n) Σe и dk = (2/n) Σ(e · x). Собираем формулы из карточек и строим вектор градиента.',
    sections: [
      {
        id: 'l10-freeze-b',
        title: '🔒 Блок 1 & 2. Заморозка b и частная производная ∂L/∂k',
        badge: 'Частная производная',
        content: [
          'Заморозив $b$, мы исследуем срез ошибки $L(k)$. Символ $\\partial L / \\partial k$ означает: как меняется Loss, если изменить только $k$.'
        ],
        keyTakeaway: 'Частная производная измеряет наклон функции ошибки по одному конкретному параметру.',
        sandboxId: 'freeze-b-interactive'
      },
      {
        id: 'l10-formula-assembly',
        title: '🧩 Блоки 3, 5, 6. Вывод формул dk и db',
        badge: 'Формулы градиента',
        content: [
          '• По сдвигу: $\\frac{\\partial L}{\\partial b} = \\frac{2}{n} \\sum e_i$',
          '• По наклону: $\\frac{\\partial L}{\\partial k} = \\frac{2}{n} \\sum (e_i \\cdot x_i)$',
          'Вектор градиента $\\text{gradient} = (dk, db)$ задает стрелку быстрейшего роста ошибки!'
        ],
        keyTakeaway: 'dk = (2/n) Σ(error · x) и db = (2/n) Σerror.',
        sandboxId: 'formula-card-assembler'
      }
    ],
    sandboxes: [
      { id: 'freeze-b-interactive', type: 'FreezeBInteractive', title: 'Заморозить b', description: '∂L/∂k.', defaultParams: {} },
      { id: 'formula-card-assembler', type: 'FormulaCardAssembler', title: 'Конструктор формул', description: 'Собери формулу.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q10-1',
        prompt: 'Почему в формуле dk = (2/n) Σ(e · x) ошибка умножается на признак x, а в db = (2/n) Σe — нет?',
        options: [
          { id: 'opt1', text: 'Потому что в формуле ŷ = kx + b параметр k умножается на x, а b прибавляется сам по себе', isCorrect: true, explanation: 'Браво! Влияние наклона k усиливается в x раз.' },
          { id: 'opt2', text: 'Это случайное совпадение', isCorrect: false, explanation: 'Это строго следует из производной сложной функции.' }
        ],
        hint: 'Посмотри на уравнение прямой: k умножается на x.',
        points: 25
      }
    ]
  },

  // LESSON 11
  {
    id: 11,
    slug: 'gradient-descent',
    title: 'Урок 11. Gradient Descent: Как модель самостоятельно находит хорошие параметры',
    subtitle: 'Правило обновления k = k - α·dk, learning rate α, цикл эпохи, 4 панели в реальном времени и гонка моделей',
    durationMinutes: 25,
    xpReward: 250,
    icon: 'Activity',
    color: 'from-emerald-500 to-green-600',
    summary: 'Алгоритм градиентного спуска: как модель шаг за шагом обновляет параметры k = k - α·dk и b = b - α·db. Запускаем студию обучения в реальном времени и гонку learning rates.',
    sections: [
      {
        id: 'l11-update-pipeline',
        title: '🔄 Блок 1, 2, 3, 4. Правило обновления и цикл эпохи',
        badge: 'Pipeline Эпохи',
        content: [
          'Каждая эпоха состоит из 6 шагов: 1. Prediction $\\hat{y} = kx+b$ ➔ 2. Error $e = \\hat{y}-y$ ➔ 3. Loss (MSE) ➔ 4. Gradients $dk, db$ ➔ 5. Update: $k = k - \\alpha dk, b = b - \\alpha db$ ➔ 6. Repeat!'
        ],
        keyTakeaway: 'Одна эпоха — полный цикл расчета ошибок, градиентов и обновления параметров по всему датасету.',
        sandboxId: 'realtime-training-studio'
      },
      {
        id: 'l11-race',
        title: '🏁 Блок 5 & 6. Гонка трех Learning Rates (α)',
        badge: 'Learning Rate',
        content: [
          '• $\\alpha = 0.0001$ — черепаха (учится вечность).',
          '• $\\alpha = 0.02$ — ракета (плавно и быстро находит минимум).',
          '• $\\alpha = 0.5$ — взрыв (перепрыгивает минимум, ошибка растет).'
        ],
        keyTakeaway: 'Learning rate регулирует размер шага спуска к минимуму.',
        sandboxId: 'three-learning-rates-race'
      }
    ],
    sandboxes: [
      { id: 'realtime-training-studio', type: 'RealtimeTrainingStudio', title: 'Студия обучения', description: 'Эпохи в реальном времени.', defaultParams: {} },
      { id: 'three-learning-rates-race', type: 'ThreeLearningRatesRace', title: 'Гонка α', description: '3 скорости обучения.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q11-1',
        prompt: 'Если текущий наклон k = 0.0, градиент dk = -6.0, а learning rate α = 0.01, чему равен новый наклон k_new?',
        options: [
          { id: 'opt1', text: 'k_new = 0 - 0.01 × (-6.0) = +0.06', isCorrect: true, explanation: 'Верно! Минус на минус дает плюс, наклон увеличился в правильную сторону.' },
          { id: 'opt2', text: 'k_new = -0.06', isCorrect: false, explanation: 'В формуле вычитается: 0 - 0.01 * (-6) = +0.06.' }
        ],
        hint: 'k_new = k - α * dk.',
        points: 25
      }
    ]
  },

  // LESSON 12
  {
    id: 12,
    slug: 'pure-python-regression',
    title: 'Урок 12. Линейная регрессия на чистом Python: Пишем настоящую обучающуюся ML-модель без библиотек',
    subtitle: 'Датасет, predict, mse, gradients, training loop, интерпретатор Python, Train vs Test и мост в будущее',
    durationMinutes: 30,
    xpReward: 300,
    icon: 'Code',
    color: 'from-cyan-500 to-blue-600',
    summary: 'Пишем полноценный алгоритм машинного обучения на обычном чистом Python без NumPy, PyTorch и sklearn. Разбираем пошаговый интерпретатор, Train/Test разбиение и мост к нейросетям.',
    sections: [
      {
        id: 'l12-interpreter',
        title: '💻 Блоки 1–8. Симулятор «Стань интерпретатором Python»',
        badge: 'Python без библиотек',
        content: [
          'Каждая строка кода — это изученная математика: `predict` $\\to \\hat{y} = kx+b$, `mse` $\\to \\frac{1}{n}\\sum e^2$, `gradients` $\\to dk, db$.',
          'Запусти симулятор интерпретатора и посмотри, как память программы строит линию $y \\approx 2x + 1$ шаг за шагом!'
        ],
        keyTakeaway: 'Настоящий ML-алгоритм — это буквально несколько простых циклов сложения и умножения на Python.',
        sandboxId: 'python-interpreter-simulator'
      },
      {
        id: 'l12-train-test',
        title: '🧪 Блок 9 & 10. Train/Test разбиение и мост в будущее',
        badge: 'Train & Test',
        content: [
          '• **Train (70%)**: используется для изменения параметров $k$ и $b$.',
          '• **Test (30%)**: модель не видит во время обучения, используется для честной проверки генерализации.',
          'Если признаков несколько ($x_1, x_2, x_3$), модель становится $\\hat{y} = w_1 x_1 + w_2 x_2 + w_3 x_3 + b$ — это прямой фундамент глубоких нейросетей!'
        ],
        keyTakeaway: 'Разделение на Train и Test гарантирует, что модель не заучила ответы, а нашла настоящую закономерность.',
        sandboxId: 'train-test-splitter'
      }
    ],
    sandboxes: [
      { id: 'python-interpreter-simulator', type: 'PythonInterpreterSimulator', title: 'Интерпретатор Python', description: 'Код и память.', defaultParams: {} },
      { id: 'train-test-splitter', type: 'TrainTestSplitter', title: 'Train / Test', description: '70% / 30%.', defaultParams: {} }
    ],
    quiz: [
      {
        id: 'q12-1',
        prompt: 'Зачем данные делят на обучающую (Train) и тестовую (Test) выборки?',
        options: [
          { id: 'opt1', text: 'Чтобы честно проверить, умеет ли модель делать точные прогнозы на абсолютно НОВЫХ данных, которых не видела при обучении', isCorrect: true, explanation: 'Браво! Это главная проверка способности модели к обобщению (генерализации).' },
          { id: 'opt2', text: 'Чтобы код работал быстрее', isCorrect: false, explanation: 'Это необходимо для проверки качества.' }
        ],
        hint: 'Тест проверяет работу на новых примерах.',
        points: 25
      }
    ]
  }
];

export const BADGES_DATABASE: Badge[] = [
  { id: 'function-master', name: 'Мастер Функций', description: 'Понял, как вход x превращается в выход y', icon: 'Brain', requiredLesson: 1 },
  { id: 'line-sniper', name: 'Повелитель Прямой', description: 'Освоил управление наклоном k и сдвигом b', icon: 'TrendingUp', requiredLesson: 2 },
  { id: 'gradient-explorer', name: 'Покоритель Градиента', description: 'Узнал тайну спидометра изменений и 3D чаши', icon: 'Compass', requiredLesson: 3 },
  { id: 'ml-triage', name: 'Архитектор Задач ML', description: 'Различает регрессию, классификацию и кластеризацию', icon: 'Sparkles', requiredLesson: 4 },
  { id: 'regression-init', name: 'Пионер Регрессии', description: 'Понял сущность prediction ŷ и шума данных', icon: 'Target', requiredLesson: 5 },
  { id: 'decision-boundary', name: 'Мастер Границ', description: 'Научился разделять классы объектов', icon: 'Tag', requiredLesson: 6 },
  { id: 'kmeans-expert', name: 'Гуру K-Means', description: 'Освоил кластеризацию без учителя', icon: 'Layers', requiredLesson: 7 },
  { id: 'residual-detective', name: 'Детектив Ошибок', description: 'Разобрался с residual e и квадратом e²', icon: 'AlertCircle', requiredLesson: 8 },
  { id: 'mse-specialist', name: 'Специалист по MSE', description: 'Покорил расчет функции потерь Loss', icon: 'BarChart2', requiredLesson: 9 },
  { id: 'gradient-derivator', name: 'Вычислитель Градиентов', description: 'Вывел формулы dk и db', icon: 'GitBranch', requiredLesson: 10 },
  { id: 'gradient-descent-pro', name: 'Мастер Gradient Descent', description: 'Обучил модель через эпохи и learning rate', icon: 'Activity', requiredLesson: 11 },
  { id: 'pure-python-hacker', name: 'Python ML-Разработчик', description: 'Написал модель с нуля без библиотек', icon: 'Code', requiredLesson: 12 },
  { id: 'grand-ml-champion', name: 'Линейная Регрессия с Нуля', description: 'Сдал финальный экзамен по алгоритмам ML', icon: 'Award', requiredLesson: 12 }
];
