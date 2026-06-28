# KanaDash
Kana Dash is a fast Japanese kana quiz game for practicing hiragana and katakana. Choose rows, difficulty, and quiz type, then answer timed kana-to-romaji or romaji-to-kana questions. Earn points, complete daily practice, and review characters with an Anki-inspired scheduler.

## Review algorithm
Kana Dash stores a small memory record for each kana in the browser. Each record is separated by script and quiz direction, so `hiragana:kana-to-romaji:to` is tracked separately from `hiragana:romaji-to-kana:to` or katakana practice.

After each answer, the game grades recall quality:

- `again`: wrong answer
- `hard`: correct, but slow
- `good`: correct at a normal speed
- `easy`: correct very quickly

Wrong answers come back soon, while correct answers are delayed longer: about 90 seconds for `again`, 6 hours for `hard`, 1 day for `good`, and 3 days for `easy`. Repeated correct answers increase stability, so those kana are pushed further into the future.

When choosing the next question, Kana Dash gives priority to kana that are due, overdue, previously missed, difficult, or barely practiced. A little randomness is added so practice still feels natural instead of perfectly predictable.
