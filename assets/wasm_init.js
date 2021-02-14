if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
    };
}

const go = new Go();
const el = {}
let mod, inst;
WebAssembly.instantiateStreaming(fetch("assets/lib.wasm"), go.importObject).then(
    async result => {
        mod = result.module;
        inst = result.instance;

        el.jaInput = document.getElementById("ja-input")
        el.resultsViewer = document.getElementById("results-viewer")
        el.runReader = document.getElementById("run-reader")
        el.changeText = document.getElementById("change-text")

        go.run(inst);
    }
);