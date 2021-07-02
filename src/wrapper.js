var editor = require('./editor');

function setEmojis(editorInst, emojis) {
    if ((emojis !== undefined) && (emojis !== null) && (emojis.length > 0)) {
        editorInst.customCodes = function(obj) {
            for (key in emojis){
                if ((key in obj) && (obj[key])) {
                    // Must return an object that encapsulates the inline
                    return {
                        // measure: must return width, ascent and descent
                        measure: function(/*formatting*/) {
                            return {
                                width: emojis[key].width,
                                ascent: emojis[key].ascent,
                                descent: 0
                            };
                        },
                        // draw: implements the appearance of the inline on canvas
                        draw: function(ctx, x, y, width, ascent, descent, formatting) {
                            ctx.drawImage(emojis[key].image, x, y - ascent, width, ascent);
                        }
                    }                    
                }
            }
        };    
    }
}

exports.viewer = function(element, canvas, json_text, emojis, x, y, w, h, scroll, redraw) {
    var drawRect = {
        "x": x, "y": y, "w": w, "h": h,         // Drawing area coords of top left corner and width/height
        "scroll": scroll,                       // Vertical scroll
        "canvas": canvas,                       // Canvas to draw on. Set to undefined if draw on canvas, that were specified on editor creation, set to null to don't draw at all
        "redraw": redraw,                       // Function to prepare canvas before text area to be redrawn. redraw function should explicitly call paint method of drawRect to draw text. Set to null if not required.
        "paint": function(){}                   // Function to paint text on canvas. Is set with actual call handler when editor is created
    };
    
    var editorInst = editor.create(element, canvas, null, null, null, true, false, drawRect)
    setEmojis(editorInst, emojis);
    if ((json_text !== undefined) && (json_text != null)) {
        try {
            if (typeof json_text === "string") {
                json_text = JSON.parse(json_text)
            }
            editorInst.load(json_text)
        } catch (x) {}
    }    
    return {
        area: drawRect,
        doc: editorInst
    }
}

exports.default_editor = function(element, json_text, emojis) {
    var editorInst = editor.create(element)
    setEmojis(editorInst, emojis);
    if ((json_text !== undefined) && (json_text != null)) {
        try {
            if (typeof json_text === "string") {
                json_text = JSON.parse(json_text)
            }
            editorInst.load(json_text)
        } catch (x) {}
    }    
    return {
        editor: editorInst
    }    
}

exports.custom_editor = function(element, json_text, emojis, canvas, spacer, textAreaDiv, textArea) {
    var editorInst = editor.create(element, canvas, spacer, textAreaDiv, textArea);

    setEmojis(editorInst, emojis);
    if ((json_text !== undefined) && (json_text != null)) {
        try {
            if (typeof json_text === "string") {
                json_text = JSON.parse(json_text)
            }
            editorInst.load(json_text)
        } catch (x) {}
    }    
    return {
        editor: editorInst
    }
}
