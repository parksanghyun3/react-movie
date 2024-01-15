import axios from "axios"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DailyMovie } from "./DailyMovie";
import { WeeklyMovie } from "./WeeklyMovie";
import { HorrorMovie } from "./genre/HorrorMovie"
import { DramaMovie } from "./genre/DramaMovie"
import { ComedyMovie } from "./genre/ComedyMovie"
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { history } from "./History";

export const KoreaMovie = () => {
  const navigate = useNavigate();
  // 뒤로가기 방지 & url 이동 방지
  useEffect(() => {
    if (!localStorage.getItem("ID")) {
      alert("잘못된 접근입니다.");
      navigate("/NotFound");
    }
    
    const listenBackEvent = () => {
      alert("잘못된 접근입니다.");
      navigate("/NotFound");
    };

    const unlistenHistoryEvent = history.listen(({ action }) => {
      if (action === "POP") {
        listenBackEvent();
      }
    });

    return unlistenHistoryEvent;
  }, []);

  return (
    <>
      <div className="main-wrap">
        <div className="category-wrap">
          <DailyMovie />
          <WeeklyMovie />
          <DramaMovie />
          <HorrorMovie />
          <ComedyMovie />
        </div>
      </div>
    </>
  )
}
