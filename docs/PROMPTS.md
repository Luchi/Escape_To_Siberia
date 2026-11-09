# PENROSE-77 — промпты для генерации ассетов (стиль Signalis)

Документ для нейросети: каждый промпт самодостаточен, английский, копируется целиком.
Обложка стиля — **Signalis (rose-engine, 2022)**: PS1-эстетика, низкополигональный рендер,
дизеринг, приглушённая палитра, брутализм и восточноевропейский распад, тяжёлая тишина.

Концовки (тайга, армия) и HUD — в [`docs/PROMPTS-ENDINGS.md`](PROMPTS-ENDINGS.md).

---

## 0. Как пользоваться

- **Фоны:** генерировать 1920×1080 (или 1536×864), уменьшать до 1600×900. Для пиксельного вида — `nearest`, для живописного — `bicubic`.
- **Иконки:** генерировать 1024×1024, уменьшать до 128×128 `nearest`. Фон — сплошной `#FF00FF` (хромакей), потом вырезаю.
- **Портрет:** 1024×1536 → 512×768.
- Один прогон — один ассет. Стиль задаётся словами в каждом промпте, поэтому можно менять модель и не терять единство.
- Для Midjourney добавляй `--ar 16:9 --style raw` (фон), `--ar 1:1` (иконки), `--ar 2:3` (портрет).
- Проверяй после генерации: нет ли букв, водяных знаков, рамок и лиц там, где их быть не должно.

**Shared negative prompt** (вставлять в негатив всегда):

```text
text, letters, cyrillic, japanese characters, watermark, signature, logo, ui, hud, frame, border,
photorealistic photo, modern 3d render, unreal engine 5, ray tracing, oversaturated colors,
neon pink, rainbow, white background, people, hands, faces, extra limbs, blurry, jpeg artifacts
```

> Для `portrait-luchi.png` убери из негатива `faces, hands` — там лицо нужно, но одно и по центру.
> Для `eye.png` оставь всё как есть: лицо и веки не нужны.

**Палитра (упоминается в промптах):** near-black green `#0b1410`, dirty olive `#2f3a2c`,
sickly grey-green `#7c8b6a`, amber `#ffb000`, alarm red `#ff2a2a`, acid green-yellow `#a8d820`.

---

## 1. Фоны

### `assets/img/bg-station.png` — вокзал

Сцена 2. Хотспот «терминал» — ровно по центру (50 % / 50 %).

```text
PS1-era survival horror game background in the style of Signalis (2022): abandoned rural Soviet railway station waiting hall at night, cracked concrete walls with peeling dark-green paint, rows of worn wooden benches, an old wall-mounted CRT computer terminal with a faintly glowing amber screen placed exactly at the centre of the image, a broken hanging clock above it, snow blowing in through a shattered window on the left, dusty mosaic floor, one flickering cold fluorescent tube, deep black shadows in the corners, low-poly geometry, low-resolution dithered textures, muted palette of near-black green and dirty olive with sparse amber and alarm-red accents, heavy film grain, faint CRT scanlines, volumetric fog, single harsh light source, fixed eye-level camera, wide 16:9 establishing shot, no people, no text, no UI, oppressive silence
```

**Note:** терминал — светящееся пятно по центру, к нему «прилипает» HTML-иконка 🖥️ и кнопка «Лечь спать» ниже. Нижние 15 % кадра оставить тёмными — там HUD.

---

### `assets/img/bg-train.png` — коридор поезда (сон)

Сцена 3. Поверх фона летят зелёные надписи, поэтому кадр должен быть очень тёмным.

```text
PS1-era surreal horror game background in the style of Signalis (2022): endless 1970s Soviet sleeper train corridor in one-point perspective, narrow passage receding into pure blackness, worn compartment doors on both sides, peeling wallpaper, flickering green light strips along the ceiling, condensation on the windows, subtly warped and tilted dreamlike geometry, dust in the air, extremely dark image where most of the frame is near-black and only faint low-contrast shapes are visible, heavy vignette, low-poly geometry, low-resolution dithered textures, muted grey-green palette, heavy film grain, faint CRT scanlines, volumetric fog, one harsh light source, fixed eye-level camera, wide 16:9 shot, no people, no text, no UI
```

