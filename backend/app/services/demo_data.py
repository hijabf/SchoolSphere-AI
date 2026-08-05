"""Rich Pakistani demo dataset for offline / DEMO_MODE operation."""

from __future__ import annotations

import hashlib
import random
from datetime import date, datetime, timedelta
from typing import Any

# Deterministic RNG for stable demos
_rng = random.Random(42)

MALE_FIRST = [
    "Ahmed", "Ali", "Hassan", "Hussein", "Bilal", "Usmar", "Usman", "Hamza", "Zain", "Fahad",
    "Saad", "Taha", "Ibrahim", "Yusuf", "Omar", "Rayyan", "Ayaan", "Daniyal", "Haris", "Suleman",
    "Abdullah", "Mustafa", "Rehan", "Shahzaib", "Huzaifa", "Ayan", "Arham", "Murtaza", "Kashif", "Nabeel",
]
FEMALE_FIRST = [
    "Ayesha", "Fatima", "Zainab", "Maryam", "Hira", "Sana", "Noor", "Laiba", "Amina", "Iqra",
    "Mahnoor", "Eman", "Hafsa", "Sara", "Aleena", "Rania", "Mehwish", "Khadija", "Saba", "Nimra",
    "Areeba", "Hania", "Mishal", "Anaya", "Zoya", "Dua", "Amna", "Bushra", "Rabia", "Sundas",
]
LAST_NAMES = [
    "Khan", "Ahmed", "Ali", "Hussain", "Malik", "Raza", "Butt", "Sheikh", "Qureshi", "Siddiqui",
    "Hashmi", "Mirza", "Chaudhry", "Bhatti", "Dar", "Javed", "Iqbal", "Rehman", "Akhtar", "Nawaz",
    "Shah", "Baig", "Ansari", "Farooq", "Abbas", "Rashid", "Yousaf", "Gilani", "Kazmi", "Naqvi",
]

SUBJECTS = [
    {"name": "Mathematics", "code": "MATH"},
    {"name": "English", "code": "ENG"},
    {"name": "Urdu", "code": "URDU"},
    {"name": "Science", "code": "SCI"},
    {"name": "Islamiyat", "code": "ISL"},
    {"name": "Pakistan Studies", "code": "PST"},
    {"name": "Computer Science", "code": "CS"},
    {"name": "Physics", "code": "PHY"},
]

CLASSES = [
    {"name": "Grade 6", "section": "A", "grade_level": 6},
    {"name": "Grade 6", "section": "B", "grade_level": 6},
    {"name": "Grade 7", "section": "A", "grade_level": 7},
    {"name": "Grade 7", "section": "B", "grade_level": 7},
    {"name": "Grade 8", "section": "A", "grade_level": 8},
    {"name": "Grade 8", "section": "B", "grade_level": 8},
    {"name": "Grade 9", "section": "A", "grade_level": 9},
    {"name": "Grade 9", "section": "B", "grade_level": 9},
    {"name": "Grade 10", "section": "A", "grade_level": 10},
    {"name": "Grade 10", "section": "B", "grade_level": 10},
]

DEMO_SCHOOL = {
    "id": "school-demo-001",
    "name": "Al-Noor Progressive School",
    "slug": "al-noor-progressive",
    "city": "Lahore",
    "province": "Punjab",
    "country": "Pakistan",
    "academic_year": "2025-2026",
    "health_score": 78.4,
    "health_level": "good",
    "address": "12-B Gulberg III, Lahore",
    "email": "info@alnoor.edu.pk",
    "phone": "+92-42-35781234",
}

DEMO_USERS = {
    "demo-admin": {
        "id": "demo-admin",
        "email": "admin@schoolsphere.ai",
        "full_name": "Principal Farooq Malik",
        "role": "admin",
        "school_id": DEMO_SCHOOL["id"],
        "password": "demo1234",
    },
    "demo-teacher": {
        "id": "demo-teacher",
        "email": "teacher@schoolsphere.ai",
        "full_name": "Ms. Ayesha Siddiqui",
        "role": "teacher",
        "school_id": DEMO_SCHOOL["id"],
        "password": "demo1234",
    },
    "demo-parent": {
        "id": "demo-parent",
        "email": "parent@schoolsphere.ai",
        "full_name": "Mr. Imran Khan",
        "role": "parent",
        "school_id": DEMO_SCHOOL["id"],
        "password": "demo1234",
    },
    "demo-student": {
        "id": "demo-student",
        "email": "student@schoolsphere.ai",
        "full_name": "Zainab Khan",
        "role": "student",
        "school_id": DEMO_SCHOOL["id"],
        "password": "demo1234",
    },
}


