
let config = require('./../config.json');

let fs = require('fs');

fs.readdir("./voice/Calls", function(err, items) {
    if (err) {
        console.log (err);
        return
    }

    let i = 0;
    let combined = 0;

    let content_head;
    let content_foot;
    let content_html = [];

    let first = true;
    let last_fn = null;

    content_head = "<div class=\"allvoice\">";
    content_foot = "</div>";

    function step(c) {

        if (i < items.length) {
            let fn = items[i];
            if (fn.indexOf("- Text -") > -1) {
                fs.readFile("./voice/Calls/" + fn, 'utf8', function (err, contents) {
                    "use strict";

                    if (!err) {
                        console.log("Merging", fn);
                        let fn_data = fn.substr(0, fn.indexOf(" - Text"));

                        var st = contents.indexOf(">", contents.indexOf("<body")) + 1;
                        var cnt = "";
                        if (last_fn != fn_data) {
                            if (!first) {
                                cnt += "\n</div>\n";
                            }
                            first = false;
                            cnt += "<div class=\"conversation\">\n" +
                                "<div class='fn'>" + fn_data + "</div>\n";
                            last_fn = fn_data
                        }

                        cnt += contents.substr(st, contents.indexOf("</body>") - st);
                        content_html.push(cnt);

                        combined++;
                    } else {
                        console.log(err);
                    }
                    next();

                })
            } else {
                next();
            }

            function next() {
                i++;
                step(c);
            }

        } else {
            c();
        }
    }

    var vcard = require('vcard-json');

    vcard.parseVcardFile('./voice/All Contacts.vcf', function (err, data) {
        step(function () {
            console.log("Merged", combined, "SMS backups.");
            fs.writeFile("./voice/voice-export.html", content_head, function (err) {
                "use strict";
                if (!err) {
                    for (let i in content_html) {
                        fs.appendFileSync("./voice/voice-export.html", content_html[i]);
                    }

                    fs.appendFileSync("./voice/voice-export.html", "\n</div><div class='vcards'>\n");

                    for (let vc in data) {
                        if (data[vc].phone[0]) fs.appendFileSync("./voice/voice-export.html", "<a class='tel' href='" +
                            data[vc].phone[0].value.replace(/[() -]/g,'') + "'>" + data[vc].fullname + "</a>\n");
                    }
                    fs.appendFileSync("./voice/voice-export.html", "</div>\n");
                    fs.appendFileSync("./voice/voice-export.html", content_foot);
                }
            });
            console.log("FIN");
        });
    });
});