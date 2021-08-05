async function runSql(withResult) {
  try {
    const result = await fetch("/admin/runSQL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statement: document.getElementById("statement").value + " ",
        withResult,
      }),
    });
    document.getElementById("sqlResults").innerHTML = syntaxHighlight(
      await result.text()
    );
  } catch (err) {
    document.getElementById("sqlResults").innerText = JSON.stringify(err);
  }
}

function syntaxHighlight(jsonString) {
  const json = jsonString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}
