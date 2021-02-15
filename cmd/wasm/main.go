package main

import (
	"log"
	"syscall/js"

	"github.com/mcaubrey/wasm_japanese-assisted-reader/pkg/rubywriter"
)

func main() {
	c := make(chan struct{}, 0)
	registerCallbacks()
	log.Print("WASM Instantiated.")
	<-c
}

func registerCallbacks() {
	js.Global().Set("read", js.FuncOf(read))
}

func read(_ js.Value, i []js.Value) interface{} {
	sourceText := js.ValueOf(i[0])
	return rubywriter.Write(sourceText.String())
}
