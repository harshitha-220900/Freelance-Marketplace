from datetime import datetime
from decimal import Decimal
from sqlalchemy import Integer, Text, Numeric, String, DateTime, func, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

class Bid(Base):
    """
    Represents a bid submitted by a freelancer for a specific job.
    """
    __tablename__ = "bids"

    # Primary key
    bid_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Foreign Keys with cascading deletes
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.job_id", ondelete="CASCADE"), nullable=False, index=True)
    freelancer_id: Mapped[int] = mapped_column(ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Bid details
    proposal_text: Mapped[str] = mapped_column(Text, nullable=False)
    # Using Decimal instead of float for accurate financial representation
    bid_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(20), server_default="pending", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # ORM Relationships (Uncomment and import models to enable)
    # job: Mapped["Job"] = relationship("Job", back_populates="bids")
    # freelancer: Mapped["User"] = relationship("User", back_populates="bids")

    __table_args__ = (
        UniqueConstraint("job_id", "freelancer_id", name="uix_job_freelancer"),
    )

    def __repr__(self) -> str:
        """Provides a helpful string representation for debugging."""
        return f"<Bid(id={self.bid_id}, job_id={self.job_id}, freelancer_id={self.freelancer_id}, amount=${self.bid_amount}, status='{self.status}')>"
