from app import create_app
from dotenv import load_dotenv


load_dotenv()
app = create_app()

if __name__ == "__main__":
    # LOCAL ONLY (WITHOUT WSGI)
    app.run(host="0.0.0.0", port=5000, debug=False)
