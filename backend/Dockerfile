# 가볍고 효율적인 Python slim 이미지를 베이스로 사용합니다.
FROM python:3.11-slim

# 컨테이너 내 작업 디렉토리를 설정합니다.
WORKDIR /app

# 환경 변수 설정: Python이 .pyc 파일을 생성하지 않고 버퍼링 없이 출력하도록 합니다.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# 의존성 파일을 먼저 복사하여 캐시를 활용합니다.
COPY requirements.txt .

# 필요한 패키지를 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드를 복사합니다.
COPY . .

# Yandex Serverless Containers는 PORT 환경 변수를 사용하며, 8080 포트를 명시합니다.
EXPOSE 8080

# uvicorn을 사용하여 FastAPI 앱을 실행합니다. 
# 0.0.0.0 인터페이스에서 8080 포트로 바인딩합니다.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
