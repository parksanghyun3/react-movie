import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
// import bgImg from "../images/img-login-wall.jpg"
// import { Background } from "../Loading/Styles";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const focusId = useRef();
  const focusPs = useRef();
  const [idData, setIdData] = useState("");
  const [psData, setPsData] = useState("");
  localStorage.removeItem("ID");
  const goToMain = () => {
    if (idData.includes('@') && idData.length >= 5 && psData.length >= 5) {
      // 형식에 맞게 로그인 성공시 
      localStorage.removeItem("ID");
      localStorage.setItem("ID", idData);
      // navigate("/KoreaMovie");
      if(localStorage.getItem("ID") == idData && localStorage.length > 0) {
        navigate("/KoreaMovie");
        setIsLogin(true);
        // console.log(localStorage.getItem("ID"), idData, localStorage.getItem("ID") == idData, localStorage.length);
      } else {
        navigate("/NotFound");
        setIsLogin(false);
        // console.log(localStorage.getItem("ID"), idData, localStorage.getItem("ID") == idData);
      }
    } else if ((!idData.includes('@') || idData.length <= 4) && psData.length <= 4) {
      // 형식이 다 틀렸을 시 
      alert("둘다 잘못되었습니다.");
      setIdData("");
      setPsData("");
      focusId.current.focus();
    } else if (psData.length <= 4) {
      // 패스워드가 잘못 되었을 시 
      alert("패스워드가 잘못되었습니다.");
      setPsData("");
      focusPs.current.focus();
    } else if (!idData.includes('@') || idData.length <= 4) {
      // 이메일이 잘못 되었을 시 
      alert("이메일이 잘못되었습니다.");
      setIdData("");
      focusId.current.focus();
    }
  }

  const setId = (e) => {
    setIdData(e.target.value);
    // console.log(idData);
  }

  const setPs = (e) => {
    setPsData(e.target.value);
    // console.log(psData);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      goToMain();
    }
  }

  return (
    <>
      <div className="login-section">
        <div className="login-con">
          <div className="login-title">
            로그인
          </div>
          <div className="login-wrap">
            <label>
              <div className="desc-txt">아이디</div>
              <input id="login-id" type="text" value={idData} onChange={setId} ref={focusId} />
            </label>
            <label>
              <div className="desc-txt">비밀번호</div>
              <input id="login-ps" type="password" value={psData} onChange={setPs} ref={focusPs} onKeyDown={handleKeyPress} />
            </label>
          </div>
          <div className="btn-wrap">
            <button
              onClick={goToMain}
              disabled={idData === "" || psData === "" ? true : false}
              className={idData === "" || psData === "" ? "" : "active"}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </>
  )
}