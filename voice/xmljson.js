var xmljson = {
    toXML: function (json) {

        function unwrap(tree, depth) {
            var xml = "";

            for (var node in tree) {
                if (typeof tree[node] === "object") {
                    if (tree[node] instanceof Array) {
                        for (var idx in tree[node]) {
                            for (var i = 0; i < depth; i++) {
                                xml += "\t";
                            }
                            xml += "<" + node + ">";

                            if (typeof tree[node][idx] === "object") {
                                xml += "\n";
                                xml += unwrap(tree[node][idx], depth + 1);
                                for (var i = 0; i < depth; i++) {
                                    xml += "\t";
                                }
                            } else {
                                xml += tree[node][idx];
                            }
                            xml += "</" + node + ">\n";
                        }

                    } else if (node === "value" && tree.attributes !== undefined) {
                        xml += tree[node];

                    } else if (node !== "attributes") {
                        for (var i = 0; i < depth; i++) {
                            xml += "\t";
                        }

                        xml += "<" + node;
                        for (var a in tree[node].attributes) {
                            xml += " " + a + "=\"" + tree[node].attributes[a] + "\"";
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
                            xml += " />\n";
                        }
                    }
                } else {
                    if (node === "value" && tree.attributes !== undefined) {
                        xml += tree[node];

                    } else {
                        for (var i = 0; i < depth; i++) {
                            xml += "\t";
                        }
                        xml += "<" + node + ">" + tree[node] + "</" + node + ">\n";
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
                        console.log("Array");
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