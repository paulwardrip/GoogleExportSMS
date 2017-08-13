
let xmljson = require("./xmljson");
let hangs = require("./Hangouts.json");
let moment = require("moment");

let mynumber = "5556665785";

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function convert () {
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

    vcard.parseVcardFile('All Contacts.vcf', function (err, data) {

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

                let number, gaia;
                coversation.conversation_state.conversation.participant_data.forEach(participant => {
                    if (participant.phone_number && participant.phone_number.e164 && participant.phone_number.e164.indexOf(mynumber) == -1) {
                        number = participant.phone_number.e164.replace("\+1", '');
                        gaia = participant.id.gaia_id;
                    }
                });

                var contact = reverseLookup(number);

                if (number) {

                    coversation.conversation_state.event.forEach(message => {

                        if (message.event_type == "SMS") {
                            message.chat_message.message_content.segment.forEach(segment => {
                                if (segment.text != "\n") {
                                    var who, type;

                                    if (message.sender_id.gaia_id != gaia) {
                                        console.log (message.sender_id.gaia_id != gaia);
                                        who = mynumber;
                                        type = 2
                                    } else {
                                        who = number;
                                        type = 1;
                                    }


                                    messages.smses.sms.push({

                                        attributes: {
                                            protocol: 0,
                                            address: who,
                                            date: Math.floor(message.timestamp / 1000),
                                            type: type,
                                            subject: "null",
                                            body: segment.text,
                                            toa: "null",
                                            sc_toa: "null",
                                            service_center: "null",
                                            read: "1",
                                            status: "-1",
                                            locked: "0",
                                            date_sent: "0",
                                            readable_date: moment(Math.floor(message.timestamp / 1000)).format('lll'),
                                            contact_name: contact ? contact.fullname : null
                                        }

                                    });
                                }
                            });
                        }
                    })
                }

            });
            var fs = require('fs');
            fs.writeFile("backup.xml", xmljson.toXML(messages), function (err) {
            });
        }

    });

}

convert();
module.exports = convert;