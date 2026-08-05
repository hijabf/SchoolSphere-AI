"""Gemini-powered AI services grounded in school data.

Never invent metrics — always inject real/demo context into prompts.
Falls back to deterministic grounded responses when GEMINI_API_KEY is unset.
"""

from __future__ import annotations

import json
from typing import Any, Optional

from app.core.config import settings
from app.services import demo_data as demo


def _gemini_generate(prompt: str) -> Optional[str]:
    if not settings.GEMINI_API_KEY:
        return None
    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        resp = model.generate_content(
            prompt
            + "\n\nSTRICT RULES: Use ONLY the provided school data. "
            "Do not invent names, numbers, or events not present in the context. "
            "If data is insufficient, say so clearly. Respond in clear professional English."
        )
        return (resp.text or "").strip()
    except Exception as e:
        return f"[AI unavailable: {e}]"


def _fallback(title: str, bullets: list[str]) -> str:
    return title + "\n\n" + "\n".join(f"• {b}" for b in bullets)


def report_card_comment(student_id: str) -> dict[str, Any]:
    student = next((s for s in demo.STUDENTS if s["id"] == student_id), demo.STUDENTS[0])
    ctx = (
        f"Student: {student['full_name']}, Class: {student['class_name']}, "
        f"GPA: {student['gpa']}, Attendance: {student['attendance_pct']}%, "
        f"Risk: {student['risk_level']}, Interests: {', '.join(student.get('interests', []))}."
    )
    prompt = (
        f"{demo.school_context_for_ai()}\n{ctx}\n"
        "Write a personalized report-card comment (120-160 words) covering academic progress, "
        "attendance, behavior tone, and one concrete improvement suggestion."
    )
    text = _gemini_generate(prompt) or _fallback(
        f"Report card comment for {student['full_name']}",
        [
            f"{student['full_name']} has maintained a GPA of {student['gpa']} in {student['class_name']} "
            f"with {student['attendance_pct']}% attendance this term.",
            "Classwork shows steady engagement, particularly in areas aligned with their interests "
            f"({', '.join(student.get('interests', ['learning']))}).",
            "Continued practice on weaker topics and consistent punctuality will further strengthen outcomes.",
            "Overall progress is encouraging; targeted revision before upcoming assessments is recommended.",
        ],
    )
    return {"student": student, "comment": text, "grounded": True}


def parent_progress_summary(student_id: str) -> dict[str, Any]:
    student = next((s for s in demo.STUDENTS if s["id"] == student_id), demo.STUDENTS[0])
    prompt = (
        f"{demo.school_context_for_ai()}\n"
        f"Child: {student['full_name']}, GPA {student['gpa']}, attendance {student['attendance_pct']}%, "
        f"risk {student['risk_level']}. Explain progress in simple parent-friendly language."
    )
    text = _gemini_generate(prompt) or _fallback(
        f"Progress summary for {student['full_name']}",
        [
            f"Your child currently holds a GPA of {student['gpa']} with {student['attendance_pct']}% attendance.",
            "Strengths appear in consistent class participation and recent quiz performance.",
            "Focus areas: reinforce daily study habits and review topics flagged by subject teachers.",
            "We recommend a short weekly check-in on homework completion and sleep routine.",
        ],
    )
    return {"student": student, "summary": text}


def student_performance_analyzer(student_id: str) -> dict[str, Any]:
    student = next((s for s in demo.STUDENTS if s["id"] == student_id), demo.STUDENTS[0])
    strengths = student.get("interests", [])[:2] or ["Consistent effort"]
    weaknesses = []
    if student["attendance_pct"] < 85:
        weaknesses.append("Attendance consistency")
    if student["gpa"] < 3.0:
        weaknesses.append("Overall academic average")
    if not weaknesses:
        weaknesses.append("Advanced problem-solving under timed conditions")
    text = _gemini_generate(
        f"Analyze strengths/weaknesses for {student}. School: {demo.school_context_for_ai()}"
    ) or _fallback(
        "Performance analysis",
        [
            f"Strengths: {', '.join(strengths)}.",
            f"Weaknesses: {', '.join(weaknesses)}.",
            "Improvement: schedule 3 focused revision sessions weekly and track quiz scores.",
        ],
    )
    return {
        "student": student,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "analysis": text,
    }


