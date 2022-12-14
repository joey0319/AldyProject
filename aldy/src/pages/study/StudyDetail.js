import "./StudyDetail.css";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStudyDetail,
  getProblem,
  studyWithdrawal,
  getSelectedDay,
} from "../../api/study";
import TierData from "../../data/tier";
import ActivationLevel from "../../data/ActivationLevel";
import "./Calendar.css";
import StudyJoinModal from "../../components/study/StudyJoinModal.js";
import ProblemModal from "../../components/study/ProblemModal";
import StudyMember from "../../components/study/StudyMember";
import moment from "moment";
import StudyChart from "../../components/study/StudyChart";
import StudyChartTier from "../../components/study/StudyChartTier";
import AlertModal from "../../components/AlertModal";
import { FcLock } from "react-icons/fc";
import { useRecoilState } from "recoil";
import { isNav } from "../../store/states";

const RedButton = styled.button`
  width: 90px;
  border-radius: 8px;
  background-color: red;
  border: 2px solid red;
  outline: none;
  color: white;
  font-weight: bold;
  padding: 4px 0px 2px 0px;
  font-size: 12px;
  transition: all 200ms ease-in;
  user-select: none;
  &:hover {
    background-color: white;
    color: red;
    transition: all 200ms ease-in;
    border: 2px solid red;
  }
`;

const WhiteButton = styled.button`
  width: 110px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid red;
  outline: none;
  color: red;
  font-weight: bold;
  font-size: 14px;
  padding: 4px 0px 2px 0px;
  transition: all 200ms ease-in;
  user-select: none;
  &:hover {
    background-color: red;
    color: white;
    transition: all 200ms ease-in;
  }
`;

