function dupecheck(messages) {
    messages.smses.sms.forEach(function (sms, i) {
        messages.smses.sms.forEach(function (compare, ci) {
            if (sms.attributes.body == compare.attributes.body && sms.attributes.address == compare.attributes.address) {
                var diffy = moment(new Date(sms.attributes.readable_date)).diff(moment(new Date(compare.attributes.readable_date)), "minutes");
                if (diffy > -180  && diffy < 0) {
                    //console.log ("dupe:", sms.attributes.readable_date, sms.attributes.contact_name, sms.attributes.body);
                    messages.smses.sms.splice(ci,1);
                } else if ((diffy < 180 && diffy > 0) || diffy == 0) {
                    //console.log ("dupe:", sms.attributes.readable_date, sms.attributes.contact_name, sms.attributes.body);
                    messages.smses.sms.splice(i,1);
                }
            }
        });
    });
}