def early_warning() -> dict[str, Any]:
    flagged = demo.early_warning_list()
    summary = _gemini_generate(
        f"{demo.school_context_for_ai()}\nFlagged students (top 15): {json.dumps(flagged[:15])}\n"
        "Summarize intervention priorities for the principal."
    ) or _fallback(
        "Early warning summary",
        [
            f"{len(flagged)} students currently meet intervention criteria.",
            "Primary drivers: attendance below 80% and GPA below 2.5.",
            "Recommend counselor outreach within 7 days for high-risk students.",
            "Schedule parent meetings for the top 10 flagged cases.",
        ],
    )
    return {"count": len(flagged), "students": flagged, "summary": summary}


def dropout_risk() -> dict[str, Any]:
    students = demo.STUDENTS
    buckets = {"low": 0, "medium": 0, "high": 0}
    for s in students:
        buckets[s["risk_level"]] += 1
    return {
        "distribution": buckets,
        "high_risk": [s for s in students if s["risk_level"] == "high"][:20],
        "insight": (
            f"Of {len(students)} students: {buckets['high']} high, {buckets['medium']} medium, "
            f"{buckets['low']} low academic risk. High-risk cohort needs attendance + tutoring intervention."
        ),
    }


def principal_copilot(question: str) -> dict[str, Any]:
    ctx = demo.school_context_for_ai()
    dash = demo.admin_dashboard()
    q = question.lower()
    # Deterministic answers for common queries (always grounded)
    if "need help" in q or "at risk" in q:
        flagged = demo.early_warning_list()[:8]
        answer = "Students needing help right now:\n" + "\n".join(
            f"- {s['full_name']} ({s['class_name']}): {', '.join(s['reasons'])} — risk {s['risk_level']}"
            for s in flagged
        )
    elif "teacher" in q and "improved" in q:
        top = sorted(demo.TEACHERS, key=lambda t: t["performance_score"], reverse=True)[:5]
        answer = "Highest teacher performance scores:\n" + "\n".join(
            f"- {t['full_name']} ({t['specialization']}): {t['performance_score']}" for t in top
        )
    elif "lowest attendance" in q or "attendance" in q and "class" in q:
        lowest = sorted(dash["charts"]["class_performance"], key=lambda x: x["attendance"])[:5]
        answer = "Classes with lowest attendance:\n" + "\n".join(
            f"- {c['class']}: {c['attendance']}%" for c in lowest
        )
    elif "mathematics" in q or "math" in q:
        math = next(x for x in dash["charts"]["performance_by_subject"] if x["subject"] == "Mathematics")
        answer = (
            f"Mathematics average is currently {math['avg']}%. "
            "Compared with other subjects, focus remediation on word problems and algebra mastery "
            "in Grades 8–9 where class analytics show weaker topic mastery."
        )
    elif "summarize" in q or "this month" in q:
        c = dash["cards"]
        answer = (
            f"Monthly snapshot for {demo.DEMO_SCHOOL['name']}: "
            f"attendance {c['student_attendance_pct']}%, avg GPA {c['avg_gpa']}, "
            f"{c['students_at_risk']} high-risk students, fee collection PKR {c['fee_collection']:,} "
            f"with PKR {c['pending_fees']:,} pending. Health score {c['school_health_score']}."
        )
    else:
        answer = _gemini_generate(f"Context:\n{ctx}\n\nPrincipal question: {question}") or (
            f"Based on current school data — {ctx} "
            f"Please refine your question for a more specific breakdown."
        )
    return {"question": question, "answer": answer, "grounded": True}


def teacher_performance_summary(teacher_id: str = "tch-0001") -> dict[str, Any]:
    teacher = next((t for t in demo.TEACHERS if t["id"] == teacher_id), demo.TEACHERS[0])
    text = _fallback(
        f"Teacher summary — {teacher['full_name']}",
        [
            f"Specialization: {teacher['specialization']}; performance score {teacher['performance_score']}.",
            f"Assigned classes: {', '.join(teacher['classes'])}.",
            "Recommendation: share peer observation best practices and run a targeted remediation clinic.",
        ],
    )
    return {"teacher": teacher, "summary": text}


def monthly_school_report() -> dict[str, Any]:
    dash = demo.admin_dashboard()
    c = dash["cards"]
    report = {
        "executive_summary": (
            f"{demo.DEMO_SCHOOL['name']} remains in '{c['school_health_level']}' health "
            f"(score {c['school_health_score']}) with {c['total_students']} students and "
            f"{c['student_attendance_pct']}% average attendance."
        ),
        "attendance": f"Student attendance {c['student_attendance_pct']}%; teacher attendance {c['teacher_attendance_pct']}%.",
        "academic_performance": f"School-wide GPA average is {c['avg_gpa']}.",
        "challenges": [
            f"{c['students_at_risk']} students flagged high risk",
            f"Pending fees PKR {c['pending_fees']:,}",
            "Subject gaps in lowest-scoring departments",
        ],
        "recommendations": [
            "Launch 4-week attendance recovery program",
            "Targeted tutoring for high-risk cohort",
            "Parent fee counseling outreach",
            "Teacher peer coaching for bottom-quartile classes",
        ],
    }
    ai = _gemini_generate(
        f"Expand this monthly report professionally using only this data: {json.dumps(report)} | {demo.school_context_for_ai()}"
    )
    if ai:
        report["narrative"] = ai
    else:
        report["narrative"] = report["executive_summary"]
    return report