const StudyDetail = () => {
  const [nav, setNav] = useRecoilState(isNav);
  setNav(true);

  const params = useParams();
  const id = params.id || "";
  const myId = sessionStorage.getItem("userName");
  const navigate = useNavigate();
  const navigateStudyManage = () => {
    navigate(`/study/manage/${id}`, { state: { studyDetail: studyDetail } });
  };
  const navigateReviewList = () => {
    navigate(`/review/list`);
  };
  const navigateStudy = () => {
    navigate("/study/list");
  };

  const [studyDetail, setStudyDetail] = useState({
    id: id,
    createdDate: "",
    name: "",
    upperLimit: 6,
    introduction: "",
    threshold: 0,
    visibility: 1,
    countMember: 0,
    leaderBaekjoonId: "",
    leaderEmail: "",
    statsByTier: {},
    statsByTag: {},
    isMember: false,
    isKick: false,
    level: 0,
    activationLevel: 0,
  });
  const keys = Object.keys(studyDetail.statsByTag);
  console.log(studyDetail);

  // ?????? ??????
  const [date, setDate] = useState(new Date());
  const [mark, setMark] = useState([]);
  // ?????????
  const [studyJoinModalShow, setStudyJoiModalShow] = useState(false);
  const handleStudyJoinModalShow = (e) => {
    if (studyDetail.threshold > sessionStorage.getItem("tier")) {
      setMessage(
        `${sessionStorage.getItem(
          "nickname"
        )}?????? ????????? ??????????????? ???????????? ????????????.`
      );
      setAlertModalShow(true);
    } else {
      setStudyJoiModalShow((prev) => !prev);
    }
  };
  const [problemModalShow, setProblemJoiModalShow] = useState(false);
  const handleProblemModalShow = (e) => {
    setProblemJoiModalShow((prev) => !prev);
  };
  const [memberModalShow, setMemberModalShow] = useState(false);
  const handleMemberModalShow = (e) => {
    setMemberModalShow((prev) => !prev);
  };
  // ??????
  const [message, setMessage] = useState("");
  const [alertModalShow, setAlertModalShow] = useState(false);

  // ????????? ??????
  const studyOut = () => {
    studyWithdrawal(Number(id))
      .then((res) => {
        setMessage(`${studyDetail.name}?????? ?????????????????????.`);
        setAlertModalShow(true);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ?????? ????????????
  const [problemList, setProblemList] = useState([]);
  useEffect(() => {
    handleProblemModalShow();
    console.log(date, "????????????");
    getProblem(id, date.getFullYear(), date.getMonth() + 1, date.getDate())
      .then((res) => {
        // console.log(res.data);
        setProblemList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, date]);

  useEffect(() => {
    getStudyDetail(id)
      .then((res) => {
        setStudyDetail(res.data);
        // setSendLeaderId(res.data.leaderBaekjoonId);
        sessionStorage.setItem("sendLeaderId", res.data.leaderBaekjoonId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    getSelectedDay(id, date.getFullYear(), date.getMonth() + 1)
      .then((res) => {
        console.log(res.data.dayss);
        setMark(res.data.days);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [date]);

  console.log(studyDetail.statsByTag, "???");

  return (
    <main style={{ userSelect: "none" }}>
      <AlertModal
        show={alertModalShow}
        onHide={() => {
          setAlertModalShow(false);
          navigateStudy();
        }}
        message={message}
      />
      <Modal size="lg" show={memberModalShow} onHide={handleMemberModalShow}>
        <Modal.Body className="review-modal-body">
          <div className="review-modal-header">
            <div>
              <div
                className="study-underline-orange"
                style={{
                  lineHeight: "35px",
                  fontSize: "25px",
                  marginBottom: "10px",
                }}
              >
                <span>???{studyDetail.name}???</span>
              </div>
            </div>
            <div>
              <button
                className="review-modal-close-btn"
                onClick={handleMemberModalShow}
              >
                X
              </button>
            </div>
          </div>
          <StudyMember id={id} />
        </Modal.Body>
      </Modal>
      <StudyJoinModal
        studyDetail={studyDetail}
        modal={studyJoinModalShow}
        handleModal={handleStudyJoinModalShow}
      />
      <ProblemModal
        studyDetail={studyDetail}
        date={date}
        modal={problemModalShow}
        handleModal={handleProblemModalShow}
        problemList={problemList}
        setProblemList={setProblemList}
      />
      <section className="study-detail-top">
        <div className="top">
          {studyDetail.countMember < studyDetail.upperLimit &&
            !studyDetail.isMember && (
              <WhiteButton onClick={handleStudyJoinModalShow}>
                ????????? ??????
              </WhiteButton>
            )}
          {myId === studyDetail.leaderBaekjoonId && (
            <WhiteButton onClick={navigateStudyManage}>????????? ??????</WhiteButton>
          )}
        </div>
        <div className="study-detail-description">
          ?????? ????????? ?????? ????????? ???????????????~
        </div>
        <div className="study-title">{studyDetail.name}</div>
        <div className="study-detail-banner">
          <div
            className="study-description-detail"
            onClick={() => {
              setDate(new Date());
            }}
          >
            <img src="/pencil.png" alt="?????? ?????????"></img>
            <div>???????????? ????????????</div>
            <div
              className="study-underline-green"
              style={{
                margin: "auto",
                lineHeight: "35px",
                fontSize: "25px",
                marginBottom: "10px",
              }}
            >
              ????????? ?????? ????????????
            </div>
          </div>
          <div
            className="study-description-detail"
            onClick={handleMemberModalShow}
          >
            <img src="/code_person.png" alt="??????????????????"></img>
            <div>?????? ??? ?????? ??? ????????????</div>
            <div
              className="study-underline-green"
              style={{
                margin: "auto",
                lineHeight: "35px",
                fontSize: "25px",
                marginBottom: "10px",
              }}
            >
              ???????????? ????????????
            </div>
          </div>
          <div
            className="study-description-detail"
            onClick={navigateReviewList}
          >
            <img src="/codeReviewIcon.png" alt="???????????? ?????????"></img>
            <div>?????? ???????????????</div>
            <div
              className="study-underline-green"
              style={{
                margin: "auto",
                lineHeight: "35px",
                fontSize: "25px",
                marginBottom: "10px",
              }}
            >
              ?????? ?????? ??? ??????
            </div>
          </div>
        </div>
        {studyDetail.isMember && myId !== studyDetail.leaderBaekjoonId && (
          <div className="study-out">
            <RedButton onClick={studyOut}>????????? ??????</RedButton>
          </div>
        )}
      </section>
      <section className="study-detail-middle">
        <div
          className="study-detail-aldy"
          style={{ width: "50%", display: "flex", flexDirection: "colunm" }}
        >
          <div className="aldy-bg">
            <img
              className="study-detail-img"
              src={ActivationLevel[studyDetail.activationLevel]}
              alt="????????? ?????? ?????????"
            ></img>
          </div>
          <div
            className="study-underline-green"
            style={{
              margin: "10px auto",
              lineHeight: "35px",
              fontSize: "35px",
              marginBottom: "10px",
            }}
          >
            ??????????????? <span style={{ color: "red" }}>????????????~</span>
          </div>
          <div className="dinosaur-description">
            ?????? ?????? ?????????{" "}
            <span style={{ color: "rgba(40, 80, 15, 1)", fontWeight: "900" }}>
              ????????? ??????
            </span>
            ???{" "}
            <span style={{ color: "rgba(40, 80, 15, 1)", fontWeight: "900" }}>
              lv.{studyDetail.level}
            </span>
            ?????????.
          </div>
        </div>
        <div className="study-detail-info">
          <span className="study-detail-number">
            ???????????? : {studyDetail.countMember}/{studyDetail.upperLimit}
          </span>
          <div
            className="study-underline-orange"
            style={{
              alignSelf: "center",
              lineHeight: "35px",
              fontSize: "30px",
              margin: "10px",
            }}
          >
            {studyDetail.name}
          </div>
          <div className="study-detail-rank">
            <img
              src={`https://d2gd6pc034wcta.cloudfront.net/tier/${studyDetail.threshold}.svg`}
              alt="?????? ?????????"
              className="tier-image"
            ></img>
            {TierData[studyDetail.threshold]}
          </div>
          <div className="description">
            <div>
              <span style={{ color: "rgb(125,125,125)" }}>
                [???????????? ?????????]{" "}
              </span>
              {studyDetail.leaderEmail}
            </div>
            <hr style={{ margin: "5px 0px 15px 0px" }} />
            <div>
              <div style={{ marginBottom: "5px" }}>
                <b>???????????? ?????????</b>
              </div>
              {studyDetail.introduction.split("\n").map((line) => {
                //this.props.data.content: ??????
                return (
                  <span>
                    {line}
                    <br />
                  </span>
                );
              })}
              <hr style={{ margin: "5px 0px 15px 0px" }} />
              <div style={{ marginBottom: "5px" }}>
                <b>????????????? ??????????</b>
              </div>
              <div style={{ color: "rgb(80,80,80)", fontSize: "15px" }}>
                ?????? ?????? ?????? ?????? ?????? ??? ?????? ????????? ???????????????.
              </div>
              <div style={{ color: "red", marginTop: "15px" }}>
                ??????(?????????)????
              </div>
              <div style={{ color: "rgb(80,80,80)", fontSize: "15px" }}>
                ????????? ???????????? ?????? 1????????? ?????? ????????? ???<br></br>
                ?????? ?????? ????????? ?????? ????????? ?????? ?????? ????????? ???<br></br>??? ??????
                3??? ?????? ?????? ??????????????? ???????????? ?????? ??????
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="study-detail-bottom">
        <div className="study-detail-calendar">
          <div className="calendar-description">
            <span className="dot"></span> ????????? ??????????????? ?????? ????????? ?????????
            ???????????? ?????? ???????????????.
          </div>
          {studyDetail.isMember ? (
            <Calendar
              onChange={setDate}
              date={date}
              tileContent={({ date, view }) => {
                if (mark.find((x) => x === moment(date).format("DD-MM-YYYY"))) {
                  return (
                    <>
                      <div className="dot-box">
                        <div
                          className="dot"
                          style={{ position: "absolute" }}
                        ></div>
                      </div>
                    </>
                  );
                }
              }}
            />
          ) : (
            <div className="calendar-lock">
              <FcLock style={{ fontSize: "120px" }} />
            </div>
          )}
        </div>
        <div className="study-detail-bottom-right">
          {studyDetail.isMember ? (
            <div className="study-detail-graph-box">
              <div
                className="study-underline-orange"
                style={{
                  alignSelf: "center",
                  lineHeight: "35px",
                  fontSize: "25px",
                  marginBottom: "20px",
                }}
              >
                ????????? ??????
              </div>
              {keys.length ? (
                <div className="study-detail-graph">
                  <div>
                    <div className="study-title-graph">???????????? ???</div>
                    <StudyChart studyData={studyDetail.statsByTag} />
                  </div>
                  <div>
                    <div className="study-title-graph">????????? ???</div>
                    <StudyChartTier studyData={studyDetail.statsByTier} />
                  </div>
                </div>
              ) : (
                <div style={{ margin: "110px", fontSize: "20px" }}>
                  ????????? ????????? ????????????.
                </div>
              )}
            </div>
          ) : (
            <div className="calendar-lock" style={{ marginTop: "20px" }}>
              <FcLock style={{ fontSize: "120px" }} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default StudyDetail;
