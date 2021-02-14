build: 
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" "public/wasm_exec.js"
	GOARCH=wasm GOOS=js go build -ldflags='-s -w' -o public/lib.wasm main.go