let config;
let contacts;

function phonebook(ph) {
    contacts = ph;
}

function configure(cf) {
    config = cf;
}

function convert(json, callback) {
    let hangs = JSON.parse(json);

    let smses = [];
    let lf;

    let totes = hangs.conversation_state.length;

    function countOut(){
        if (!--totes) callback(smses);
    }

    hangs.conversation_state.forEach(function (coversation) {

        let number, gaia, hoc;
        coversation.conversation_state.conversation.participant_data.forEach(participant => {
            if (participant.phone_number && participant.phone_number.e164 && participant.phone_number.e164.indexOf(config.mynumber) == -1) {
                number = participant.phone_number.e164.replace("\+1", '');
                hoc = participant.fallback_name;
                gaia = participant.id.gaia_id;
            }
        });

        let contact = contacts.reverseLookup(number);

        if (number) {
            console.log("Hangouts Conversation", number, contact ? contact.fullname : "");
            lf += "Conversation " + number + " " + (contact ? contact.fullname : "") + " " + coversation.conversation_state.event.length + " Messages";
            let counter = coversation.conversation_state.event.length;
            coversation.conversation_state.event.forEach(message => {
                let ts = moment(Math.floor(message.timestamp / 1000));

                if (message.chat_message.message_content.segment) {
                    message.chat_message.message_content.segment.forEach(segment => {
                        if (segment.text != "\n") {

                            lf += moment(Math.floor(message.timestamp / 1000)).format('lll') + "\n";

                            smses.push({

                                attributes: {
                                    protocol: 0,
                                    address: number,
                                    date: ts.valueOf(),
                                    type: message.sender_id.gaia_id != gaia ? 2 : 1,
                                    subject: "null",
                                    contact_name: contact ? contact.fullname : null,
                                    body: segment.text,
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

                if (!--counter) countOut();
            });
        } else {
            countOut()
        }
    });
}

let importhangouts = {
    phonebook: phonebook,
    configure: configure,
    convert: convert
};
