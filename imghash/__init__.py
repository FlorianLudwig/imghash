import sys
import hashlib
import struct

from PIL import Image


def remove_transparent_pixels(img) -> None:
    """removes color information from 100% transparent pixels"""
    pixels = img.getdata()
    new_data = []
    for item in pixels:
        if item[3] == 0:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)


def get_hash(path: str):
    img = Image.open(path)
    img = img.convert("RGBA")
    remove_transparent_pixels(img)
    data = img.tobytes()

    hash_obj = hashlib.sha256()
    size_prefix = struct.pack("!LL", *img.size)
    hash_obj.update(size_prefix)
    hash_obj.update(data)
    return hash_obj


def main() -> int:
    for path in sys.argv[1:]:
        print(get_hash(path).hexdigest(), path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
