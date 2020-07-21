import sys
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
    # work around memory leak in pillow 2.8.2
    # see https://github.com/python-pillow/Pillow/issues/1318
    while new_data:
        new_data.pop()    


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


def main() -> int:
    for path in sys.argv[1:]:
        print(get_hash(path).hexdigest(), path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
