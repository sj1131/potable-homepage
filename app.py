from flask import Flask, request, render_template, url_for, jsonify
import json
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding

#####################################################################

DEBUG = False

try:
    with open('./config/flask_key', 'rb') as f:
        SECRET_KEY = f.read()
    with open('./config/aes_key', 'rb') as f:
        AES_KEY = f.read()
    with open('./config/aes_init', 'rb') as f:
        INIT_VECTOR = f.read()
except:
    os.makedirs('./config', exist_ok=True)
    os.makedirs('./data', exist_ok=True)
    with open('./config/flask_key', 'wb') as f:
        SECRET_KEY = os.urandom(12)
        f.write(SECRET_KEY)
    with open('./config/aes_key', 'wb') as f:
        AES_KEY = os.urandom(32)
        f.write(AES_KEY)
    with open('./config/aes_init', 'wb') as f:
        INIT_VECTOR = os.urandom(16)
        f.write(INIT_VECTOR)

#####################################################################

cipher = Cipher(algorithms.AES256(AES_KEY), modes.CBC(INIT_VECTOR))

def get_padder():
    return padding.PKCS7(128).padder()
def get_unpadder():
    return padding.PKCS7(128).unpadder()
def encrypt(text:str) -> bytes:
    padder = get_padder()
    padded = padder.update(text.encode('utf-8')) + padder.finalize()
    enc = cipher.encryptor()
    return enc.update(padded) + enc.finalize()
def decrypt(code:bytes) -> str:
    dec = cipher.decryptor()
    text = dec.update(code) + dec.finalize()
    unpadder = get_unpadder()
    text = unpadder.update(text) + unpadder.finalize()
    return text.decode('utf-8')

#####################################################################

app = Flask(__name__)
app.config.from_object(__name__)

#####################################################################
# Index

@app.route('/')
def index():
    files = os.scandir('./data')
    return render_template('index.html', files=files)

#####################################################################
# Editor

@app.route('/editor/<filename>')
def get_file(filename):
    if filename not in os.listdir('./data'):
        with open(f'./data/{filename}', 'wb') as f:
            f.write(encrypt(''))
    with open(f'./data/{filename}', 'rb') as f:
        file = {'filename': filename, 'data': decrypt(f.read())}
    return render_template('editor.html', file=file)

@app.route('/editor/<filename>/save', methods=['POST'])
def save_file(filename):
    data = request.get_json()
    new_name = data.get('filename')
    if filename != new_name:
        try:
            os.remove(f'./data/{filename}')
        except:
            pass
    with open(f'./data/{new_name}', 'wb') as f:
        f.write(encrypt(data.get('data')))
    return jsonify({
        'is_new': filename != new_name,
        'filename': new_name
    })

#####################################################################

def main():
    app.run('0.0.0.0')

if __name__ == '__main__':
    main()