$(async () => {
  $("#load-text").hide();
  $("#reader").hide();
  const w = await wasmWorker("lib.wasm", ["read"]);
  $("#spinner").fadeOut(() => $("main").fadeIn());

  $("#parse").on("click", () => {
    $("#input").fadeOut(async () => {
      $("#title").html(await w.read($("#title-input").val()));
      $("#body").html(await w.read($("#body-input").val()));
      $("#reader").fadeIn(() => $("#load-text").fadeIn());
    });
  });

  $("#sample").on("click", () => {
    $("#title-input").val($("#x-title").text().trim());
    $("#body-input").val($("#x-body").text().trim());
  });

  $("#clear").on("click", () => {
    $("#title-input").val("");
    $("#body-input").val("");
  });

  $("#load-text").on("click", () => {
    $("#load-text").fadeOut();
    $("#reader").fadeOut(() => {
      $("#title").html("");
      $("#body").html("");
      $("#input").fadeIn();
    });
  });
});