def get_demo_user(user_id: str) -> dict | None:
    u = DEMO_USERS.get(user_id)
    if not u:
        return None
    return {
        "id": u["id"],
        "email": u["email"],
        "full_name": u["full_name"],
        "role": u["role"],
        "school_id": u["school_id"],
        "avatar_url": None,
    }


def authenticate_demo(email: str, password: str) -> dict | None:
    for u in DEMO_USERS.values():
        if u["email"].lower() == email.lower() and u["password"] == password:
            return get_demo_user(u["id"])
    return None


def _stable_id(prefix: str, n: int) -> str:
    return f"{prefix}-{n:04d}"


def _name(gender: str) -> str:
    first = _rng.choice(MALE_FIRST if gender == "male" else FEMALE_FIRST)
    return f"{first} {_rng.choice(LAST_NAMES)}"


def build_students(n: int = 500) -> list[dict[str, Any]]:
    students = []
    for i in range(1, n + 1):
        gender = "male" if i % 2 == 0 else "female"
        cls = CLASSES[(i - 1) % len(CLASSES)]
        gpa = round(_rng.uniform(1.8, 4.0), 2)
        att = round(_rng.uniform(62, 99), 1)
        risk = "low"
        if att < 75 or gpa < 2.2:
            risk = "high"
        elif att < 85 or gpa < 2.8:
            risk = "medium"
        students.append(
            {
                "id": _stable_id("stu", i),
                "full_name": _name(gender) if i > 1 else "Zainab Khan",
                "gender": gender,
                "class_name": f"{cls['name']}-{cls['section']}",
                "grade_level": cls["grade_level"],
                "section": cls["section"],
                "roll_number": f"{cls['grade_level']}{cls['section']}{i % 50 + 1:02d}",
                "gpa": gpa if i > 1 else 3.62,
                "attendance_pct": att if i > 1 else 94.5,
                "risk_level": risk if i > 1 else "low",
                "city": _rng.choice(["Lahore", "Lahore", "Lahore", "Kasur", "Sheikhupura"]),
                "interests": _rng.sample(
                    ["Science", "Art", "Sports", "Coding", "Reading", "Debate", "Math Olympiad"],
                    k=2,
                ),
            }
        )
    return students


def build_teachers(n: int = 30) -> list[dict[str, Any]]:
    teachers = []
    for i in range(1, n + 1):
        gender = "female" if i % 3 != 0 else "male"
        subj = SUBJECTS[(i - 1) % len(SUBJECTS)]
        teachers.append(
            {
                "id": _stable_id("tch", i),
                "full_name": _name(gender) if i > 1 else "Ms. Ayesha Siddiqui",
                "specialization": subj["name"],
                "employee_code": f"T-{1000 + i}",
                "performance_score": round(_rng.uniform(68, 96), 1) if i > 1 else 91.2,
                "qualification": _rng.choice(["M.Ed", "M.Sc", "MA", "B.Ed + M.A", "M.Phil"]),
                "classes": [f"{c['name']}-{c['section']}" for c in _rng.sample(CLASSES, k=2)],
            }
        )
    return teachers


def build_parents(n: int = 500) -> list[dict[str, Any]]:
    parents = []
    for i in range(1, n + 1):
        parents.append(
            {
                "id": _stable_id("par", i),
                "full_name": _name("male") if i > 1 else "Mr. Imran Khan",
                "occupation": _rng.choice(
                    ["Business", "Teacher", "Engineer", "Doctor", "Shopkeeper", "Civil Servant", "Farmer"]
                ),
                "student_ids": [_stable_id("stu", i)],
            }
        )
    return parents


STUDENTS = build_students(500)
TEACHERS = build_teachers(30)
PARENTS = build_parents(500)


