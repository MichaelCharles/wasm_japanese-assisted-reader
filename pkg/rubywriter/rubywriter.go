package rubywriter

import (
	"errors"
	"fmt"
	"strings"

	"github.com/ikawaha/kagome-dict/ipa"
	"github.com/ikawaha/kagome/v2/tokenizer"
	ja "github.com/mcaubrey/wasm_japanese-assisted-reader/internal/ja"
)

func makeReverse(runes []rune) []rune {
	str := ""
	for i := 0; i < len(runes); i++ {
		str = string(runes[i]) + str
	}
	return []rune(str)
}

func getParts(surface []rune, hiragana []rune, kanjiStart int, kanjiEnd int) (err error, leading string, kanji string, furigana string, trailing string) {
	if !(kanjiStart >= 0 && kanjiStart <= len(surface)) {
		return errors.New("out of bounds"), "", "", "", ""
	}
	if !((len(surface)-kanjiEnd) >= 0 && (len(surface)-kanjiEnd) <= len(surface)) {
		return errors.New("out of bounds"), "", "", "", ""
	}
	leading = string(surface[:kanjiStart])
	trailing = string(surface[len(surface)-kanjiEnd:])

	kanji = string(surface[kanjiStart : len(surface)-kanjiEnd])
	furigana = string(hiragana[kanjiStart : len(hiragana)-kanjiEnd])
	return err, leading, kanji, furigana, trailing
}

func Write(input string) (output string) {
	t, err := tokenizer.New(ipa.Dict(), tokenizer.OmitBosEos())
	if err != nil {
		panic(err)
	}

	text := strings.TrimSpace(input)

	text = strings.ReplaceAll(text, "０", "0")
	text = strings.ReplaceAll(text, "１", "1")
	text = strings.ReplaceAll(text, "２", "2")
	text = strings.ReplaceAll(text, "３", "3")
	text = strings.ReplaceAll(text, "４", "4")
	text = strings.ReplaceAll(text, "５", "5")
	text = strings.ReplaceAll(text, "６", "6")
	text = strings.ReplaceAll(text, "７", "7")
	text = strings.ReplaceAll(text, "８", "8")
	text = strings.ReplaceAll(text, "９", "9")

	tokens := t.Analyze(text, tokenizer.Search)
	var results string

	parseAndUse(tokens,
		func(surface string, katakana string, hiragana string) {
			pS := []rune(surface)
			sP := makeReverse(pS)

			var lI int
			for i := 0; i < len(pS); i++ {
				if ja.IsKanji(pS[i]) {
					lI = i
					break
				}
			}

			var tI int
			for i := 0; i < len(sP); i++ {
				if ja.IsKanji(sP[i]) {
					tI = i
					break
				}
			}

			err, leading, kanji, furigana, trailing := getParts([]rune(surface), []rune(hiragana), lI, tI)

			if err != nil {
				results = results + surface
			} else {
				ruby := fmt.Sprintf("%v<ruby><rb>%v</rb><rt>%v</rt></ruby>%v", leading, kanji, furigana, trailing)
				results = results + ruby
			}
		},
		func(surface string) {
			results = results + surface
		})

	output = results
	return results
}

func parseAndUse(tokens []tokenizer.Token, onMatch func(surface string, katakana string, hiragana string), onNoMatch func(surface string)) {
	for _, token := range tokens {
		surface := token.Surface
		// pos := token.POS()
		reading, _ := token.Reading()
		readingHiragana := ja.KatakanaToHiragana(reading)
		if surface != reading && surface != readingHiragana {
			onMatch(surface, reading, readingHiragana)
		} else {
			onNoMatch(surface)
		}
	}
}
