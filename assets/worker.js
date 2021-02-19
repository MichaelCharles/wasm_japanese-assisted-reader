self.importScripts("wasm_exec.js")

if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
    };
}

let wasmResolve;
let wasmReady = new Promise((resolve) => {
    wasmResolve = resolve;
})
const go = new Go()
let mod;
let inst;

self.addEventListener('message', function (event) {

    const { eventType, eventData, eventId, methods } = event.data;
    const modulePath = eventData;

    if (eventType === "INITIALISE") {

        WebAssembly.instantiateStreaming(fetch(modulePath), go.importObject)
            .then(result => {
                mod = result.module;
                inst = result.instance;
                go.run(inst);
                wasmResolve(result.instance.exports)

                self.postMessage({
                    eventType: "INITIALISED",
                    eventData: methods,
                });

            });
    } else if (eventType === "CALL") {
        wasmReady
            .then(result => {
                console.log(result)
                const method = global[eventData.method];
                const data = method.apply(null, eventData.arguments);
                self.postMessage({
                    eventType: "RESULT",
                    eventData: data,
                    eventId: eventId
                });
            })
            .catch((error) => {
                self.postMessage({
                    eventType: "ERROR",
                    eventData: "An error occured executing WASM instance function: " + error.toString(),
                    eventId: eventId
                });
            })
    }
}, false);