def admin_dashboard() -> dict[str, Any]:
    at_risk = [s for s in STUDENTS if s["risk_level"] == "high"]
    medium_risk = [s for s in STUDENTS if s["risk_level"] == "medium"]
    avg_att = round(sum(s["attendance_pct"] for s in STUDENTS) / len(STUDENTS), 1)
    avg_gpa = round(sum(s["gpa"] for s in STUDENTS) / len(STUDENTS), 2)
    males = sum(1 for s in STUDENTS if s["gender"] == "male")
    females = len(STUDENTS) - males
    fee_collected = 4_850_000
    fee_pending = 920_000

    months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    attendance_trend = [
        {"month": m, "student": round(88 + _rng.uniform(-4, 6), 1), "teacher": round(92 + _rng.uniform(-3, 4), 1)}
        for m in months
    ]
    enrollment_trend = [
        {"month": m, "students": 420 + i * 12 + _rng.randint(-5, 8)} for i, m in enumerate(months)
    ]
    performance_by_subject = [
        {"subject": s["name"], "avg": round(_rng.uniform(62, 88), 1)} for s in SUBJECTS
    ]
    class_performance = [
        {
            "class": f"{c['name']}-{c['section']}",
            "avg_gpa": round(_rng.uniform(2.4, 3.7), 2),
            "attendance": round(_rng.uniform(78, 96), 1),
        }
        for c in CLASSES
    ]
    teacher_performance = [
        {"name": t["full_name"].split()[-1], "score": t["performance_score"]} for t in TEACHERS[:8]
    ]
    fee_trend = [
        {"month": m, "collected": 620000 + _rng.randint(-40000, 80000), "pending": 110000 + _rng.randint(-20000, 40000)}
        for m in months
    ]
    admissions = [
        {"month": m, "count": _rng.randint(8, 28)} for m in months
    ]

    return {
        "cards": {
            "total_students": len(STUDENTS),
            "total_teachers": len(TEACHERS),
            "total_parents": len(PARENTS),
            "todays_attendance": 91.3,
            "student_attendance_pct": avg_att,
            "teacher_attendance_pct": 94.8,
            "fee_collection": fee_collected,
            "pending_fees": fee_pending,
            "students_at_risk": len(at_risk),
            "students_medium_risk": len(medium_risk),
            "teacher_performance_score": 84.6,
            "school_health_score": DEMO_SCHOOL["health_score"],
            "school_health_level": DEMO_SCHOOL["health_level"],
            "avg_gpa": avg_gpa,
        },
        "charts": {
            "attendance_trend": attendance_trend,
            "enrollment_trend": enrollment_trend,
            "performance_by_subject": performance_by_subject,
            "gender_ratio": [
                {"name": "Boys", "value": males},
                {"name": "Girls", "value": females},
            ],
            "fee_collection": fee_trend,
            "admissions": admissions,
            "class_performance": class_performance,
            "teacher_performance": teacher_performance,
            "equity": {
                "attendance": {"boys": 88.2, "girls": 90.1},
                "gpa": {"boys": 3.05, "girls": 3.18},
                "enrollment": {"boys": males, "girls": females},
            },
            "sdg": [
                {"goal": "SDG 4 Quality Education", "progress": 76},
                {"goal": "SDG 5 Gender Equality", "progress": 82},
                {"goal": "SDG 9 Innovation", "progress": 61},
                {"goal": "SDG 10 Reduced Inequalities", "progress": 71},
            ],
        },
        "at_risk_students": at_risk[:12],
        "recent_activities": [
            {"action": "Attendance marked for Grade 8-A", "user": "Ms. Ayesha Siddiqui", "time": "12 min ago"},
            {"action": "Midterm marks uploaded — Mathematics", "user": "Mr. Bilal Ahmed", "time": "45 min ago"},
            {"action": "Fee payment received — PKR 12,000", "user": "Accounts", "time": "1 hr ago"},
            {"action": "New announcement published", "user": "Principal Farooq Malik", "time": "2 hr ago"},
            {"action": "AI early-warning flagged 3 students", "user": "SchoolSphere AI", "time": "3 hr ago"},
        ],
        "announcements": [
            {
                "id": "ann-1",
                "title": "Midterm Examinations Schedule",
                "body": "Midterms begin 15 March. Timetable posted on notice boards.",
                "published_at": "2026-03-01",
            },
            {
                "id": "ann-2",
                "title": "Parent-Teacher Meeting",
                "body": "PTM scheduled for 22 March, 9:00 AM – 1:00 PM.",
                "published_at": "2026-03-05",
            },
        ],
        "school": DEMO_SCHOOL,
    }


