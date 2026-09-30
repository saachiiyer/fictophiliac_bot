#!/usr/bin/env python3
import os
import sys
import glob
import socket

# Ensure backend directory is in python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
venv_dir = os.path.join(backend_dir, "venv")
venv_python = os.path.join(venv_dir, "bin", "python3")

# Auto re-execute with virtual environment python if not active
if os.path.exists(venv_python) and sys.prefix != venv_dir:
    script_path = os.path.abspath(__file__)
    os.execv(venv_python, [venv_python, script_path] + sys.argv[1:])

# Fallback: ensure venv site-packages are in sys.path
site_packages_pattern = os.path.join(venv_dir, "lib", "python*", "site-packages")
for sp in glob.glob(site_packages_pattern):
    if sp not in sys.path:
        sys.path.insert(0, sp)

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
os.chdir(backend_dir)

import uvicorn
from app.core.config import settings

def get_available_port(default_port: int) -> int:
    for idx, arg in enumerate(sys.argv):
        if arg in ("--port", "-p") and idx + 1 < len(sys.argv):
            try:
                return int(sys.argv[idx + 1])
            except ValueError:
                pass

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('0.0.0.0', default_port))
            return default_port
        except OSError:
            pass

    for candidate in range(default_port + 1, default_port + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('0.0.0.0', candidate))
                return candidate
            except OSError:
                continue
    return default_port

if __name__ == "__main__":
    target_port = get_available_port(settings.PORT)
    if target_port != settings.PORT:
        print(f"\n⚠️  Port {settings.PORT} is currently busy. Auto-selected available port {target_port}.")
        print(f"💡 (To free port {settings.PORT}, run in terminal: kill -9 $(lsof -ti :{settings.PORT}))\n")

    print("=" * 64)
    print("✨ FICTOPHILIAC — The Literary Cave by Saachi Iyer ✨")
    print(f"📡 API Documentation: http://localhost:{target_port}/api/v1/docs")
    print(f"🌐 Web App & Cave:    http://localhost:{target_port}")
    print("=" * 64 + "\n")

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=target_port,
        reload=False
    )
