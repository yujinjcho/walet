from application import app

if __name__ == '__main__':
    app.run(
        port=7000
        # ssl_context=('cert.pem', 'key.pem')
    )
