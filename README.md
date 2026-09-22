# YuliaLatinTest260309

The [test picker](https://migita.github.io/YuliaLatinTest260309/) contains Yulia's French, Latin, and Mandarin tests.

## Mandarin: Jinbu 1 Chapter 3 Hobbies

Open [`mandarin_hobbies_quiz.html`](https://migita.github.io/YuliaLatinTest260309/mandarin_hobbies_quiz.html).
All 25 entries are transcribed from the supplied vocabulary sheet. Every prompt shows Hanzi;
the default round tests both pinyin and English (50 questions), with single-skill rounds available.
Answers can be typed or written on paper and self-checked. Pinyin ignores tones by default, so ordinary
letters work. Enable **Check tones** for tone practice; accents and numbered pinyin are accepted.
The new default also applies once to existing browsers, preserving progress and later explicit choices.
Neutral tones may be unnumbered, 0, or 5. The sheet's `xǐ huān`
and the usual neutral-tone `xǐ huan` are both accepted. English accepts listed equivalents.

Each missed question returns once during the round. First-attempt scores remain separate from
retries. Mistake-only rounds and per-skill browser progress are supported; paper answers do not
inflate typed accuracy. Existing language tests and their saved progress are independent.
Saved statistics persist across reloads; a reload starts a fresh round.

The Mandarin page uses the existing `styles.css` with a separate engine and vocabulary data.
A small Noto Sans SC font subset supplies the worksheet's Hanzi if no Chinese system font is available; its SIL Open Font License is in `fonts/OFL-NotoSansSC.txt`.
Serve this directory with any static server, for example `python -m http.server 8000`.
Run the answer-matching and round-behaviour checks with:

```sh
node --test mandarin_hobbies.test.cjs
```
