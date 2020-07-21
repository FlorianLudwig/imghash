import pathlib
import imghash

BASE = pathlib.Path(__file__).parent.absolute()
IMAGES = {
    BASE
    / pathlib.Path(
        "1Mcolors.jpg"
    ): "16a5c92428a0bd214ddd9e735c8c97481466d954406fb2904bfd38f60a9c817a",
    BASE
    / pathlib.Path(
        "1Mcolors-float.jpg"
    ): "1280312d6bd343eed006e2c55f9c59e0bd9c11f7208c8f5c9c4744a586e27f9c",
    BASE
    / pathlib.Path(
        "transparent.png"
    ): "e9c95c5e48c862df8309e106a848b21040e4fb897731e944523f55408fd4b643",
}


def test_get_hash():
    for img_path, img_hash in IMAGES.items():
        assert imghash.get_hash(img_path).hexdigest() == img_hash
