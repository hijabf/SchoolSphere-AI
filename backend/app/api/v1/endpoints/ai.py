from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.api.deps import AnyAuthUser, AdminUser, TeacherUser
from app.services.ai import gemini as ai

router = APIRouter()


class CopilotRequest(BaseModel):
    question: str = Field(min_length=3, max_length=500)


class LessonRequest(BaseModel):
    subject: str
    grade: str
    topic: str


class PaperRequest(BaseModel):
    subject: str
    grade: str
    topic: str
    difficulty: str = "medium"


class ChartExplainRequest(BaseModel):
    chart_type: str
    data: dict | list | None = None


@router.post("/report-card-comment")
async def report_card_comment(_: TeacherUser, student_id: str = "stu-0001"):
    return ai.report_card_comment(student_id)


@router.get("/parent-summary")
async def parent_summary(_: AnyAuthUser, student_id: str = "stu-0001"):
    return ai.parent_progress_summary(student_id)


@router.get("/performance-analyzer")
async def performance_analyzer(_: AnyAuthUser, student_id: str = "stu-0001"):
    return ai.student_performance_analyzer(student_id)


@router.get("/early-warning")
async def early_warning(_: AdminUser):
    return ai.early_warning()


@router.get("/dropout-risk")
async def dropout_risk(_: AdminUser):
    return ai.dropout_risk()


@router.post("/copilot")
async def copilot(_: AdminUser, body: CopilotRequest):
    return ai.principal_copilot(body.question)


@router.get("/teacher-summary")
async def teacher_summary(_: AdminUser, teacher_id: str = "tch-0001"):
    return ai.teacher_performance_summary(teacher_id)


@router.get("/monthly-report")
async def monthly_report(_: AdminUser):
    return ai.monthly_school_report()


@router.post("/lesson-planner")
async def lesson_planner(_: TeacherUser, body: LessonRequest):
    return ai.lesson_planner(body.subject, body.grade, body.topic)


@router.post("/question-paper")
async def question_paper(_: TeacherUser, body: PaperRequest):
    return ai.question_paper(body.subject, body.grade, body.topic, body.difficulty)


@router.get("/quiz-analyzer")
async def quiz_analyzer(_: TeacherUser, quiz_title: str = "Algebra Quiz 3"):
    return ai.quiz_analyzer(quiz_title)


@router.get("/study-planner")
async def study_planner(_: AnyAuthUser, student_id: str = "stu-0001"):
    return ai.study_planner(student_id)


@router.get("/career-guidance")
async def career_guidance(_: AnyAuthUser, student_id: str = "stu-0001"):
    return ai.career_guidance(student_id)


@router.get("/ptm-assistant")
async def ptm_assistant(_: TeacherUser, student_id: str = "stu-0001"):
    return ai.parent_meeting_assistant(student_id)


@router.get("/health-score")
async def health_score(_: AdminUser):
    return ai.school_health_score()


@router.post("/explain-chart")
async def explain_chart(_: AnyAuthUser, body: ChartExplainRequest):
    return ai.explain_chart(body.chart_type, body.data)


@router.get("/recommendations")
async def recommendations(_: AdminUser):
    return ai.recommendations()


@router.get("/roadmap")
async def roadmap(_: AdminUser):
    return ai.improvement_roadmap()


@router.get("/equity")
async def equity(_: AdminUser):
    return ai.equity_dashboard()


@router.get("/sdg")
async def sdg(_: AdminUser):
    return ai.sdg_dashboard()
