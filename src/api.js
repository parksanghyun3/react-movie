import axios from "axios";

const getDailyMovies = async (movie) => {
  const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&listCount=5&detail=Y&ServiceKey=H0Y3DF46B5RL45RJG08S&`;
  try {
    const response = await axios.get(`${url}`, {
      params: {
        title: movie.movieNm,
        releaseDts: movie.openDt, //개봉일을 기준으로해서 가장 가까운 영화를 뿌려줌
      }
    });
    const data = response.data;
    console.log(data);
    return {
      "title": movie.movieNm,
      "rank": movie.rank,
      "genre": data.Data[0].Result[0].genre,
      "nonPoster": data.Data[0].Result[0].kmdbUrl,
      "posters": data.Data[0].Result[0].posters,
    };
  } catch (error) {
    console.error(error);
  }
}