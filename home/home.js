$(document).ready(function () {

    $(".step").css({
        display: "none"
    });

    $("#frame1").widthPercent(.6);
    $("#frame1").heightPercent(.6);
    $("#frame1").centerize();



    var fqqs = document.querySelector("#frame1");
    var fqcs = window.getComputedStyle(fqqs);

    var bottomrow = {
        top: (($("#frame1").position().top + $("#frame1").outerHeight(true)))
            - (parseInt(fqcs.paddingBottom) + $(".step").height()),
        inner: $("#frame1").outerHeight(true)
            - (parseInt(fqcs.paddingBottom) + $(".tof2").height()),
        left: $("#frame1").position().left + parseInt(fqcs.paddingLeft),
        rightinner: parseInt(fqcs.paddingRight),
        oh: $("#frame1").outerHeight(true),
        br: parseInt(fqcs.borderRadius),
    };

    var fz = ($(window).height() - bottomrow.oh) / 2 - bottomrow.br;
    $(".android").css("height", fz + "px");
    $("h1").css("font-size", fz + "px");




    $(".tof2").css({
        top: bottomrow.inner + "px",
        right: bottomrow.rightinner + "px"
    });

    $(".tof2").click(function () {
        $("#frame1").hide();
        $("#frame2").show();
        $("#frame2").widthPercent(.6);
        $("#frame2").heightPercent(.6);
        $("#frame2").centerize();

        $(".step").css({
            top: bottomrow.top + "px",
            left: bottomrow.left + "px",
            position: "absolute",
            display: "block"
        });
    });

    $(".tof3").css({
        top: bottomrow.inner + "px",
        right: bottomrow.rightinner + "px"
    });

    $(".tof3").click(function () {

        $("#frame2").hide();
        $("#frame3").show();
        $("#frame3").widthPercent(.6);
        $("#frame3").heightPercent(.6);
        $("#frame3").centerize();

        $(".step1").removeClass("active").addClass("complete");
        $(".step2").addClass("active");
    });

    $(".tof4c").css({
        top: bottomrow.inner + "px",
        right: bottomrow.rightinner + "px"
    });

    var tof4 = function () {
        $("#frame3").hide();
        $("#frame4").show();
        $("#frame4").widthPercent(.6);
        $("#frame4").heightPercent(.6);
        $("#frame4").centerize();

        $(".step2").removeClass("active").addClass("complete");
        $(".step3").addClass("active");
    };
    $(".tof4c").click(tof4);

    $(".tof5").css({
        top: bottomrow.inner + "px",
        right: bottomrow.rightinner + "px"
    });

    $(".tof5").click(function () {

        $("#frame4").hide();
        $("#frame5").show();
        $("#frame5").widthPercent(.6);
        $("#frame5").heightPercent(.6);
        $("#frame5").centerize();

        $(".step3").removeClass("active").addClass("complete");
        $(".step4").addClass("active");
    });

    var tof6 = function () {
        $("#frame5").hide();
        $("#frame6").show();
        $("#frame6").widthPercent(.6);
        $("#frame6").heightPercent(.6);
        $("#frame6").centerize();

        $(".step4").removeClass("active").addClass("complete");
        $(".step5").addClass("active");
    };

    var tof7 = function () {
        $("#frame6").hide();
        $("#frame7").show();
        $("#frame7").widthPercent(.6);
        $("#frame7").heightPercent(.6);
        $("#frame7").centerize();

        $(".step5").removeClass("active").addClass("complete");
        $(".step6").addClass("active");
    };

    $(".tof7c").css({
        top: bottomrow.inner + "px",
        right: bottomrow.rightinner + "px"
    });

    $(".tof7c").click(function() {
        $(".status-fin-ho-li").hide();
        tof7();
    });

    var tof8 = function () {
        $("#frame7").hide();
        $("#frame8").show();
        $("#frame8").widthPercent(.6);
        $("#frame8").heightPercent(.6);
        $("#frame8").centerize();

        $(".step6").removeClass("active").addClass("complete");
    };

    $(".tof8c").click(function() {
        $(".status-fin-vo-li").hide();
        tof8();
        finalize();
    });

    $(".tof8c").css({
        top: bottomrow.inner + "px",
        right: bottomrow.rightinner + "px"
    });

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
        if (e.type === "dragenter") {
            $(e.target).addClass("flashy");
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }


    $(".drop-sbr").on("dragover", c);
    $(".drop-sbr").on("dragenter", c);

    $(".drop-sbr").on("drop", function (e) {

        $(e.target).removeClass("flashy");

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

                        $(".status-fin-sms").html(messages.smses.sms.length);
                        tof4();
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
                            tof6();
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
                        $(".status-fin-ho").html(hangouts.length);
                        tof7();
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

                                    $(".status-fin-vo").html(voices.length);
                                    Dots.hide();
                                    tof8();
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
        $(".status-fin-dupe").html(predupe - messages.smses.sms.length);

        $(".status-fin-final").html(messages.smses.sms.length);

        var xml = xmljson.toXML(messages);
        var blob = new Blob([xml], {type: "text/xml"});
        var href = (URL || webkitURL).createObjectURL(blob);
        $("#dlxml").attr("download", "sms-" + moment().format("YYYYMMDDhhmmss") + ".xml");
        $("#dlxml").attr("href", href);
        /*
        $(".step-done").show();

        $(".status-done").html("Merged <strong>" + (messages.smses.sms.length + messages.smses.mms.length) +
            "</strong> from all sources.")
            */
    }

    /*
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
*/
});