import os
import imghash

import selenium.webdriver


def test(driver):
    # TODO start webserver
    driver.get("http://127.0.0.1:8000/test.html")
    driver.set_script_timeout(60)

    element = driver.find_element_by_id("file")

    test_folder = os.path.join(os.path.dirname(__file__), "test")
    for img in os.listdir(test_folder):
        img = os.path.abspath(os.path.join(test_folder, img))
        element.send_keys(img)
        js_hash = driver.execute_async_script(
            "get_file_hash(arguments[arguments.length - 1])"
        )
        py_hash = imghash.get_hash(img)
        assert js_hash == py_hash.hexdigest(), (js_hash, py_hash.hexdigest(), img)


def main():
    driver = selenium.webdriver.Chrome()
    test(driver)
    driver.close()


if __name__ == "__main__":
    main()
