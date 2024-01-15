import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';

export const ModalDetail = ({ indexStorage, dataItem, isOpen, modalStatus }) => {
  return (
    <div className={`modal-con ${isOpen ? "modalOpen" : ""}`}>
      <div className="modal-wrap">
        <div className="modal-content">
          <div className="modal-header">
            <div className="close-btn">
              <button type="button" onClick={modalStatus}>닫기</button>
            </div>
          </div>
          {dataItem && dataItem[indexStorage] && (
            <div className="modal-body">
              <div className="movie-info">
                <div className="img-wrap">
                  <img src={dataItem[indexStorage].posters.split("|", 1)} alt="" />
                </div>
                <div className="txt-wrap">
                  <h3 className="modal-title">{dataItem[indexStorage].title}</h3>
                  <p className="modal-txt">순위: {dataItem[indexStorage].rank}</p>
                  <p className="modal-txt">장르: {dataItem[indexStorage].genre}</p>
                  <a className="modal-txt" href={dataItem[indexStorage].kmdbUrl} target="_blank">
                    Detail: {dataItem[indexStorage].kmdbUrl}
                  </a>
                  <p className="modal-txt">{dataItem[indexStorage].intro}</p>
                </div>
              </div>
              <div className="stlls-wrap">
                <Swiper slidesPerView={3} slidesPerGroup={3} spaceBetween={10}>
                  {dataItem[indexStorage].stlls.map(item=> (
                    <SwiperSlide className="stlls" key={item}>
                      <img src={item} alt="" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}