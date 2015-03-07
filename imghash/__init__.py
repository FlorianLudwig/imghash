import hashlib
import struct

from PIL import Image


def remove_transparent_pixels(img):
    pixels = img.getdata()
    new_data = []
    for item in pixels:
        if item[3] == 0:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)


def get_hash(path):
    img = Image.open(path)
    img = img.convert('RGBA')
    remove_transparent_pixels(img)
    data = img.tobytes()

    h = hashlib.sha256()
    size_prefix = struct.pack('!LL', *img.size)
    h.update(size_prefix)
    h.update(data)
    return h


if __name__ == '__main__':
    import sys
    print get_hash(sys.argv[1]).hexdigest()

