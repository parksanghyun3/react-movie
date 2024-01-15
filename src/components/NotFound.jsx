import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react"

export const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("ID");
  }, [])

  return (
    <div className="not-found">
      잘못된 접근입니다.
    </div>
  )
}