var imgHash;

(function() {
    "use strict";

    var _imageDataCanvas = function (img) {
        return new Promise(function(resolve, reject) {
            var image = new Image();
            image.src = img;
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            resolve({
                'data': canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data,
                'width': image.width,
                'height': image.height
            });
        });
    };

    function stringToUint8array(str) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    /**
     * Decode pngtoy from data url
     * @param img
     * @returns {Promise}
     * @private
     */
    var _imageDataPNG = function (img) {
        var promise = new Promise(function(resolve, reject) {
            var pngtoy = new PngToy();

            // decode dataURL
            var data = window.atob(img.substring(22));
            var view = new DataView(stringToUint8array(data)),
                chunkO;

            if (view.getUint32(0) === 0x89504E47 && view.getUint32(4) === 0x0D0A1A0A) {
                pngtoy.buffer = view.buffer;
                pngtoy.view = view;
                chunkO = PngToy._getChunks(pngtoy.buffer, pngtoy.view, pngtoy.doCRC, pngtoy.allowInvalid);
                pngtoy.chunks = chunkO.chunks || null;

                var hdr = pngtoy.get_IHDR(),
                    type = ["G", "", "RGB", "INDEX", "GA", "", "RGBA"][hdr.type];

                if(type == 'RGBA') {
                    pngtoy.decode().then(function(data){
                        resolve({
                            'data': data.bitmap,
                            'width': data.width,
                            'height': data.height
                        });
                    });
                } else {
                    // fall back to canvas method
                    _imageDataCanvas(img).then(function(data) {
                        resolve(data)
                    });
                }
            } else {
                reject('Not a PNG file.');
            }
        });


        return promise;
    };

    var _imageData = function(img) {
        if(img.substring(0, 14) == 'data:image/png') {
            return _imageDataPNG(img);
        } else {
            return _imageDataCanvas(img);
        }
    };

    imgHash = function (img) {
        return new Promise(function(resolve, reject) {
            _imageData(img).then(function(data) {
                var i;
                var size_prefix_buffer = new ArrayBuffer(8);
                var size_prefix_view = new DataView(size_prefix_buffer);
                size_prefix_view.setUint32(0, data.width);
                size_prefix_view.setUint32(4, data.height);
                var h = new SHA256();
                h.update(new Uint8Array(size_prefix_buffer));
                h.update(data.data);
                var result = new Uint8Array(32);
                h.finish(result).clean();

                // convert to hex digest
                var s = "";
                var c;
                for(i in result) {
                    c = result[i].toString(16);
                    if(c.length == 1) {
                        c = "0" + c;
                    }
                    s += c;
                }
                resolve(s);
            });
        });
    }
})();
