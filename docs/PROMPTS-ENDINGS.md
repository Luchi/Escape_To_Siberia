# Промпты: финальная комната, концовки и HUD

Продолжение `docs/PROMPTS.md`. Стиль тот же: PS1-хоррор, Signalis, дизеринг,
низкополигональные формы, приглушённая палитра, зерно и сканлайны.
Негатив и палитра — из `docs/PROMPTS.md` (раздел 0).

---

## 1. Финальная комната — `assets/img/bg-final.png`

Тёплая, но в том же пиксельном мире. Людей нет: силуэты двоих лягут сверху.
Низ кадра темнее — там HUD.

```text
PS1-era game background in the style of Signalis (2022), warm and safe final scene: a small cozy room at night, a large window on the left showing a full moon over a snowy taiga, cold blue moonlight outside contrasting with a warm amber desk lamp inside, two empty wooden chairs at a desk with an old CRT computer, a black cat curled up on one chair, a small plastic dinosaur toy and a wrapped shawarma on a plate on the desk, two ushanka fur hats hanging on the wall, dust motes floating in the lamp light, low-poly geometry, low-resolution dithered textures, heavy film grain, faint CRT scanlines, muted warm palette of amber, brown and dirty olive with cold blue accents and a few acid green highlights, gentle contrast, quiet safe mood, fixed eye-level camera, wide 16:9 shot, the lower 15% of the image is dark and empty, no people, no readable text, no UI
```

**Заметки:** центр и правый нижний угол держать спокойными — там текст финала,
надпись 「約束を忘れないで」 и секретное слово.

---

## 2. Тайга — `assets/img/ending-taiga.png`

Вид от первого лица: лежим на снегу, смотрим вверх, а сверху — звери.

```text
PS1-era horror game illustration in the style of Signalis (2022), first-person point of view from the ground: the viewer is lying on his back in deep snow at night, looking straight up at a dark sky with snowflakes falling toward the camera, the black silhouettes of tall pine trees around the edges of the frame, and a ring of unsettling pixel-art animals leaning over him from the edges, staring down: a tall hare with a porcelain mask and hollow button eyes, a thin fox with a stitched mouth, a wolf, and a bear, inspired by the Russian folk-horror visual novel Zaychik, cute-but-wrong Soviet storybook style, elongated limbs, calm and patient expressions, cold blue-grey palette with a single red accent, low-poly geometry, low-resolution dithered textures, heavy film grain, faint CRT scanlines, strong vignette, wide 16:9 shot, no text, no UI
```

**Заметки:** снежинки и морды — по краям, центр кадра оставить небу.
Если модель плохо знает «Зайчика» — работают слова про советскую детскую книгу,
пуговичные глаза и зашитые рты.

---

## 3. Армия — `assets/img/ending-army.png`

**Рекомендуемый вариант:** генерируем только сцену, а `DEFEAT` и кнопку
«ПЕРЕИГРАТЬ» рисуем кодом — так текст будет чётким и без опечаток.

```text
PS1-era game over illustration, League of Legends defeat screen composition crossed with Signalis (2022): a pale android girl (replika) with short dark hair and a faint red glow in one eye, wearing a dark uniform, sitting on a simple metal chair in the iconic hunched pose of Shinji Ikari — elbows on knees, head down, shoulders trembling, tears on her cheeks; a cold spotlight from above, dust in the air, deep shadows, a dim dark-red ambient glow, cracked concrete floor, a huge empty dark area above her for a big title and an empty area below for a button, low-poly geometry, low-resolution dithered textures, heavy film grain, faint CRT scanlines, wide 16:9 shot, no text, no UI
```

**Вариант с текстом в кадре** (если хочется всё одним изображением; риск опечаток):

```text
...same scene..., a huge distressed metallic word "DEFEAT" in the upper half of the frame, a wide rectangular button with the word "ПЕРЕИГРАТЬ" at the bottom centre, League of Legends defeat screen layout, dark red and black palette, glowing edges, pixel-art typography
```

**Заметки:** фигура — по центру, ниже середины; верхняя треть — под заголовок;
нижние 15 % — под кнопку (их закроет HUD, кнопку рисуем в HTML выше HUD).

---

## 4. HUD — `assets/img/hud-bar.png`

Панель поверх фона, снизу, не выше 15 % экрана. Фон прозрачный, слоты пустые —
иконки и подписи накладываются кодом.

```text
game HUD bar for the bottom of the screen, League of Legends inspired but in the Signalis (2022) style: one long horizontal panel of dark brushed metal with rivets and thin acid-green and amber accents, six empty square item sockets on the left, four empty hexagonal skill sockets on the right, two small round buttons at the far left for notebook and restart, subtle scratches and CRT wear, pixel art with a 1px dark outline, flat front orthographic view, transparent background, no text, no icons, no numbers, very wide aspect ratio, about 1600x135 pixels
```

**Раскладка (1600×135, чтобы совпало с кодом):**

| Элемент | X | Y | Размер |
|---|---|---|---|
| кнопка рестарта | 20 | 46 | 44×44 |
| кнопка «Память» | 72 | 46 | 44×44 |
| 6 слотов инвентаря | 140, шаг 72 | 36 | 64×64 |
| 4 навыка Q/W/E/R | 1300, шаг 72 | 36 | 64×64 |

**Заметки:** генерировать в 2× (3200×270) и уменьшать `nearest`.
Внутри слотов не рисовать предметы — только пустые гнёзда с рамкой.
Никакого текста: подписи W/E/Q/R и названия предметов ставит HTML.
Прозрачность: либо сразу PNG с альфой, либо ровный тёмный фон под хромакей.

---

## 4.5. Платформа с двумя поездами — `assets/img/bg-platform.png`

Фон для выбора «В армию / В Сибирь». Пока файла нет, игра подставляет вокзал.

```text
PS1-era survival horror game background in the style of Signalis (2022): small rural railway platform at night in deep winter, thick fog, one tall lamp post casting a cold cone of light, two trains standing side by side at the platform: on the left a dull military-green troop train with dim yellow windows, red star and frost on the metal, on the right an old long-distance passenger train with warm amber windows and icicles, snow between the rails, footprints and scattered papers on the platform, dark pine forest behind, low-poly geometry, low-resolution dithered textures, heavy film grain, faint CRT scanlines, muted palette of near-black green and dirty olive with amber and alarm-red accents, wide 16:9 shot, the lower 15% of the frame is dark and empty for the HUD, no people, no text, no UI
```

**Композиция:** два поезда как две вертикальные массы слева и справа, платформа
и фонарь по центру — туда лягут кнопки выбора.

---

## 5. Технические требования
- Все фоны — **16:9**, 1600×900 (или 3200×1800 с уменьшением), PNG-24, без текста.
- HUD — **PNG с прозрачностью**, ровно 1600×135 (15 % от 900), панель прижата к низу кадра.
- Концовки — 1600×900, тёмные по краям, центр свободен под текст.
- Негатив — общий из `docs/PROMPTS.md`; для HUD добавь `white background, text, numbers, icons inside slots`.
- Проверка: нет букв, нет водяных знаков, низ кадра тёмный, объекты не спорят с зелёным UI.
