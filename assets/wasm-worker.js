function wasmWorker(modulePath, methods) {

    const proxy = {};

    let id = 0;
    let idPromises = {};

    return new Promise((resolve, reject) => {
        const worker = new Worker('assets/worker.js');
        worker.postMessage({ eventType: "INITIALISE", eventData: modulePath, methods });
        worker.addEventListener('message', function (event) {

            const { eventType, eventData, eventId } = event.data;

            if (eventType === "INITIALISED") {
                const methods = event.data.eventData;
                methods.forEach((method) => {
                    proxy[method] = function () {
                        return new Promise((resolve, reject) => {
                            worker.postMessage({
                                eventType: "CALL",
                                eventData: {
                                    method: method,
                                    arguments: Array.from(arguments) // arguments is not an array
                                },
                                eventId: id
                            });

                            idPromises[id] = { resolve, reject };
                            id++
                        });
                    }
                });
                resolve(proxy);
            } else if (eventType === "RESULT") {
                if (eventId !== undefined && idPromises[eventId]) {
                    idPromises[eventId].resolve(eventData);
                    delete idPromises[eventId];
                }
            } else if (eventType === "ERROR") {
                if (eventId !== undefined && idPromises[eventId]) {
                    idPromises[eventId].reject(event.data.eventData);
                    delete idPromises[eventId];
                }
            }

        });

        worker.addEventListener("error", function (error) {
            reject(error);
        });
    })
}