from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser
os.chdir(Path(__file__).resolve().parent)
server = ThreadingHTTPServer(("127.0.0.1", 0), SimpleHTTPRequestHandler)
url = f"http://127.0.0.1:{server.server_port}/"
print("Plasencia: " + url + " — Ctrl+C para cerrar")
webbrowser.open(url)
try: server.serve_forever()
except KeyboardInterrupt: server.server_close()