def student_dashboard(student_id: str = "stu-0001") -> dict[str, Any]:
    student = next((s for s in STUDENTS if s["id"] == student_id), STUDENTS[0])
    subjects_perf = [
        {"subject": s["name"], "score": round(_rng.uniform(55, 95), 0), "trend": _rng.choice([-3, -1, 0, 2, 4])}
        for s in SUBJECTS
    ]
    months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    return {
        "profile": student,
        "cards": {
            "attendance_pct": student["attendance_pct"],
            "gpa": student["gpa"],
            "achievements": 4,
            "upcoming_exams": 3,
        },
        "subject_performance": subjects_perf,
        "performance_trend": [
            {"month": m, "gpa": round(2.8 + i * 0.1 + _rng.uniform(-0.15, 0.15), 2)} for i, m in enumerate(months)
        ],
        "attendance_trend": [
            {"month": m, "pct": round(88 + _rng.uniform(-5, 8), 1)} for m in months
        ],
        "quiz_results": [
            {"title": "Algebra Quiz 3", "subject": "Mathematics", "score": 16, "total": 20, "date": "2026-02-18"},
            {"title": "Essay Writing", "subject": "English", "score": 14, "total": 20, "date": "2026-02-20"},
            {"title": "Forces & Motion", "subject": "Science", "score": 18, "total": 20, "date": "2026-02-25"},
        ],
        "exam_results": [
            {"title": "Midterm Mathematics", "score": 78, "total": 100, "grade": "B+", "date": "2026-01-15"},
            {"title": "Midterm English", "score": 82, "total": 100, "grade": "A-", "date": "2026-01-16"},
            {"title": "Midterm Science", "score": 85, "total": 100, "grade": "A", "date": "2026-01-17"},
        ],
        "achievements": [
            {"title": "Science Fair Winner", "category": "Academic", "awarded_at": "2025-11-20"},
            {"title": "Perfect Attendance — Dec", "category": "Attendance", "awarded_at": "2025-12-31"},
            {"title": "Debate Club Finalist", "category": "Co-curricular", "awarded_at": "2026-01-28"},
        ],
        "teacher_remarks": [
            {"teacher": "Ms. Ayesha Siddiqui", "subject": "Mathematics", "remark": "Shows strong problem-solving; encourage more practice with word problems."},
            {"teacher": "Mr. Bilal Ahmed", "subject": "English", "remark": "Excellent vocabulary growth this term."},
        ],
        "behavior": [
            {"category": "positive", "title": "Helped peer with homework", "date": "2026-02-10"},
            {"category": "neutral", "title": "Late to assembly once", "date": "2026-02-03"},
        ],
        "upcoming_exams": [
            {"title": "Monthly Test — Math", "date": "2026-03-12", "subject": "Mathematics"},
            {"title": "Monthly Test — Science", "date": "2026-03-14", "subject": "Science"},
            {"title": "Urdu Oral Assessment", "date": "2026-03-18", "subject": "Urdu"},
        ],
        "timetable": [
            {"day": "Monday", "slots": ["Math", "English", "Science", "Urdu", "CS"]},
            {"day": "Tuesday", "slots": ["English", "Math", "Islamiyat", "Science", "PST"]},
            {"day": "Wednesday", "slots": ["Science", "Math", "English", "PE", "Urdu"]},
            {"day": "Thursday", "slots": ["Math", "CS", "Science", "English", "Art"]},
            {"day": "Friday", "slots": ["Islamiyat", "Math", "Urdu", "Assembly", "Clubs"]},
        ],
        "announcements": admin_dashboard()["announcements"],
        "notifications": [
            {"title": "New quiz grades posted", "body": "Algebra Quiz 3 results available", "time": "1h ago"},
            {"title": "Reminder: Science fair", "body": "Bring project boards tomorrow", "time": "Yesterday"},
        ],
    }


def parent_dashboard() -> dict[str, Any]:
    child = STUDENTS[0]
    siblings = [STUDENTS[0], STUDENTS[41]]
    data = student_dashboard(child["id"])
    return {
        "children": siblings,
        "selected_child": child,
        **data,
        "fee_status": {
            "status": "paid",
            "amount": 12000,
            "month": "February 2026",
            "history": [
                {"month": "Dec 2025", "amount": 12000, "status": "paid"},
                {"month": "Jan 2026", "amount": 12000, "status": "paid"},
                {"month": "Feb 2026", "amount": 12000, "status": "paid"},
                {"month": "Mar 2026", "amount": 12000, "status": "pending"},
            ],
        },
        "progress_timeline": [
            {"date": "2025-09", "event": "New academic year started", "detail": "Enrolled in Grade 8-A"},
            {"date": "2025-11", "event": "Science Fair Winner", "detail": "First place — renewable energy model"},
            {"date": "2026-01", "event": "Midterms completed", "detail": "GPA rose to 3.62"},
            {"date": "2026-02", "event": "Strong quiz streak", "detail": "3 consecutive quizzes above 80%"},
        ],
    }


