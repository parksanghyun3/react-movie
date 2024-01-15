import axios from "axios"
import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { ModalDetail } from "./ModalDetail";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'


export const WeeklyMovie = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [indexStorage, setIndexStorage] = useState();
  const [weekMovies, setWeekMovies] = useState([]);
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = (date.getDate() - 7);
  const targetDT = year + month.toString().padStart(2, 0) + day.toString().padStart(2, 0)
  const modalStatus = (index) => {
    setIndexStorage(index);
    isOpen ? setIsOpen(false) : setIsOpen(true);
  }


  useEffect(() => {
    const getWeeklyMovies = async (weekMovie) => {
      const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&listCount=5&detail=Y&ServiceKey=H0Y3DF46B5RL45RJG08S&`;
      const movieNm = weekMovie.movieNm.replace('!', ''); // api url 특수문자 ! 들어간 영화 걸러내기
      try {
        const response = await axios.get(`${url}`, {
          params: {
            query: movieNm,
            releaseDts: weekMovie.openDt, //개봉일을 기준으로해서 가장 가까운 영화를 뿌려줌
          }
        });
        const data = response.data;
        if(data?.Data?.[0].Result) {
          return {
            "title": weekMovie.movieNm,
            "rank": weekMovie.rank,
            "genre": data?.Data?.[0].Result?.[0].genre,
            "posters": data?.Data?.[0].Result?.[0].posters,
            "kmdbUrl": data?.Data?.[0].Result?.[0].kmdbUrl, // KMDB 링크
            "intro": data?.Data?.[0].Result?.[0].plots.plot[0].plotText,
            "stlls": data?.Data?.[0].Result?.[0].stlls.split("|"),
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
    const getWeeklyBoxOffice = async () => {
      const weeklyBoxOffice = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json?key=c3e73924e34ed2bdac6c9ceef965dd97"
      try {
        const response = await axios.get(`${weeklyBoxOffice}&targetDt=${targetDT}`);
        const data2 = response.data.boxOfficeResult.weeklyBoxOfficeList;
        const getMoviesData2 = data2.map((weekMovie) => getWeeklyMovies(weekMovie));
        const boxOffice2 = await Promise.all(getMoviesData2);
        const removeBoxOffice2 = boxOffice2.filter(data => data !== undefined);
        setWeekMovies(removeBoxOffice2);

      } catch (error) {
        console.error("오류가 발생했습니다:", error);
      }
    }
    getWeeklyBoxOffice();
  }, [])
  return (
    <section className="section">
      <div className="inner">
        <div className="section-tit">주간 박스오피스</div>
        <div className="box-list-wrap">
          <Swiper slidesPerView={5} slidesPerGroup={5} spaceBetween={10}>
            {weekMovies && weekMovies.map((item, index) => (
              <SwiperSlide className="box-list" key={item.rank}>
                <button className="box-office" type="button" onClick={() => modalStatus(index)}>
                  <img src={item?.posters?.split("|", 1)} alt="" />
                </button>
                <h3 className="movie-title" onClick={() => modalStatus(index)}>{item.title}</h3>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <ModalDetail indexStorage={indexStorage} dataItem={weekMovies} isOpen={isOpen} modalStatus={modalStatus}></ModalDetail>
      </div>
    </section>
  )
}
