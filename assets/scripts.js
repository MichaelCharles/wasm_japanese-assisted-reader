const sampleTitle = $("#x-title").text().trim();
const sampleBody = $("#x-body").text().trim();

$(async () => {
  const $loadText = $("#load-text");
  const $parse = $("#parse");
  const $sample = $("#sample");
  const $clear = $("#clear");
  const $titleInput = $("#title-input");
  const $bodyInput = $("#body-input");
  const $reader = $("#reader");
  const $input = $("#input");
  const $title = $("#title");
  const $body = $("#body");
  const $spinner = $("#spinner-container");
  const $main = $("main");

  $loadText.hide();
  $reader.hide();

  const worker = await wasmWorker("lib.wasm", ["read"]);
  $spinner.fadeOut(() => {
    $main.fadeIn();
  });

  $parse.on("click", () => {
    $input.fadeOut(async () => {
      const titleResult = await worker.read($titleInput.val());
      const bodyResult = await worker.read($bodyInput.val());
      $title.html(titleResult);
      $body.html(bodyResult);
      $reader.fadeIn(() => {
        $loadText.fadeIn();
      });
    });
  });

  $sample.on("click", () => {
    $titleInput.val(sampleTitle);
    $bodyInput.val(sampleBody);
  });

  $clear.on("click", () => {
    $titleInput.val("");
    $bodyInput.val("");
  });

  $loadText.on("click", () => {
    $loadText.fadeOut();
    $reader.fadeOut(() => {
      $title.html("");
      $body.html("");
      $input.fadeIn();
    });
  });
});
