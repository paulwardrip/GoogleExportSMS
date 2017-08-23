let xmljson = require("./../xmljson");
let hangs = require("./Hangouts.json");
let moment = require("moment");
let fs = require('fs');

let config = require('./../config.json');


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function convert() {
    let trim = moment(config.trim + " 00:00", "YYYY-MM-DD HH:mm");

    var list = function (l, who) {
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

    var vcard = require('vcard-json');

    vcard.parseVcardFile('./hangouts/All Contacts.vcf', function (err, data) {

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

        console.log(err);

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


                if (number) {

                    console.log("Conversation", number, contact ? contact.fullname : "");
                    lf += "Conversation " + number + " " + (contact ? contact.fullname : "") + " " + coversation.conversation_state.event.length + " Messages";
                    coversation.conversation_state.event.forEach(message => {
                        var ts = moment(Math.floor(message.timestamp / 1000));


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
                                            contact_name: contact ? contact.fullname : null,
                                            body: segment.text ?
                                                segment.text.replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "") :
                                                "",
                                            toa: "null",
                                            sc_toa: "null",
                                            service_center: "null",
                                            read: "1",
                                            status: "-1",
                                            locked: "0",
                                            date_sent: "0",
                                            readable_date: ts.format("MMM D, YYYY h:mm A")

                                        }

                                    });
                                }
                            });
                        }

                    })
                }

            });

            messages.smses.attributes.count = messages.smses.sms.length;
            messages.smses.sms.forEach(sms => {
                "use strict";
            });

            var sorted = messages.smses.sms.sort(function (left, right) {
                return (parseInt(left.attributes.date) - parseInt(right.attributes.date));
            });

            console.log("Combined and sorted", sorted.length, "total messages.");

            fs.writeFile("./hangouts/sms-" + moment().format("YYYYMMDDhhmmss") + ".xml", xmljson.toXML(messages), function (err) {
            });

            console.log("DING!");
        }

    });

}

module.exports = convert;

convert();