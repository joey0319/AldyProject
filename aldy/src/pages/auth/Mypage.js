import "./Mypage.css";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getUserInfo, mypageCode, tierRenewApi } from "../../api/user";
import { getMyStudy } from "../../api/study";
import { recommendation } from "../../api/user";
import MyStudyListItem from "../../components/study/MyStudyListItem";
import Paging from "../../components/Paging";
import AlertRefreshModal from "../../components/AlertRefreshModal";
import Lottie from "lottie-react";
import reload from "../../lotties/reload.json";
import { useRecoilState } from "recoil";
import { isNav } from "../../store/states";

const WhiteButton = styled.button`
  width: 110px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid rgb(40, 80, 15);
  outline: none;
  color: rgb(40, 80, 15);
  font-weight: bold;
  transition: transform 30ms ease-in;
  margin: 4px;
  &:hover {
    background-color: rgb(40, 80, 15);
    color: white;
    transition: all 200ms ease-in;
  }
`;

const WhiteButtonL = styled.button`
  width: 203px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid rgb(40, 80, 15);
  outline: none;
  color: rgb(40, 80, 15);
  font-weight: bold;
  transition: transform 30ms ease-in;
  font-size: 20px;
  margin: 10px;
  padding-top: 5px;
  &:hover {
    background-color: rgb(40, 80, 15);
    color: white;
    transition: all 200ms ease-in;
  }
`;

