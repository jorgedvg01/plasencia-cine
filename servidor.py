#!/usr/bin/env python3
"""Servidor local mínimo para abrir la entrega compilada."""

from argparse import ArgumentParser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import webbrowser


def main() -> None:
    parser = ArgumentParser(description="Sirve la experiencia histórica de Plasencia.")
    parser.add_argument("--port", type=int, default=4173)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    project = Path(__file__).resolve().parent
    site = project / "dist"
    if not (site / "index.html").is_file():
        raise SystemExit("No existe dist/index.html. Ejecuta antes: npm install && npm run build")

    handler = partial(SimpleHTTPRequestHandler, directory=str(site))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    url = f"http://127.0.0.1:{args.port}/"
    print(f"Plasencia disponible en {url}")
    print("Pulsa Ctrl+C para cerrar el servidor.")
    if not args.no_browser:
        Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