**Note:** яркость намеренно низкая — сверху лягут светящиеся фразы (LUCHI, PROMISE, 25.06). Ничего яркого в центре.

---

### `assets/img/bg-final.png` — финальная комната

Финал. Текст по центру, надпись 「約束を忘れないで」 — снизу справа, значит правый нижний угол не забивать.

```text
PS1-era game background in the style of Signalis (2022), warm and calm final scene: cozy small room at night, large window on the left showing a full moon over snowy taiga, two empty wooden chairs at a desk with an old CRT computer, a black cat curled up on one chair, a small plastic dinosaur toy and a wrapped shawarma on a plate on the desk, ushanka fur hats hanging on the wall, warm amber desk lamp against cold blue moonlight, soft dust particles in the air, low-poly geometry, low-resolution dithered textures, muted olive and amber palette with sparing acid-green accents, heavy film grain, faint CRT scanlines, gentle contrast, quiet safe mood, fixed eye-level camera, wide 16:9 shot, no people, no text, no UI
```

**Note:** людей нет специально — силуэты двоих лягут сверху как HTML/спрайт, поэтому стулья должны быть пустыми и хорошо читаться по центру.

---

### `assets/img/bg-map.png` — карта

Сцена 4. Поверх — слой тумана (CSS) и четыре кнопки-точки: платформа 20/80, лес 40/55, трасса 55/40, тайга 75/20.

```text
PS1-era survival horror UI background in the style of Signalis (2022): top-down stylized map of a vast northern country rendered like a corrupted retro cartography terminal, dark green snow-covered terrain, dense taiga forest in the upper right, a thin railway line running from bottom left to the centre, a winding highway, frozen rivers, faint glowing green grid lines over the terrain, monochrome green with sparse amber accents, aged phosphor screen glow, dithering, faint CRT scanlines, heavy film grain, slightly corrupted and glitched at the edges, low contrast so UI buttons stay readable, flat orthographic view, 16:9, no text labels, no markers, no icons, no people
```

**Note:** карта должна читаться сквозь тёмный туман — не делай её слишком светлой, и не рисуй подписи: названия добавляются кодом.

---

### `assets/img/bg-forest.png` — лес

Под-сцена «Лес». Три тропы, развилки — логика в модалке, но фон задаёт настроение.

```text
PS1-era survival horror game background in the style of Signalis (2022): dark snowy pine forest at night, three narrow trodden paths diverging into the trees toward the horizon, tall black trunks, cold moonlight falling through the branches, low fog between the trunks, fresh footprints and faint cat paw prints in the snow, deep blue-green palette with a single pale light source, low-poly geometry, low-resolution dithered textures, heavy film grain, faint CRT scanlines, volumetric fog, fixed eye-level camera, wide 16:9 shot, no people, no text, no UI
```

---

### `assets/img/bg-taiga.png` — тайга

Под-сцена «Тайга». Радио на пне — источник янтарного света.

```text
PS1-era survival horror game background in the style of Signalis (2022): small snowy clearing deep in the Siberian taiga at night, an old wooden stump in the middle with a battered portable radio on it, tiny amber LED glowing, snow-covered fir trees around the clearing, distant black treeline, cold blue moonlight mixed with the faint warm glow of the radio, silence and isolation, low-poly geometry, low-resolution dithered textures, near-black green and dirty olive palette, heavy film grain, faint CRT scanlines, volumetric fog, wide 16:9 shot, no people, no text, no UI
```

---

### `assets/img/bg-road.png` — трасса

Под-сцена «Трасса». Диалог с водителем — модалка по центру.

```text
PS1-era survival horror game background in the style of Signalis (2022): empty two-lane highway at night in deep snow, headlights of a single distant truck approaching through the fog, a crooked road sign with no readable text, snow banks on both sides, black pine trees, cold moonlight and red tail-light reflection on the asphalt, low-poly geometry, low-resolution dithered textures, muted grey-green palette with alarm-red accent, heavy film grain, faint CRT scanlines, volumetric fog, fixed camera, wide 16:9 shot, no people, no text, no UI
```