const Mypage = () => {
  const [nav, setNav] = useRecoilState(isNav);
  setNav(true);

  const [baekjoonId, setBaekjoonId] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [email, setEmail] = useState(null);
  const [tier, setTier] = useState(null);
  const [answerCodeReviewNumber, setAnswerCodeReviewNumber] = useState(null);
  const [replyCodeReviewNumber, setReplyCodeReviewNumber] = useState(null);
  const [acceptedUserCount, setAcceptedUserCount] = useState(null);
  const [algorithm, setAlgorithm] = useState(null);
  const [averageTries, setAverageTries] = useState(null);
  const [level, setLevel] = useState(null);
  const [problemId, setProblemId] = useState(null);
  const [titleKo, setTitleKo] = useState(null);
  const [myStudyList, setMyStudyList] = useState(null);
  // Pagination
  const [myStudyPageNum, setMyStudyPageNum] = useState(1);
  const [myStudyTotal, setMyStudyTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [alertRefreshModalShow, setAlertRefreshModalShow] = useState(false);

  useEffect(() => {
    getUserInfo()
      .then((res) => {
        console.log(res.data);
        setBaekjoonId(res.data.baekjoonId);
        setNickname(res.data.nickname);
        setEmail(res.data.email);
        setTier(res.data.tier);
        console.log(baekjoonId);
      })
      .catch((err) => {
        console.log(err);
      });
    mypageCode().then((res) => {
      console.log(res.data);
      setAnswerCodeReviewNumber(res.data.answerCodeReviewNumber);
      setReplyCodeReviewNumber(res.data.replyCodeReviewNumber);
    });
    recommendation().then((res) => {
      console.log(res.data);
      setAcceptedUserCount(res.data.acceptedUserCount);
      setAlgorithm(res.data.algorithm);
      setAverageTries(res.data.averageTries);
      setLevel(res.data.level);
      setProblemId(res.data.problemId);
      setTitleKo(res.data.titleKo);
      console.log("???????????? ??? ????????? ??????");
    });
  }, []);

  useEffect(() => {
    getMyStudy(myStudyPageNum)
      .then((res) => {
        const data = res.data.myStudyDtoPage;
        console.log(data);
        setMyStudyList(data.content);
        setMyStudyTotal(data.totalElements);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [myStudyPageNum]);

  const navigate = useNavigate();

  const navigateUserinfo = () => {
    navigate("/userinfo");
  };
  const navigateChangePw = () => {
    navigate("/changepw");
  };

  const mvBoj = () => {
    window.open(`https://www.acmicpc.net/problem/${problemId}`, "_blank");
  };

  const onRenew = () => {
    console.log("?????? ??????");
    tierRenewApi()
      .then((res) => {
        sessionStorage.setItem("tier", res.data.tier);
        console.log(res.data);
        // alert("????????? ?????????????????????.");
        // window.location.reload(); //????????????
        setMessage("????????? ?????????????????????.");
        setAlertRefreshModalShow(true); //????????????
      })
      .catch((err) => {
        console.log(err);
        // alert("????????? ?????????????????????. ?????? ??????????????????.");
        // window.location.reload(); //????????????
        setMessage("????????? ?????????????????????. ?????? ??????????????????.");
        setAlertRefreshModalShow(true); //????????????
      });
  };

  const newRecommend = () => {
    recommendation().then((res) => {
      setAcceptedUserCount(res.data.acceptedUserCount);
      setAlgorithm(res.data.algorithm);
      setAverageTries(res.data.averageTries);
      setLevel(res.data.level);
      setProblemId(res.data.problemId);
      setTitleKo(res.data.titleKo);
      console.log("????????? ?????? ?????? ??? ????????? ??????");
    });
  };

  return (
    <main style={{ userSelect: "none" }}>
      <AlertRefreshModal
        show={alertRefreshModalShow}
        onHide={() => setAlertRefreshModalShow(false)}
        message={message}
      />
      <section className="myPage-list-banner">
        <img
          className="mb-2"
          src="/pinkAldy.gif"
          alt="?????? ?????????"
          style={{ width: "350px" }}
        ></img>
        <p>
          <span>????????? ???????????? ?????? </span>
          <span className="study-highlight-green"> ????????? </span>
          <span>??????????????? </span>
        </p>
        <h2 className="Mypage-underline-orange">
          <span>????????????</span>
        </h2>
        <div className="Mypage-section1-userinfo">
          <div className="Mypage-tier-nickname">
            <img
              src={`https://d2gd6pc034wcta.cloudfront.net/tier/${tier}.svg`}
              alt="?????? ?????????"
              className="Mypage-tier-img"
            />
            <h2 className="Mypage-section1-userInfo-h2">
              <b>{nickname}</b>??? ???????????????
            </h2>
          </div>
          <div>
            <WhiteButton onClick={navigateUserinfo} className="study-button">
              ???????????? ??????
            </WhiteButton>
            <WhiteButton onClick={navigateChangePw} className="study-button">
              ???????????? ??????
            </WhiteButton>
            <WhiteButton onClick={onRenew} className="study-button">
              ?????? ??????
            </WhiteButton>
          </div>
        </div>
        <div>
          <div className="study-list-item">
            <div className="study-list-title">
              <div className="study-id"></div>
              <h5 className="study-name">?????? ????????? ?????? ???</h5>
              <div className="study-number">{answerCodeReviewNumber}???</div>
            </div>
          </div>
        </div>
        <div>
          <div className="study-list-item">
            <div className="study-list-title">
              <div className="study-id"></div>
              <h5 className="study-name">?????? ????????? ?????? ?????? ???</h5>
              <div className="study-number">{replyCodeReviewNumber}???</div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ margin: "30px" }}>
        <img
          className="Mypage-icon"
          src={process.env.PUBLIC_URL + "/mypageRecommend.png"}
          alt=""
        ></img>
        <h2 className="Mypage-underline-orange">
          <span>????????? ?????? ??????</span>
        </h2>
        <p>
          <span>??? ?????? ??? ????????? ???????????? </span>
          <span className="study-highlight-orange">?????? ??????</span>
          <span>??? ???????????????.???</span>
        </p>
      </section>
      <section className="study-list">
        <div className="Mypage-recommend-box">
          <div className="Mypage-recommend-box-title">
            <img
              src={`https://d2gd6pc034wcta.cloudfront.net/tier/${level}.svg`}
              alt="?????? ?????????"
              className="Mypage-tier-img"
            />
            <div className="Mypage-recommend-box-title-titleKo">{titleKo}</div>
          </div>
          <div className="Mypage-recommend-box-content">
            <div className="Mypage-recommend-box-content-text">
              <div>????????????????????? ?????? : {acceptedUserCount}???</div>
              <div>???????????????? ?????? : {algorithm}</div>
              <div>?????????? ?????? : {averageTries}???</div>
              {/* <div>?????? : {level}</div> */}
              {/* <div>?????? ?????? : {problemId}???</div> */}
            </div>
          </div>
        </div>
        <div className="mypage-reload-Btn">
          <WhiteButtonL
            onClick={newRecommend}
            style={{ display: "flex", paddingLeft: "12px" }}
          >
            ????????? ?????? ??????
            <Lottie
              animationData={reload}
              onClick={newRecommend}
              style={{ width: "30px", cursor: "pointer" }}
            ></Lottie>
          </WhiteButtonL>
          <WhiteButtonL onClick={mvBoj}>?????? ?????? ??????!</WhiteButtonL>
        </div>
      </section>
      <section className="study-search">
        <img
          className="Mypage-icon"
          src={process.env.PUBLIC_URL + "/mypageStudyList.png"}
          alt=""
        ></img>
        <h2 className="Mypage-underline-orange">
          <span>?????? ????????? ????????? ??????</span>
        </h2>
        <p>
          <span>??????????????? ????????? ????????? ?????? </span>
          <span className="study-highlight-orange">????????????</span>
          <span>??? ????????????.???</span>
        </p>
      </section>
      <section className="study-list">
        <div>
          {/* <StudyListMy /> */}
          <div className="Mypage-study-list-box">
            <div className="mystudy-search-result-title">??? ????????? ??????</div>
            {myStudyList?.map((item, i) => (
              <MyStudyListItem key={i} item={item} num={i} />
            ))}
            <Paging
              page={myStudyPageNum}
              setPage={setMyStudyPageNum}
              totalElements={myStudyTotal}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Mypage;
