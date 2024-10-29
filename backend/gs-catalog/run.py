import os
from app import create_app

app = create_app()

def main():
    host = os.getenv('GS_HOST', '127.0.0.1')
    debug = os.getenv('GS_DEBUG', 'false').lower() == 'true'
    app.run(host=host, debug=debug)

if __name__ == '__main__':
    main()
