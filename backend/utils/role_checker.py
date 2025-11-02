from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session

def check_document_limit(user, db: Session):
    """Check if normal user has exceeded monthly document limit"""
    if user.role == "normal":
        # Reset counts if it's a new month
        today = datetime.utcnow()
        if (today - user.last_reset_date).days >= 30:
            user.document_count = 0
            user.query_count = 0
            user.last_reset_date = today
            db.commit()

        if user.document_count >= 5:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Monthly document limit (5) reached. Please upgrade to premium."
            )

def check_query_limit(user, db: Session):
    """Check if normal user has exceeded monthly query limit"""
    if user.role == "normal":
        if user.query_count >= 50:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Monthly query limit (50) reached. Please upgrade to premium."
            )

def increment_document_count(user, db: Session):
    if user.role == "normal":
        user.document_count += 1
        db.commit()

def increment_query_count(user, db: Session):
    if user.role == "normal":
        user.query_count += 1
        db.commit()