build: 
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" "assets/wasm_exec.js"
	GOARCH=wasm GOOS=js go build -ldflags='-s -w' -o assets/lib.wasm main.go