$(document).ready(function () {

    $("#phone").val(localStorage.getItem("sms-phone"));
    $("#fullname").val(localStorage.getItem("sms-fullname"));

    $("#phone").on("blur", function () {
        localStorage.setItem("sms-phone", $("#phone").val());
        console.log("localStorage sms-phone", $("#phone").val());
    });

    $("#fullname").on("blur", function () {
        localStorage.setItem("sms-fullname", $("#fullname").val());
        console.log("localStorage sms-fullname", $("#fullname").val());
    });

    var phonebook;
    var messages;

    function addmessages(newms) {
        if (!messages) {
            messages = {
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
        }

        messages.smses.sms = messages.smses.sms.concat(newms);
    }

    function c(e) {
        console.log(e);
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }


    $(".drop-sbr").on("dragover", c);
    $(".drop-sbr").on("dragenter", c);

    $(".drop-sbr").on("drop", function (e) {

        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }
        Dots.show();



            var dt = e.originalEvent.dataTransfer;

            var files = dt.files;
            if (files.length == 1) {
                var file = files[0];
                var reader = new FileReader();

                reader.addEventListener("loadend", function (event) {
                    var xml = event.target.result;
                    setTimeout(function () {
                        messages = xmljson.toJSON(xml);
                        console.log("Imported " + messages.smses.sms.length + " SMS, " + messages.smses.mms.length +
                            " MMS messages from backup.");
                        $(".status-sbr").html("Imported <strong>" + messages.smses.sms.length +
                            "</strong> SMS messages from backup.");
                        $(".step-setup").hide();
                        $(".step-sbr").hide();
                        $(".step-contacts").show();
                        Dots.hide();
                    }, 100);
                });

                if (file.type == "text/xml") {
                    reader.readAsText(file);
                } else {
                    $(".status-sbr").html("<span style='color:red'>XML file expected.</span>");
                    Dots.hide();
                }
            }


        return false;
    });

    $(".drop-contacts").on("dragover", c);
    $(".drop-contacts").on("dragenter", c);

    $(".drop-contacts").on("drop", function (e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }

        var dt = e.originalEvent.dataTransfer;

            var files = dt.files;
            if (files.length == 1) {
                var file = files[0];
                var reader = new FileReader();

                reader.addEventListener("loadend", function (event) {
                    console.log("File has been read");
                    vcardfile.parse(event.target.result, function (result) {
                        console.log("vcard has been thru parser.");
                        if (!result) {
                            console.log("vcard was not valid.");
                            $(".status-vcf").html("The vcard file could not be parsed.");
                        } else {
                            console.log("phonebook initialized.");
                            phonebook = result;
                            $(".status-vcf").html("Phonebook loaded with <strong>" + phonebook.contacts.length +
                                "</strong> contacts.");
                            $(".step-vcf").hide();
                            $(".step-hangouts").show();
                        }
                    });

                });

                if (file.type == "text/x-vcard") {
                    console.log("Reading the file.");
                    reader.readAsText(file);
                } else {
                    $(".status-vcf").html("<span style='color:red'>A vcard file was expected.</span>");
                }

            }

        return false;
    });

    $(".drop-hangouts").on("dragover", c);
    $(".drop-hangouts").on("dragenter", c);

    $(".drop-hangouts").on("drop", function (e) {

        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }

        Dots.show();


            var dt = e.originalEvent.dataTransfer;

            var files = dt.files;
            if (files.length == 1) {
                var file = files[0];
                var reader = new FileReader();

                console.log(file);

                reader.addEventListener("loadend", function (event) {
                    console.log("File has been read");
                    var hojson = event.target.result;


                    setTimeout(function () {
                    importhangouts.phonebook(phonebook);
                    importhangouts.configure({
                        mynumber: $("#phone").val(),
                        myname: $("#fullname").val()
                    });
                    importhangouts.convert(hojson, function (hangouts) {
                        addmessages(hangouts);
                        console.log("Imported", hangouts.length, "new total", messages.smses.sms.length);
                        $(".status-ho").html("Imported <strong>" + hangouts.length + "</strong> messages from Hangouts.");
                        $(".step-ho").hide();
                        $(".step-voice").show();

                        Dots.hide();
                    })

                    }, 100);
                });

                if (file.name.indexOf(".json") > -1) {
                    console.log("Reading the file.");
                    reader.readAsText(file);
                } else {
                    $(".status-ho").html("<span style='color:red'>A json file was expected.</span>");
                }

            }

        return false;

    });

    $(".drop-voice").on("dragover", c);
    $(".drop-voice").on("dragenter", c);

    $(".drop-voice").on("drop", function (e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }

        Dots.show();



            var filecount;
            var dt = e.originalEvent.dataTransfer;

            var items = dt.items;
            for (var i = 0; i < items.length; i++) {
                var fileparsed = 0;

                function handle(item) {

                    item.file(function (file) {
                        fileparsed++;

                        var innerReader = new FileReader();
                        innerReader.addEventListener("loadend", function (event) {
                            var vhfile = event.target.result;
                            voicehtmlexport = voicehtml.addfile(vhfile,
                                file.name.substr(0, file.name.indexOf(" - Text")));

                            if (!--filecount) {
                                var vhtml = voicehtml.exporter();
                                console.log("Voice html concatenated from", fileparsed,
                                    "files, html is", Math.round(vhtml.length / 1000) + "KB");
                                importvoice.phonebook(phonebook);
                                importvoice.configure({
                                    mynumber: $("#phone").val(),
                                    myname: $("#fullname").val()
                                });
                                importvoice.convert(vhtml, function (voices) {
                                    addmessages(voices);
                                    console.log("Imported", voices.length, "new total", messages.smses.sms.length);
                                    $(".status-vo").html("Imported <strong>" + voices.length +
                                        "</strong> messages from Voice.");
                                    $(".step-vo").hide();

                                    Dots.hide();
                                    finalize();
                                })
                            }
                        });
                        innerReader.readAsText(file);

                    });

                }

                var item = items[i].webkitGetAsEntry();
                if (item) {
                    if (item.isDirectory) {
                        console.log("Directory Dropped", item.name);
                        var f = [];
                        var dirReader = item.createReader();

                        function iterate() {
                            dirReader.readEntries(function (entries) {
                                if (entries.length > 0) {
                                    for (var idx in entries) {
                                        if (entries[idx].isFile && entries[idx].name.indexOf("- Text -") > -1) {
                                            f.push(entries[idx]);
                                        }
                                    }
                                    iterate();
                                } else {
                                    filecount = f.length;
                                    f.forEach(function (e) {

                                        setTimeout(function () {
                                        handle(e);
                                    }, 100);
                                    })
                                }
                            });
                        }

                        iterate();
                    } else {
                        $(".status-voice").html("<span style='color:red'>A directory was expected.</span>");
                    }
                }


            }
        return false;
    });


    function finalize() {
        addmessages([]);
        var predupe = messages.smses.sms.length;
        dupecheck(messages);
        $(".status-dupecheck").html("<div>Dupe check removed <i>" + (predupe - messages.smses.sms.length) +
            "</i> duplicates, <strong>" + messages.smses.sms.length + "</strong> messages remained.</div>");
        var xml = xmljson.toXML(messages);
        var blob = new Blob([xml], {type: "text/xml"});
        var href = (URL || webkitURL).createObjectURL(blob);
        $("#dlxml").attr("download", "sms-" + moment().format("YYYYMMDDhhmmss") + ".xml");
        $("#dlxml").attr("href", href);
        $(".step-done").show();
        $(".status-done").html("Merged <strong>" + (messages.smses.sms.length + messages.smses.mms.length) +
            "</strong> from all sources.")
    }

    $(".nohangouts").click(function () {
        $(".step-hangouts").hide();
        $(".step-voice").show();
    });

    $(".novoice").click(function () {
        $(".step-voice").hide();
        finalize();
    });

    $(".nobackup").click(function () {
        $(".step-backup").hide();
        $(".step-contacts").show();
    });

});