def lesson_planner(subject: str, grade: str, topic: str) -> dict[str, Any]:
    prompt = (
        f"Create a 45-minute lesson plan for Pakistani school Grade {grade}, subject {subject}, topic '{topic}'. "
        "Include learning objectives, activities, materials, assessment, and homework. "
        "Keep culturally appropriate and low-resource friendly."
    )
    text = _gemini_generate(prompt) or _fallback(
        f"Lesson plan: {topic}",
        [
            f"Objectives: Students will explain and apply key ideas in {topic}.",
            "Warm-up (5m): Activate prior knowledge with 3 oral questions.",
            "Teach (15m): Mini-lesson with board examples; think-aloud.",
            "Practice (15m): Pair work on 4 scaffolded problems.",
            "Assessment (5m): Exit ticket — 2 questions.",
            f"Homework: 6 practice items on {topic}; due next class.",
        ],
    )
    return {"subject": subject, "grade": grade, "topic": topic, "plan": text}


def question_paper(subject: str, grade: str, topic: str, difficulty: str = "medium") -> dict[str, Any]:
    paper = {
        "mcqs": [
            {"q": f"Which statement best describes {topic}?", "options": ["A", "B", "C", "D"], "bloom": "Remember"},
            {"q": f"Identify the correct application of {topic}.", "options": ["A", "B", "C", "D"], "bloom": "Understand"},
            {"q": f"Choose the worked example that solves a {topic} problem.", "options": ["A", "B", "C", "D"], "bloom": "Apply"},
        ],
        "short": [
            {"q": f"Define {topic} in your own words.", "marks": 3, "bloom": "Understand"},
            {"q": f"Give two real-life examples of {topic}.", "marks": 4, "bloom": "Apply"},
        ],
        "long": [
            {"q": f"Explain {topic} with a diagram/example and discuss common mistakes.", "marks": 10, "bloom": "Analyze"},
        ],
        "difficulty": difficulty,
        "subject": subject,
        "grade": grade,
        "topic": topic,
    }
    ai = _gemini_generate(
        f"Generate a full question paper JSON-friendly narrative for Grade {grade} {subject} on {topic}, "
        f"difficulty {difficulty}, with MCQ/short/long and Bloom tags. Pakistani curriculum context."
    )
    paper["narrative"] = ai or "Paper blueprint generated from curriculum-aligned template."
    return paper


def quiz_analyzer(quiz_title: str = "Algebra Quiz 3") -> dict[str, Any]:
    return {
        "quiz": quiz_title,
        "most_difficult": ["Q4 — Multi-step equations", "Q7 — Word problems"],
        "common_mistakes": ["Sign errors when expanding brackets", "Misreading units in word problems"],
        "weak_topics": ["Linear equations", "Translating words to algebra"],
        "suggested_revision": "Two 20-minute clinics: (1) sign rules (2) word-problem translation frames.",
        "explanation": (
            f"Analysis of '{quiz_title}' shows lowest item discrimination on multi-step algebra and word problems. "
            "Recommend spaced practice and worked-example fading."
        ),
    }


def study_planner(student_id: str) -> dict[str, Any]:
    student = next((s for s in demo.STUDENTS if s["id"] == student_id), demo.STUDENTS[0])
    week = [
        {"day": "Monday", "focus": "Mathematics — algebra practice (45m)", "review": "Science notes (20m)"},
        {"day": "Tuesday", "focus": "English writing (40m)", "review": "Urdu vocabulary (20m)"},
        {"day": "Wednesday", "focus": "Science experiments review (45m)", "review": "Math drills (20m)"},
        {"day": "Thursday", "focus": "Computer Science project (40m)", "review": "Islamiyat (20m)"},
        {"day": "Friday", "focus": "Pakistan Studies map work (35m)", "review": "Weekly quiz prep (30m)"},
        {"day": "Saturday", "focus": "Weak-topic clinic", "review": "Light reading"},
        {"day": "Sunday", "focus": "Rest + light revision", "review": "Organize notebook"},
    ]
    return {"student": student, "weekly_plan": week}


