from application import app

if __name__ == '__main__':

    if app.config['APPLICATION_ENVIRONMENT'] == 'development':
        app_options = { 'ssl_context' : ('cert.pem', 'key.pem') }
    else:
        app_options = {}

    app.run(port=7000, **app_options)