def teacher_dashboard() -> dict[str, Any]:
    class_students = [s for s in STUDENTS if s["class_name"] == "Grade 8-A"][:40]
    return {
        "profile": TEACHERS[0],
        "todays_classes": [
            {"time": "08:00", "class": "Grade 8-A", "subject": "Mathematics", "room": "R-12"},
            {"time": "10:00", "class": "Grade 9-B", "subject": "Mathematics", "room": "R-18"},
            {"time": "12:00", "class": "Grade 7-A", "subject": "Mathematics", "room": "R-09"},
        ],
        "students": class_students,
        "cards": {
            "my_students": len(class_students),
            "classes_today": 3,
            "pending_marking": 12,
            "avg_class_attendance": 89.4,
        },
        "attendance_today": [
            {"student_id": s["id"], "name": s["full_name"], "status": "present"} for s in class_students[:15]
        ],
        "class_analytics": {
            "avg_gpa": round(sum(s["gpa"] for s in class_students) / max(len(class_students), 1), 2),
            "attendance": 89.4,
            "at_risk": sum(1 for s in class_students if s["risk_level"] != "low"),
        },
        "subject_analytics": [
            {"topic": "Algebra", "mastery": 72},
            {"topic": "Geometry", "mastery": 81},
            {"topic": "Statistics", "mastery": 64},
            {"topic": "Word Problems", "mastery": 58},
        ],
        "performance_trend": [
            {"month": m, "avg": round(68 + i * 2 + _rng.uniform(-2, 2), 1)}
            for i, m in enumerate(["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"])
        ],
        "assignments": [
            {"title": "Linear Equations Worksheet", "due": "2026-03-10", "submitted": 28, "total": 40},
            {"title": "Geometry Project", "due": "2026-03-18", "submitted": 12, "total": 40},
        ],
        "announcements": admin_dashboard()["announcements"],
    }


def global_search(q: str) -> dict[str, list]:
    ql = q.lower().strip()
    if not ql:
        return {"students": [], "teachers": [], "parents": [], "subjects": [], "classes": []}
    return {
        "students": [s for s in STUDENTS if ql in s["full_name"].lower()][:10],
        "teachers": [t for t in TEACHERS if ql in t["full_name"].lower()][:10],
        "parents": [p for p in PARENTS if ql in p["full_name"].lower()][:10],
        "subjects": [s for s in SUBJECTS if ql in s["name"].lower()],
        "classes": [c for c in CLASSES if ql in f"{c['name']}-{c['section']}".lower()],
    }


def early_warning_list() -> list[dict]:
    flagged = []
    for s in STUDENTS:
        reasons = []
        if s["attendance_pct"] < 80:
            reasons.append("Low attendance")
        if s["gpa"] < 2.5:
            reasons.append("Low grades")
        if s["risk_level"] == "high":
            reasons.append("Behavior / fee risk pattern")
        if reasons:
            flagged.append({**s, "reasons": reasons, "risk_level": s["risk_level"]})
    return sorted(flagged, key=lambda x: {"high": 0, "medium": 1, "low": 2}[x["risk_level"]])[:50]


def school_context_for_ai() -> str:
    dash = admin_dashboard()
    cards = dash["cards"]
    return (
        f"School: {DEMO_SCHOOL['name']} ({DEMO_SCHOOL['city']}, Pakistan). "
        f"Academic year {DEMO_SCHOOL['academic_year']}. "
        f"Students: {cards['total_students']}, Teachers: {cards['total_teachers']}, Parents: {cards['total_parents']}. "
        f"Student attendance: {cards['student_attendance_pct']}%, Teacher attendance: {cards['teacher_attendance_pct']}%. "
        f"Avg GPA: {cards['avg_gpa']}. At-risk students: {cards['students_at_risk']}. "
        f"Fee collected PKR {cards['fee_collection']:,}, pending PKR {cards['pending_fees']:,}. "
        f"School health score: {cards['school_health_score']} ({cards['school_health_level']}). "
        f"Top weak subjects from averages: "
        + ", ".join(
            f"{x['subject']}={x['avg']}"
            for x in sorted(dash['charts']['performance_by_subject'], key=lambda z: z['avg'])[:3]
        )
        + ". Lowest attendance classes: "
        + ", ".join(
            f"{x['class']} ({x['attendance']}%)"
            for x in sorted(dash['charts']['class_performance'], key=lambda z: z['attendance'])[:3]
        )
        + "."
    )
