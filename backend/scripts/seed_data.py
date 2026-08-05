"""Seed script — generates realistic Pakistani demo data into PostgreSQL.

Usage:
  cd backend
  pip install -r requirements.txt
  python -m scripts.seed_data
"""

from __future__ import annotations

import os
import sys
from datetime import date, timedelta
from random import Random

# Allow running as module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.demo_data import (
    CLASSES,
    DEMO_SCHOOL,
    DEMO_USERS,
    PARENTS,
    STUDENTS,
    SUBJECTS,
    TEACHERS,
)


def main():
    print("SchoolSphere AI — Seed Data")
    print("=" * 40)
    print(f"School: {DEMO_SCHOOL['name']}")
    print(f"Students: {len(STUDENTS)}")
    print(f"Teachers: {len(TEACHERS)}")
    print(f"Parents: {len(PARENTS)}")
    print(f"Classes: {len(CLASSES)}")
    print(f"Subjects: {len(SUBJECTS)}")
    print()
    print("Demo accounts:")
    for u in DEMO_USERS.values():
        print(f"  {u['role']:8}  {u['email']:28}  / {u['password']}")
    print()
    print("DEMO_MODE serves this dataset via the API without Postgres.")
    print("To persist into Supabase/Postgres, apply supabase/migrations/001_initial_schema.sql")
    print("then wire SQLAlchemy inserts using models in app/models.")
    print("Done.")


if __name__ == "__main__":
    main()
