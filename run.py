#!/usr/bin/env python3
import os
import sys

root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")
backend_run = os.path.join(backend_dir, "run.py")

if __name__ == "__main__":
    if not os.path.exists(backend_run):
        print(f"Error: Could not locate backend runner at {backend_run}")
        sys.exit(1)
    
    # Execute backend/run.py with current interpreter (backend/run.py will auto-switch to venv)
    os.execv(sys.executable, [sys.executable, backend_run] + sys.argv[1:])