---

## 2. Иконки

Общая формула: пиксель-арт, 1 px тёмный контур, плоская заливка, 6 цветов, хромакей.
Каждый промпт уже содержит эту формулу — просто копируй.

### `assets/img/icon-battery.png` — батарейка

```text
game inventory icon, pixel art, 64x64 grid upscaled, 1-pixel dark outline, flat shading with six muted colors, subtle dithering, centred single object, no ground shadow, PS1 survival horror palette of dirty olive grey with amber accents, a worn AA battery with scratched metal casing, corroded copper terminal, torn dark label, slight bend, flat solid magenta #FF00FF background for chroma key, no text, no logo
```

### `assets/img/icon-coat.png` — ватник

```text
game inventory icon, pixel art, 64x64 grid upscaled, 1-pixel dark outline, flat shading with six muted colors, subtle dithering, centred single object, no ground shadow, PS1 survival horror palette of dirty olive grey, a Soviet padded jacket vatnik with diamond quilting, frayed cuffs, worn and dirty, folded as if hanging, flat solid magenta #FF00FF background for chroma key, no text, no logo
```

### `assets/img/icon-hat.png` — шапка-ушанка

```text
game inventory icon, pixel art, 64x64 grid upscaled, 1-pixel dark outline, flat shading with six muted colors, subtle dithering, centred single object, no ground shadow, PS1 survival horror palette of warm grey and brown, an ushanka fur hat with ear flaps tied up, Soviet army style, worn fur texture, flat solid magenta #FF00FF background for chroma key, no text, no logo
```

### `assets/img/icon-shaurma.png` — шаурма

```text
game inventory icon, pixel art, 64x64 grid upscaled, 1-pixel dark outline, flat shading with six muted colors, subtle dithering, centred single object, no ground shadow, a shawarma wrap in white paper and foil, one end open showing grilled meat and cabbage, thin steam, tiny grease stain on the paper, warm amber highlights, flat solid magenta #FF00FF background for chroma key, no text, no logo
```

### `assets/img/icon-dino.png` — дейнозух-брелок

```text
game inventory icon, pixel art, 64x64 grid upscaled, 1-pixel dark outline, flat shading with six muted colors, subtle dithering, centred single object, no ground shadow, a small plastic dinosaur keychain charm, chipped green paint, tiny metal ring, retro toy look, flat solid magenta #FF00FF background for chroma key, no text, no logo
```

### `assets/img/icon-catlight.png` — кот-фонарик

```text
game inventory icon, pixel art, 64x64 grid upscaled, 1-pixel dark outline, flat shading with six muted colors, subtle dithering, centred single object, no ground shadow, a small black cat figurine used as a flashlight, glowing acid green-yellow eyes, a narrow cone of pale light coming from its mouth, tiny scratches on the ceramic, PS1 survival horror palette, flat solid magenta #FF00FF background for chroma key, no text, no logo
```

### `assets/img/icon-notes.png` — блокнот

```text
game inventory icon, pixel art, 64x64 grid upscaled, 1-pixel dark outline, flat shading with six muted colors, subtle dithering, centred single object, no ground shadow, a worn pocket notebook with a dark green cover, spiral binding, pencil stuck in the rings, dog-eared pages, flat solid magenta #FF00FF background for chroma key, no text, no logo
```

---

## 3. Глаз и портрет

### `assets/img/eye.png` — глаз

Сцена 3 (висит в чёрном небе) и секретная концовка. 512×512, прозрачный фон.

```text
single enormous eye seen straight on, floating in a black void, acid green-yellow iris #a8d820 with radial fibres, huge black pupil, thin blood-red veins in a pale sclera, soft eerie glow around the iris, subtle vertical lens flare, low-poly and dithered look of Signalis (2022), PS1 low-resolution aesthetic, heavy film grain, faint CRT scanlines, horror atmosphere, no eyelid, no face, no frame, no text, transparent background
```

