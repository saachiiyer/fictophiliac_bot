import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from app.core.config import settings
from app.core.logging import logger
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 60)
    logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.VERSION} starting up")
    logger.info(f"📡 API Documentation available at: http://{settings.HOST}:{settings.PORT}/api/v1/docs")
    logger.info(f"🌐 React Web App available at:     http://localhost:{settings.PORT}")
    logger.info("=" * 60)
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        lifespan=lifespan
    )

    # CORS configuration
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API v1 router
    application.include_router(api_router, prefix=settings.API_V1_STR)

    # Resolve frontend directories
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    frontend_dist = os.path.join(base_dir, "frontend/dist")
    frontend_public = os.path.join(base_dir, "frontend/public")

    if os.path.exists(frontend_dist) and os.path.isfile(os.path.join(frontend_dist, "index.html")):
        application.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
        logger.info(f"Mounted production React build from: {frontend_dist}")
    elif os.path.exists(frontend_public) and os.path.isfile(os.path.join(frontend_public, "index.html")):
        application.mount("/", StaticFiles(directory=frontend_public, html=True), name="frontend")
        logger.info(f"Mounted React frontend and static assets from: {frontend_public}")
    else:
        @application.get("/", include_in_schema=False)
        def root_info():
            return JSONResponse({
                "app": settings.PROJECT_NAME,
                "version": settings.VERSION,
                "docs": f"/api/v1/docs",
                "health": f"/api/v1/health"
            })

    return application

app = create_application()

