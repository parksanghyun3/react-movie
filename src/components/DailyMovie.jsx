import axios from "axios"
import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { ModalDetail } from "./ModalDetail";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'


export const DailyMovie = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [indexStorage, setIndexStorage] = useState();
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
      const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&listCount=10&detail=Y&ServiceKey=H0Y3DF46B5RL45RJG08S&`;
      // 2. getDailyMovies 함수를 만들어 2번째 KMDB api를 통해 데이터를 받아온다.
      // 이때, KMDB api는 url에 영화 이름을 통해, 데이터를 전달하는 api 정보가 있음
      const movieNm = movie.movieNm.replace("!", ""); // api url 특수문자 ! 들어간 영화 걸러내기
      console.log(movieNm)
      try {
        const response = await axios.get(`${url}`, {
          params: {
            query: movieNm, // 3. KMDB의 영화 이름을 파라미터에 담으면 리턴으로 원하는 데이터들을 추출 가능
            releaseDts: movie.openDt, //개봉일을 기준으로해서 가장 가까운 영화를 뿌려줌
          }
        });
        const data = response.data;
        console.log(data)
        const totalCount = data.TotalCount; // 정보중에 totalCount를 가지고 있지 않은 영화제외로직
        if(totalCount !== 0 && totalCount !== undefined) {
          return {
            // 4. 3번에서 추출한 데이터들
            "title": movie.movieNm,
            "rank": movie.rank,
            "genre": data.Data[0].Result[0].genre,
            "posters": data.Data[0].Result[0].posters,
            "kmdbUrl": data.Data[0].Result[0].kmdbUrl, // KMDB 링크
            "intro": data.Data[0].Result[0].plots.plot[0].plotText,
            "stlls": data.Data[0].Result[0].stlls.split("|"),
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
    const getDailyBoxOffice = async () => {
      // 1. 영화진흥원 api 를 통해 data정보를 얻어온다
      const dailyBoxOffice = "http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=c3e73924e34ed2bdac6c9ceef965dd97";
      try {
        const response = await axios.get(`${dailyBoxOffice}&targetDt=${targetDT}`);
        const data = response.data.boxOfficeResult.dailyBoxOfficeList;
        console.log(data);
        const getMoviesData = data.map((movie) => getDailyMovies(movie)); 
        // 5. Promise.all을 통해 얻어온 데이터들을 병렬적으로 안해주면 오류발생(이유아직 파악 x);
        const boxOffice = await Promise.all(getMoviesData);
        console.log(boxOffice);
        const removeBoxOffice = boxOffice.filter(data => data !== undefined && data);
        setDayMovies(removeBoxOffice);
      } catch (error) {
        console.error("오류가 발생했습니다:", error);
      }
    }
    getDailyBoxOffice();
  }, [targetDT]);

  return (
    <section className="section">
      <div className="inner">
        <div className="section-tit">일간 박스오피스</div>
        <div className="box-list-wrap">
          <Swiper slidesPerView={5} slidesPerGroup={5} spaceBetween={10}>
            {dayMovies && dayMovies.map((item, index) => (
              <SwiperSlide className="box-list" key={item.rank}>
                <button className="box-office" type="button" onClick={() => modalStatus(index)}>
                  <img src={item.posters.split("|", 1)} alt="" />
                </button>
                <h3 className="movie-title" onClick={() => modalStatus(index)}>{item.title}</h3>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <ModalDetail indexStorage={indexStorage} dataItem={dayMovies} isOpen={isOpen} modalStatus={modalStatus}></ModalDetail>
      </div>
    </section>
  )
}