**Note:** генерировать на чёрном или хромакее; прозрачность сделаю вырезанием — 512×512 хватит на оба размера (60 px в сне и мелкий секрет).

---

### `assets/img/portrait-luchi.png` — портрет Лучи

Сон, финал, досье оператора. 512×768, прозрачный или тёмный фон.

```text
retro anime character portrait in PS1 pixel-art style, Signalis (2022) inspired: young woman in her mid-twenties, short pale ash hair, calm tired half-smile, dark military-style collar with a small red pin, one eye catching a faint acid green-yellow reflection, desaturated skin tones, dithered shading, low-resolution look of a 160x240 sprite upscaled, dark olive background with heavy film grain and faint CRT scanlines, bust framing, gentle and human expression, no text, no frame, no logo
```

**Note:** это единственный ассет с лицом — стиль должен остаться сдержанным и «тёплым», не хоррорным: она оператор и близкий человек, а не монстр.

---

## 3.5. Зеркало и фотография

### `assets/img/mirror-eye.png` — вид в зеркале

Открывается по клику на зеркало в сцене 1. 768×1024, вертикальный.

```text
first-person view of a tall gold-framed mirror hanging on a dark green painted wall of an abandoned Soviet commissariat, the glass is dusty and scratched, the reflection shows a dim room and a window with a night sky and falling snow, and inside that window reflection a single huge glowing green-amber eye is looking back at the viewer, slightly warped and doubled reflection, PS1-era low-poly look, low-resolution dithered textures, heavy film grain, faint CRT scanlines, cold teal and dirty olive palette with one acid green-amber accent, vertical 3:4 shot, no text, no UI
```

**Note:** глаз должен читаться как «она смотрит», а не как монстр: спокойный, тёплый.
Если модель добавляет лицо — просить только глаз в отражении окна.

---

### `assets/img/photo-luchi.png` — фотография Сони

Лежит на стене в сцене 1, забирается в инвентарь. 512×768, вертикальный.
Ориентир по композиции — уже сгенерированный обрывок постера: те же рваные края,
скотч, клочки бумаги по краям, поясной портрет, руки сложены перед собой.

```text
small torn paper photograph pasted on a dark green grimy wall, three-quarter bust portrait of a young woman: long wavy light-brown hair with straight bangs, thin round metal glasses, pale skin, calm tired half-smile, oversized slate-blue t-shirt, thin silver chain necklace, a dark tattoo on her right forearm, hands clasped in front of her; the paper is ripped at the edges, yellowed tape, missing corners, staples and paper scraps around it, faded print with visible grain, low-resolution dithering, Signalis (2022) pixel-art style, vertical 3:4, no readable text
```

**Как добиться сходства:** генерировать в img2img по реальной фотографии,
strength 0.35–0.45, промпт выше как текстовый; потом уменьшить до 512×768 `nearest`
и наложить рваный край отдельным слоем (или взять края с уже готового постера).
Глаза за стёклами очков должны читаться — это её главная примета в игре.

---

## 4. Куда что идёт

| Файл | Сцена | Позиция / роль |
|---|---|---|
| `bg-station.png` | 2 | фон, терминал по центру |
| `bg-train.png` | 3 | фон, поверх — летящие надписи |
| `bg-final.png` | финал | фон, силуэты и текст по центру |
| `bg-map.png` | 4 | фон карты, туман и точки — кодом |
| `bg-forest.png` | лес | фон под-сцены |
| `bg-taiga.png` | тайга | фон под-сцены, радио на пне |
| `bg-road.png` | трасса | фон под-сцены, диалог по центру |
| `icon-*.png` | везде | инвентарь, HUD, «Память» |
| `eye.png` | 3, секрет | глаз в небе и кликабельный секрет |
| `portrait-luchi.png` | 3, финал, досье | портрет |
| `mirror-eye.png` | 1 | модалка зеркала |
| `photo-luchi.png` | 1 | фотография на стене и в инвентаре |

Проверка перед отдачей: 16:9 без обрезки, нижние 15 % спокойные и тёмные, никаких букв в кадре,
фон не спорит с зелёным текстом интерфейса.
