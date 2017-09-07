var xmljson = {
    toXML: function (json, xmlv) {

        var VSTR = "<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>\n";
        var xmlvok = false;

        function encode(str) {
            if (typeof str == "string") {
                return str.replace(/\&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "");
            } else {
                return str;
            }
        }

        function unwrap(tree, depth) {
            var xml = "";
            if (xmlv && !xmlvok) {
                xmlvok = true;
                xml += VSTR;
            }

            for (var node in tree) {
                if (typeof tree[node] === "object") {

                    if (tree[node] instanceof Array) {
                        for (var idx in tree[node]) {
                            if (node !== "directive") {
                                if (!xmlvok) {
                                    xml = VSTR + xml;
                                    xmlvok = true;
                                }
                                for (var i = 0; i < depth; i++) {
                                    xml += "\t";
                                }
                                xml += "<" + node;
                                for (var a in tree[node][idx].attributes) {
                                    xml += " " + a + "=\"" + encode(tree[node][idx].attributes[a]) + "\"";
                                }
                                var n = 0;

                                if (typeof tree[node][idx] === "object") {

                                    for (attr in tree[node][idx]) {
                                        if (attr != "attributes") {
                                            n++;
                                        }
                                    }

                                    if (n > 0) {
                                        xml += ">";
                                        xml += "\n";
                                        xml += unwrap(tree[node][idx], depth + 1);
                                        for (var i = 0; i < depth; i++) {
                                            xml += "\t";
                                        }
                                    }

                                } else {
                                    xml += encode(tree[node][idx]);
                                }
                                if (n > 0) {
                                    xml += "</" + node + ">\n";
                                } else {
                                    xml += " />\n";
                                }
                            }
                        }

                    } else if (node === "value" && tree.attributes !== undefined) {
                        xml += encode(tree[node]);

                    } else if (node !== "attributes") {
                        for (var i = 0; i < depth; i++) {
                            xml += "\t";
                        }

                        xml += ((tree[node].directive) ? "<?" : "<") + node;

                        for (var a in tree[node].attributes) {
                            xml += " " + a + "=\"" + encode(tree[node].attributes[a]) + "\"";
                        }

                        var subtext = unwrap(tree[node], depth + 1);
                        if (subtext) {
                            xml += ">";
                            if (subtext.indexOf("<") > -1) xml += "\n";
                            xml += subtext;

                            if (subtext.indexOf("<") > -1) {
                                for (var i = 0; i < depth; i++) {
                                    xml += "\t";
                                }
                            }
                            xml += "</" + node + ">\n";
                        } else {
                            xml += ((tree[node].directive) ? " ?>\n" : " />\n");
                        }
                    }
                } else {
                    if (node !== "directive") {
                        if (node === "value" && tree.attributes !== undefined) {
                            xml += encode(tree[node]);

                        } else {
                            for (var i = 0; i < depth; i++) {
                                xml += "\t";
                            }
                            xml += "<" + node + ">" + encode(tree[node]) + "</" + node + ">\n";
                        }
                    }
                }
            }
            return xml;
        }

        var obj = json;
        if (typeof obj === "string") {
            obj = JSON.parse(obj);
        }



        return unwrap(obj, 0);
    },

    toJSON: function (xml) {
        function parse(input) {
            if (typeof input === "object") {
                if (input instanceof XMLDocument) {
                    return input;

                } else if (typeof jQuery !== "undefined" && input instanceof jQuery) {
                    var body = ($(input.children()[0]).html());
                    var elem = input.children()[0].tagName;

                    var xstr = "<" + elem;
                    $.each(input.children()[0].attributes, function () {
                        xstr += " " + this.name + "=\"" + this.value + "\"";
                    });
                    xstr += ">\n" + body + "\n<" + elem + ">";

                    return parse(xstr);
                }

            } else if (typeof input === "string") {
                if (typeof DOMParser !== "undefined") {
                    var par = new DOMParser();
                    return par.parseFromString(input, "application/xml");

                } else {
                    var doc = new XMLDocument();
                    doc.loadXML(input);
                    return doc;
                }
            }
        }

        function extract(node) {
            var obj = null;
            var elements = false;

            if (node.attributes) {
                for (var child = 0; child < node.attributes.length; child++) {
                    if (!obj) obj = {attributes: {}};
                    obj.attributes[node.attributes[child].name] = node.attributes[child].value;
                }
            }

            node.childNodes.forEach(function (child) {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    if (!obj) obj = {};

                    if (obj[child.tagName] !== undefined && !(obj[child.tagName] instanceof Array)) {
                        obj[child.tagName] = [obj[child.tagName]];
                    }

                    if (obj[child.tagName] instanceof Array) {
                        obj[child.tagName].push(extract(child));
                    } else {
                        obj[child.tagName] = extract(child);
                    }
                    elements = true;
                }
            });

            if (!elements && node.firstChild) {
                if (!obj) {
                    obj = node.firstChild.nodeValue;
                } else {
                    obj.value = node.firstChild.nodeValue;
                }
            }

            return obj;
        }

        var doc = parse(xml);
        return extract(doc);
    }
};