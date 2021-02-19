const sampleTitle = "地震の影響で秋田新幹線が運転見合わせ"
const sampleBody = "13日午後11時8分ごろ、福島沖を震源とする地震が発生し、宮城と福島で最大震度6強を観測した。秋田県内では秋田市や横手市などで、震度4を観測した。秋田県の総合防災課によると14日午後2時現在、この地震によるけが人はいないが、秋田市の小学校の外壁の一部がはがれるなど、秋田県内で2件の建物への被害が確認されている。また秋田新幹線は、この地震の影響で14日と15日始発から終日秋田駅と東京駅の間の運転を見合わせていて、全線運転再開のめどは立っていない。"

$(async ()=> {
    const $loadText = $("#load-text")
    const $parse = $("#parse")
    const $sample = $("#sample")
    const $clear = $("#clear")
    const $titleInput = $("#title-input")
    const $bodyInput = $("#body-input")
    const $reader = $("#reader")
    const $input = $("#input")
    const $title = $("#title")
    const $body = $("#body")

    $loadText.hide()
    $reader.hide();

    const worker = await wasmWorker("lib.wasm", ["read"])
    console.log(worker)

    $parse.on("click", () => {
        $input.fadeOut(async ()=> {
            console.log("A")
            const titleResult = await worker.read($titleInput.val())
            console.log("B")
            const bodyResult = await worker.read($bodyInput.val())
            console.log("C")
            $title.html(titleResult)
            $body.html(bodyResult)
            console.log("Z")
            $reader.fadeIn(()=> {
                $loadText.fadeIn()
            });
        });
    })

    $sample.on("click", ()=> {
        $titleInput.val(sampleTitle)
        $bodyInput.val(sampleBody)
    })

    $clear.on("click", () => {
        $titleInput.val("")
        $bodyInput.val("")
    })

    $loadText.on("click", () => {
        $loadText.fadeOut();
        $reader.fadeOut(()=> {
            $title.html("")
            $body.html("")
            $input.fadeIn();
        })
    })

})