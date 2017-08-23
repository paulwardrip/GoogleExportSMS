
let xmljson = require("./../xmljson");
let hangs = require("./Hangouts.json");
let moment = require("moment");
let fs = require('fs');

let config = require('./../config.json');

function importer() {
    fs.readFile('./sms.xml', 'utf8', function(err, contents) {
        var mms = xmljson.toJSON(contents);
        console.log("Imported", mms.smses.sms.length, "Messages from SMS backup.");

        fs.writeFile("mms.json", JSON.stringify(mms, null, 2), function (err) {
            convert(mms);
        });
    });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function convert (mms) {
    let trim = moment(config.trim + " 00:00", "YYYY-MM-DD HH:mm");

    var list = function (l,who) {
        for (var i in l) {
            if (l[i] == who) return true;
        }
    };

    var messages = {
        "xml-stylesheet": {
            directive: true,
            attributes: {
                type: "text/xsl",
                href: "sms.xsl"
            }
        },
        smses: {
            attributes: {
                backup_date: new Date().getTime(),
                backup_set: guid(),
            },
            sms: []
        }
    };

    function dupeCheck() {
        "use strict";
        for (var idx in messages.smses.sms) {
            var sms = messages.smses.sms[idx];
            for (var jdx in messages.smses.sms) {
                var comp = messages.smses.sms[jdx];
                var diff = moment(sms.date).diff(moment(comp.date), "hours");
                if (comp.address == sms.address && comp.body == sms.body && diff > -24 && diff < 24) {
                    console.log("Potential duplicate message:", sms.readable_date, sms.contact_name, sms.body);
                }
            }
        }
    }

    for (var q in mms.smses.sms) {
        var msg = mms.smses.sms[q];
        if (!list(config.blacklist, msg.contact_name)) {
            if (config["non-contacts"] == true || (msg.contact_name != "(Unknown)" && msg.contact_name != "null")) {
                var realdate = moment(msg.readable_date, "MMM D, YYYY h:mm A");
                var why = realdate.valueOf() > trim.valueOf() ? "date" : "whitellist";
                if (moment(msg.readable_date).valueOf() || list(config["super-whitellist"], msg.contact_name)) {
                    msg.attributes.why = why;
                    //msg.attributes.date = realdate;
                    messages.smses.sms.push(msg);
                }
            }
        }
    }

    var vcard = require('vcard-json');

    vcard.parseVcardFile('All Contacts.vcf', function (err, data) {

        var lf;

        function lookup(name) {
            if (name) {
                for (vcard in data) {
                    if (vcard.fullname == name) {
                        return data[vcard];
                    }
                }
            }
        }
        function reverseLookup(num) {
            if (num) {
                for (vcard in data) {
                    "use strict";
                    for (var p in data[vcard].phone) {
                        var stripped = data[vcard].phone[p].value.replace(/^\+1/g, "").replace(/^1 /g, "").replace(/[^0-9]/g, "");
                        if (num.indexOf(stripped) > -1) {
                            return data[vcard];
                        }
                    }
                }
            }
        }

        if (!err) {
            hangs.conversation_state.forEach(function (coversation) {
                "use strict";

                let number, gaia, hoc;
                coversation.conversation_state.conversation.participant_data.forEach(participant => {
                    if (participant.phone_number && participant.phone_number.e164 && participant.phone_number.e164.indexOf(config.mynumber) == -1) {
                        number = participant.phone_number.e164.replace("\+1", '');
                        hoc = participant.fallback_name;
                        gaia = participant.id.gaia_id;
                    }
                });

                var contact = reverseLookup(number) || lookup(contact);

                if ((contact != null || config["non-contacts"]) && !list(config.blacklist, contact.fullname)) {
                    var supers = (contact && list(config["super-whitelist"], contact.fullname));

                    if (number) {

                        console.log("Conversation", number, contact ? contact.fullname : "");
                        lf += "Conversation " + number + " " + (contact ? contact.fullname : "") + " " + coversation.conversation_state.event.length + " Messages";
                        coversation.conversation_state.event.forEach(message => {
                            var ts = moment(Math.floor(message.timestamp / 1000));

                            if (ts.valueOf() > trim.valueOf() || supers) {
                                if (ts.valueOf() < trim.valueOf() && supers) console.log("super-whitelist", contact.fullname, ts.format("MM|DD|YY"));

                                var why = ts.valueOf() > trim.valueOf() ? "date" : "whitelist";
                                //if (message.event_type == "SMS" || message.event_type == "REGULAR_CHAT_MESSAGE") {
                                    if (message.chat_message.message_content.segment) {
                                        message.chat_message.message_content.segment.forEach(segment => {
                                            if (segment.text != "\n") {

                                                lf += (moment(Math.floor(message.timestamp / 1000)).format('lll')) + "\n";

                                                messages.smses.sms.push({


                                                    attributes: {
                                                        protocol: 0,
                                                        address: number,
                                                        date: ts.valueOf(),
                                                        type: (message.sender_id.gaia_id != gaia) ? 2 : 1,
                                                        subject: "null",
                                                        body: segment.text,
                                                        toa: "null",
                                                        sc_toa: "null",
                                                        service_center: "null",
                                                        read: "1",
                                                        status: "-1",
                                                        locked: "0",
                                                        date_sent: "0",
                                                        contact_name: contact ? contact.fullname : null,
                                                        readable_date: ts.format("MMM D, YYYY h:mm A"),
                                                        why: why
                                                    }

                                                });
                                            }
                                        });
                                    }
                                //}
                            }
                        })
                    }
                }

            });

            messages.smses.count = messages.smses.sms.length;
            messages.smses.sms.forEach(sms => {
                "use strict";
            });

            var sorted = messages.smses.sms.sort(function (left, right) {
                return (parseInt(left.attributes.date) - parseInt(right.attributes.date));
            });

            console.log ("Combined and sorted", sorted.length, "total messages.");

            dupeCheck();

            fs.writeFile("sms-" + moment().format("YYYYMMDDhhmmss") + ".xml", xmljson.toXML(messages), function (err) {
            });

            console.log("DING!");
        }

    });

}

module.exports = importer;

importer();