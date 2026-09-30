#!/usr/bin/env python3
import os
import sys

# Delegate directly to run.py
root_dir = os.path.dirname(os.path.abspath(__file__))
run_path = os.path.join(root_dir, "run.py")

if __name__ == "__main__":
    if os.path.exists(run_path):
        import run
    else:
        print("Fictophiliac: run.py not found.")
