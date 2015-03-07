function get_image_data(img) {
    var image = new Image();
    image.src = img;
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
    return {
        'data': canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data,
        'width': image.width,
        'height': image.height
    };
}


function image_hash(img) {
    var i;
    img = get_image_data(img);
    var size_prefix_buffer = new ArrayBuffer(8);
    var size_prefix_view = new DataView(size_prefix_buffer);
    size_prefix_view.setUint32(0, img.width);
    size_prefix_view.setUint32(4, img.height);
    var h = new SHA256();
    h.update(new Uint8Array(size_prefix_buffer));
    h.update(img.data);
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
    return s;
}