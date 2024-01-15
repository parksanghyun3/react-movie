import axios from "axios"
import React, { useRef, useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { ModalDetail } from "../ModalDetail";

export const DramaMovie = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [indexStorage, setIndexStorage] = useState();
  const [dataLength, setDataLength] = useState();
  const [dayMovies, setDayMovies] = useState([]);
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = (date.getDate() - 1);
  const targetDT = year + month.toString().padStart(2, 0) + day.toString().padStart(2, 0);
  const modalStatus = (index) => {
    setIndexStorage(index);
    isOpen ? setIsOpen(false) : setIsOpen(true);
  }

  useEffect(() => {
    const getDailyMovies = async (movie) => {
      const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&listCount=5&detail=Y&ServiceKey=H0Y3DF46B5RL45RJG08S&`;
      const movieNm = movie.movieNm.replace('!', ''); // api url 특수문자 ! 들어간 영화 걸러내기
      try {
        const response = await axios.get(`${url}`, {
          params: {
            query: movieNm,
            releaseDts: movie.openDt, //개봉일을 기준으로해서 가장 가까운 영화를 뿌려줌
          }
        });
        const data = response.data;
        const IsDramaGenre = data?.Data?.[0].Result?.[0].genre.includes("드라마");
        if (IsDramaGenre) {
          return {
            "title": movie.movieNm,
            "rank": movie.rank,
            "genre": data?.Data?.[0].Result?.[0].genre,
            "posters": data?.Data?.[0].Result?.[0].posters,
            "kmdbUrl": data?.Data?.[0].Result?.[0].kmdbUrl, // KMDB 링크
            "intro": data?.Data?.[0].Result?.[0].plots.plot[0].plotText,
            "stlls": data?.Data?.[0].Result?.[0].stlls.split("|"),
          };
        } else {
          return undefined;
        }
      } catch (error) {
        console.error(error);
      }
    }
    const getDailyBoxOffice = async () => {
      const dailyBoxOffice = "http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=c3e73924e34ed2bdac6c9ceef965dd97";
      try {
        const response = await axios.get(`${dailyBoxOffice}&targetDt=${targetDT}`);
        const data = response.data.boxOfficeResult.dailyBoxOfficeList;
        const getMoviesData = data.map((movie) => getDailyMovies(movie));
        const boxOffice = await Promise.all(getMoviesData);
        const removeBoxOffice = boxOffice.filter(data => data !== undefined && data);
        setDayMovies(removeBoxOffice);
      } catch (error) {
        console.error("오류가 발생했습니다:", error);
      }
    }
    getDailyBoxOffice();
  }, []);

  return (
    <>
      {
        dayMovies.length == 0
          ?
          null
          :
          <section className="section">
            <div className="inner">
              <div className="section-tit">드라마</div>
              <div className="box-list-wrap">
                <Swiper slidesPerView={5} slidesPerGroup={5} spaceBetween={10}>
                  {dayMovies && dayMovies.map((item, index) => (
                    <SwiperSlide className="box-list" key={item.rank}>
                      <button className="box-office" type="button" onClick={() => modalStatus(index)}>
                        <img src={item.posters.split("|", 1)} alt="" /> :
                      </button>
                      <h3 className="movie-title" onClick={() => modalStatus(index)}>{item.title}</h3>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <ModalDetail indexStorage={indexStorage} dataItem={dayMovies} isOpen={isOpen} modalStatus={modalStatus}></ModalDetail>
            </div>
          </section>
      }

    </>
  )
}