
var voicehtml = function () {
    let i = 0;
    let combined = 0;

    let content_head = "<div class=\"allvoice\">";
    let content_foot = "</div>";
    let content_html = [];

    let first = true;
    let last_fn = null;

    exporter = function () {
        console.log("Merged", combined, "SMS backups.");

        let xml = content_head;

        for (let i in content_html) {
            xml += content_html[i];
        }

        xml += content_foot;
        return xml;
    };

    function step(contents, fn) {
        var st = contents.indexOf(">", contents.indexOf("<body")) + 1;
        var cnt = "";
        if (last_fn != fn) {
            if (!first) {
                cnt += "\n</div>\n";
            }
            first = false;
            cnt += "<div class=\"conversation\">\n" +
                "<div class='fn'>" + fn + "</div>\n";
            last_fn = fn
        }

        cnt += contents.substr(st, contents.indexOf("</body>") - st);
        content_html.push(cnt);

        combined++;
    }

    return {
        addfile: step,
        exporter: exporter
    };
}();
