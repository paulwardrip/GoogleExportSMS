
var importvoice = function() {

    var contacts, config, convos, convos_count, call, smses = [];

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function numberFinder() {
        var breaker = false;

        var cn = this;
        var fn = $(this).find("div.fn");

        if (fn.text().match(/[0-9]{4,11}$/)) {
            found(fn.text(), fn.text(), cn);

        } else {
            var elems = $(this).find("a.tel"), tel_count = elems.length;

            function cvs() {
                var phone = $(this).attr("href");
                if (!breaker) {
                    if (phone.indexOf(config.mynumber) == -1) {
                        number = phone.replace(/tel./, "");
                        breaker = true;
                        found(number, fn.text(), cn);
                    }
                }

                if (!breaker && !--tel_count) {

                    let contact = contacts.lookup(fn.text());

                    if (contact && contact.phone.length > 0) {
                        found(contact.phone[0].value, fn.text(), cn);
                    } else if (contact) {
                        console.log("Found contact", fn.text(), "but there are no phones.");
                        found();
                    } else {
                        console.log("Can't find", fn.text());
                        found();
                    }
                }
            }

            elems.each(cvs);
        }

    }

    function importer (_html, callback) {
        console.log("Voice Backup HTML Loaded.");
        $(".holding").append(_html);
        call = callback;

        convos = $("div.conversation"), convos_count = convos.length;

        convos.each(numberFinder);

        setTimeout(function () {
            threads.forEach(function(t) {
                console.log(t);
            });
        },5000)
    }

    function report() {
        if (!--convos_count) call(smses);
    }

    function found(number, fn, cnv) {
        if (number != null) {
            var elems = $(cnv).find("div.message"), count = elems.length;
            if (elems.length == 0) report();

            elems.each(function () {

                let tel = $(this).find("cite.sender.vcard a.tel").attr("href");
                let wasme = tel.indexOf(config.mynumber) > -1;

                var m = moment($(this).find("abbr").attr("title"));

                var sms = {attributes: {}};
                sms.attributes.protocol = 0;
                sms.attributes.address = number;
                sms.attributes.date = m.valueOf();
                sms.attributes.type = wasme ? 2 : 1;
                sms.attributes.contact_name = fn.match(/[0-9]{10,11}/) ? null : fn;
                sms.attributes.body = $(this).find("q").html();
                sms.attributes.toa = "null";
                sms.attributes.sc_toa = "null";
                sms.attributes.service_center = "null";
                sms.attributes.read = "1";
                sms.attributes.status = "-1";
                sms.attributes.locked = "0";
                sms.attributes.date_sent = "0";
                sms.attributes.readable_date = m.format("MMM D, YYYY h:mm A");

                smses.push(sms);

                if (!--count) report();
            });
        }
    }

    function exporter() {
        console.log("Exporting XML");
        var xml = xmljson.toXML(messages);
        var href = "data:text/xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(xml)));
        $("#dlxml").attr("download", "sms-" + moment().format("YYYYMMDDhhmmss") + ".xml");
        $("#dlxml").attr("href", href).show();
    }

    return {
        configure: function (c) {
            config = c;
        },
        phonebook: function (p) {
            contacts = p;
        },
        convert: importer
    }
}();