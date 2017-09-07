
let vcard = require('vcard-json');
let contacts;

function filesystem(callback) {
    vcard.parseVcardFile('./All Contacts.vcf', function (verr, vdata) {
        if (verr) {
            console.log(verr);
            callback();
        } else {
            contacts = vdata;
            callback(wrap())
        }
    });
}

function parse(text, callback) {
    vcard.parseVcardString(text, function (verr, vdata) {
        if (verr) {
            console.log(verr);
            callback();
        } else {
            contacts = vdata;
            callback(wrap());
        }
    });
}

function lookup(name) {
    for (vi in contacts) {
        let vcard = contacts[vi];

        if (vcard.fullname == name) {
            return vcard;
        }
    }
}

function reverseLookup(num) {
    if (num) {
        for (vcard in contacts) {
            "use strict";
            for (var p in contacts[vcard].phone) {
                var stripped = contacts[vcard].phone[p].value.replace(/^\+1/g, "").replace(/^1 /g, "").replace(/[^0-9]/g, "");
                if (num.indexOf(stripped) > -1) {
                    return contacts[vcard];
                }
            }
        }
    }
}

function wrap(){
    "use strict";
    return {
        contacts: contacts,
        lookup: lookup,
        reverseLookup: reverseLookup
    };
}

module.exports = {
    filesystem: filesystem,
    parse: parse,
    contacts: contacts,
    lookup: lookup,
    reverseLookup: reverseLookup
};
