#!/usr/bin/env python3
import os
import sys

# Ensure backend directory is in python path
root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

if __name__ == "__main__":
    import uvicorn
    # Render and cloud hosts set PORT in environment (typically 10000)
    port = int(os.environ.get("PORT", 10000))
    print(f"Starting Fictophiliac on 0.0.0.0:{port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port)
