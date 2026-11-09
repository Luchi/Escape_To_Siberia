# Правки к сцене 1 (военкомат) — по сгенерированному кадру v1

Файл-референс: `docs/ref-commissariat-v1.png`
Разбор текущей генерации и точный список правок для перегенерации.

---

## 0. Что уже хорошо (это не менять)

- Свет: одна тёплая лампа сверху, холодный синий свет из проёма — правильный контраст.
- Палитра: грязно-зелёные стены, выцветший красный, тёмный пол — попадание в Signalis.
- Перспектива коридора и шахматный пол с бумагами — атмосферно, оставить.
- Силуэт сторожа в дверном проёме — отличная находка, оставить.
- Зеркало в золотой раме и печатная машинка на столе — работают.

## 1. Технические правки кадра

| Проблема | Что сделать |
|---|---|
| Кадр 1824×1104 (1.652) — не 16:9 | Генерировать 1920×1080 или 1600×900. Иначе при `background-size: 100% 100%` объекты «уедут» от хотспотов. |
| Нижние 15 % кадра яркие (пол) | Затемнить пол к низу: там будет HUD с инвентарём. |
| Псевдотекст на плакатах | Убрать читаемые буквы: только штрихи, потёки, японские иероглифы без смысла. |

## 2. Сейф — переделать

Сейчас это высокий серый шкаф (похож на холодильник) с круглым диском. Нужно:

- **Напольный стальной сейф**, высота ~90–100 см, ширина ~60 см, стоит на полу у правой стены.
- **Кодовый замок на 4 цифры** — круглая рукоятка + панель с четырьмя колёсиками или клавиатура, а не один диск.
- Процарапанная краска, следы ржавчины, трафарет `HÄHER` и красная отметина.
- Расположение: **x 62–72 %, y 50–80 %** кадра (центр ≈ 67 / 65).

## 3. Календарь — переделать

Сейчас это плотный настенный график, похожий на расписание. Нужно:

- **Кошачий календарь**: крупный отрывной/настенный, сетка месяца, мелкие рисунки котов по краям.
- Две даты обведены: **7 ноября — котиком**, **14 февраля — сердечком** (просто красные пометки, без читаемых цифр).
- Страницы слегка заломлены, **между листами торчит уголок батарейки** — это будущая находка.
- Расположение: **x 6–16 %, y 12–44 %** кадра (центр ≈ 11 / 28), висит чуть криво.

## 4. Радио — уменьшить

Сейчас оно размером с печатную машинку (30–40 см). Нужно:

- **Небольшой настольный радиоприёмник 1970-х, 18–22 см шириной**, на узкой полке над столом.
- Видны: шкала частот со стрелкой, две-три ручки, короткая антенна, ткань динамика.
- Светится слабым янтарным индикатором.
- Расположение: **x 30–40 %, y 44–54 %** кадра (центр ≈ 34 / 50).

## 5. Чего не хватает в кадре

| Объект | Зачем | Где |
|---|---|---|
| **Окно** | Выход через Q | Правая стена, **x 72–84 %, y 15–45 %**; за стеклом ночь, снег, луна. |
| **Фотография Сони** | Забирается в инвентарь | Левая стена рядом с зеркалом, **x 17–23 %, y 18–32 %**; маленькая рамка, портрет девушки в пиксельном стиле. |
| **Повестка** | Главный документ | На столе перед машинкой, **x 20–32 %, y 62–72 %**; лист с красным штампом и загнутым углом. |

## 6. Дверь

Дверь стоит по центру — это нормально, но хотспот должен быть на ней, а не слева.
Держать проём в **x 43–55 %, y 28–78 %**, сторож — внутри, лицом в комнату.

## 7. Итоговая карта объектов (совпадает с кодом)

| Объект | left | top |
|---|---|---|
| календарь | 8 % | 28 % |
| фото Сони | 16 % | 38 % |
| зеркало | 25 % | 40 % |
| радио | 34 % | 58 % |
| повестка | 22 % | 63 % |
| дверь | 48 % | 50 % |
| сейф | 66 % | 50 % |
| окно | 94 % | 33 % |

Проверка попадания маркеров на арт: [`docs/hotspots-on-art.png`](hotspots-on-art.png).

**Статус по текущему фону:** окно, фотография, дверь, повестка и зеркало уже стоят
на своих местах. Осталось поправить **сейф** (сейчас это шкаф с диском),
**календарь** (сейчас это график, а не кошачий календарь с датами) и **размер радио**.

---

## 8. Промпт для перегенерации (копировать целиком)

```text
PS1-era survival horror game background in the style of Signalis (2022), abandoned Soviet military commissariat room at night, corridor perspective: peeling dark-green painted walls, exposed pipes under the ceiling, a single warm ceiling lamp, a cold blue rectangle of light coming through a doorway in the centre of the back wall, and a tall dark silhouette of a guard standing inside that doorway, cracked chequered floor tiles with scattered papers, low-poly geometry, low-resolution dithered textures, heavy film grain, faint CRT scanlines, volumetric fog, muted palette of near-black green and dirty olive with sparse amber and alarm-red accents, fixed eye-level camera, wide 16:9 shot.

On the left wall: a large cat-shaped wall calendar with a monthly grid and small cat doodles, hanging slightly crooked, two dates circled in red pencil, a battery corner sticking out between its pages (upper left, x 6-16%, y 12-44%); next to it a small framed portrait photo of a young woman (left wall, x 17-23%, y 18-32%); a tall gold-framed mirror reflecting the ceiling lamp (left wall centre, x 24-33%, y 18-58%).

On a wooden desk at the left: an old typewriter with a sheet of paper, and a document with a red stamp lying flat on the desk (x 20-32%, y 62-72%); above the desk on a narrow wall shelf stands a small 1975 tabletop radio only 20 cm wide with a frequency scale, two knobs and a short antenna, glowing faint amber (x 30-40%, y 44-54%).

On the right side: a heavy steel floor safe about 90 cm tall with a four-digit combination lock and a round handle, scratched paint, stencilled HÄHER (x 62-72%, y 50-80%); above it a tall window with a snowy night sky and a pale moon behind frosted glass (x 72-84%, y 15-45%); torn red banners and faded posters with unreadable scribbles on the rest of the wall.

The lower 15% of the image is dark shadow, no objects. No people except the guard silhouette in the doorway. No readable text, no letters, no UI, no watermark.
```

Негатив — общий из `docs/PROMPTS.md`.