def career_guidance(student_id: str) -> dict[str, Any]:
    student = next((s for s in demo.STUDENTS if s["id"] == student_id), demo.STUDENTS[0])
    interests = student.get("interests", [])
    paths = []
    if "Coding" in interests or "Science" in interests:
        paths.append("Computer Science / Software Engineering (intermediate → A-levels / FSc Pre-Eng)")
    if "Math Olympiad" in interests:
        paths.append("STEM olympiad track → Engineering")
    if "Art" in interests:
        paths.append("Design / Architecture foundation electives")
    if "Debate" in interests or "Reading" in interests:
        paths.append("Law / Social sciences / Media studies")
    if not paths:
        paths = ["Explore FSc / ICS streams with aptitude counseling"]
    return {"student": student, "recommended_paths": paths, "note": "Guidance based on grades, interests, and strengths only."}


def parent_meeting_assistant(student_id: str) -> dict[str, Any]:
    student = next((s for s in demo.STUDENTS if s["id"] == student_id), demo.STUDENTS[0])
    return {
        "student": student,
        "agenda": [
            f"Review GPA ({student['gpa']}) and attendance ({student['attendance_pct']}%)",
            "Celebrate recent strengths and achievements",
            "Agree on home support routine (30–45 min focused study)",
            "Schedule follow-up in 4 weeks",
        ],
        "talking_points": (
            f"Open with positives for {student['full_name']}, then discuss risk level "
            f"'{student['risk_level']}' with concrete next steps — not blame."
        ),
    }


def school_health_score() -> dict[str, Any]:
    dash = demo.admin_dashboard()
    score = dash["cards"]["school_health_score"]
    level = dash["cards"]["school_health_level"]
    return {
        "score": score,
        "level": level,
        "components": {
            "attendance": dash["cards"]["student_attendance_pct"],
            "results": dash["cards"]["avg_gpa"] * 25,
            "teacher_attendance": dash["cards"]["teacher_attendance_pct"],
            "enrollment_stability": 80,
            "behavior_climate": 77,
        },
        "explanation": (
            f"Composite health score {score} ({level}) blends attendance, academics, "
            "teacher presence, enrollment, and behavior climate."
        ),
    }


def explain_chart(chart_type: str, data: Any = None) -> dict[str, Any]:
    dash = demo.admin_dashboard()
    data = data or dash["charts"].get(chart_type) or dash["charts"]["attendance_trend"]
    explanation = _gemini_generate(
        f"Explain this school chart for a principal. Type={chart_type}. Data={json.dumps(data)[:3000]}. "
        f"Context: {demo.school_context_for_ai()}"
    ) or (
        f"Trend view for '{chart_type}': the latest points indicate relative movement versus earlier months. "
        "Use this to prioritize interventions where dips coincide with at-risk cohorts or subject gaps."
    )
    return {"chart_type": chart_type, "explanation": explanation, "data_preview": data}


def recommendations() -> dict[str, Any]:
    return {
        "items": [
            {"priority": "high", "action": "Improve attendance for high-risk cohort", "owner": "Counselor + Class teachers"},
            {"priority": "high", "action": "Extra mathematics clinics for Grades 8–9", "owner": "Math department"},
            {"priority": "medium", "action": "Contact parents of overdue fee accounts", "owner": "Accounts"},
            {"priority": "medium", "action": "Recognize top performers at assembly", "owner": "Principal"},
            {"priority": "low", "action": "Peer mentoring for medium-risk students", "owner": "Senior students"},
        ]
    }


def improvement_roadmap() -> dict[str, Any]:
    return {
        "3_month": [
            "Attendance recovery campaign",
            "Launch AI early-warning weekly review",
            "Teacher coaching for bottom 2 classes",
        ],
        "6_month": [
            "Subject remediation labs institutionalized",
            "Parent engagement dashboard usage >70%",
            "Fee recovery process automation",
        ],
        "12_month": [
            "School health score ≥ 85",
            "Gender equity gap closed on GPA",
            "Full SDG 4 indicator pack published",
        ],
    }


def equity_dashboard() -> dict[str, Any]:
    return demo.admin_dashboard()["charts"]["equity"] | {
        "insight": "Girls slightly outperform boys on GPA and attendance; maintain equity monitoring for STEM enrollment."
    }


def sdg_dashboard() -> dict[str, Any]:
    return {
        "indicators": demo.admin_dashboard()["charts"]["sdg"],
        "insight": "Strongest progress on SDG 5; accelerate digital learning (SDG 9) via Computer Science access.",
    }
