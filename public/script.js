if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
    };
}

const go = new Go();
const el = {}
let mod, inst;
WebAssembly.instantiateStreaming(fetch("lib.wasm"), go.importObject).then(
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

async function run() {
    el.runReader.style.display = "none"
    el.jaInput.style.display = "none"

    result = read(document.getElementById("ja-input").value)

    el.changeText.style.display = "inline-block"
    el.resultsViewer.innerHTML = result
    el.resultsViewer.style.display = "block"
}

function reset() {
    el.runReader.style.display = "inline-block"
    el.jaInput.style.display = "block"
    el.changeText.style.display = "none"
    el.resultsViewer.innerHTML = ""
    el.resultsViewer.style.display = "none"
}