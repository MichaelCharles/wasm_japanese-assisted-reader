package ja

import (
	"unicode"
)

const (
	hiraganaLo = 0x3041 // ぁ
	katakanaLo = 0x30a1 // ァ

	codeDiff = katakanaLo - hiraganaLo
)

func HiraganaToKatakana(str string) string {
	src := []rune(str)
	dst := make([]rune, len(src))
	for i, r := range src {
		switch {
		case unicode.In(r, unicode.Hiragana):
			dst[i] = r + codeDiff
		default:
			dst[i] = r
		}
	}
	return string(dst)
}

func KatakanaToHiragana(str string) string {
	src := []rune(str)
	dst := make([]rune, len(src))
	for i, r := range src {
		switch {
		case unicode.In(r, unicode.Katakana):
			dst[i] = r - codeDiff
		default:
			dst[i] = r
		}
	}
	return string(dst)
}

func IsKanji(r rune) bool {
	return unicode.In(r, unicode.Han)
}

func IsKatakana(r rune) bool {
	return unicode.In(r, unicode.Katakana)
}

func IsHiragana(r rune) bool {
	return unicode.In(r, unicode.Hiragana)
}
