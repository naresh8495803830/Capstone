import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Checkbox,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./npsresponse.scss";
import { npsServiceUrl } from "../../../api/url";
import { useParams } from "react-router-dom";
import { getMethod, putMethod } from "../../../api/common";
import ResponseHeader from "./responseHeader";
import ResponseSidebar from "./responseSidebar";

export default function Npsresponse() {
  const [loading, setLoading] = useState(true);
  const [npsData, setNpsData] = useState(null);
  const [alignmentMap, setAlignmentMap] = useState({});
  const [tagTypeMap, setTagTypeMap] = useState({});
  const [commentTypeMap, setCommentTypeMap] = useState({});
  const [tagSelectionMap, setTagSelectionMap] = useState({});
  const { userId } = useParams();
  const [formState, setFormState] = useState("pending");
  const [submission, setSubmission] = useState(false);
  const [otherReasonMap, setOtherReasonMap] = useState({});
  const [formData, setFormData] = useState({
    studentId: "",
    npsFormId: "",
    completionStatus: "completed",
    responses: [
      {
        questionId: "",
        questionType: "",
        responseVal: "",
        responseComment: "",
        responseTagType: "",
        responseTag: [],
      },
    ],
  });
  const [activeQuestion, setActiveQuestion] = useState(0);
  const handleSubmit = async () => {
    for (let index in tagSelectionMap) {
      if (
        tagSelectionMap[index] &&
        tagSelectionMap[index].indexOf("Any other reason") !== -1 &&
        (!otherReasonMap[index] || otherReasonMap[index].trim() === "")
      ) {
        alert("Please enter the other reasons.");
        return;
      }
    }
    const responseArray = [];
    const formCodeId = userId.substring(userId.length - 6);
    const studentId = userId.slice(0, -6);
    npsData.questions.forEach((question, index) => {
      const response = {
        questionId: question._id,
        questionType: question.questionType.npsOrCsat,
        responseVal: alignmentMap[index],
        responseComment: commentTypeMap[index] || "",
        responseTagType: tagTypeMap[index] || "NA",
        responseTag: tagSelectionMap[index] || [],
      };
      responseArray.push(response);
    });

    const requestData = {
      studentId: studentId,
      npsFormId: npsData._id,
      completionStatus: "completed",
      responses: responseArray,
    };

    try {
      const res = await putMethod(
        `${npsServiceUrl}/npsresponse/${userId}`,
        requestData
      );
      setSubmission(true);
    } catch (error) {
      console.error("Error submitting response:", error);
      // Handle error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getMethod(
          `${npsServiceUrl}/npsresponse/form/${userId}`
        );
        if (res.data[0].completionStatus === "pending") {
          const response = await getMethod(
            `${npsServiceUrl}/npsform/${res.data[0].npsFormId}`
          );
          setNpsData(response.data);
        } else {
          setFormState("completed");
        }
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAlignmentChange = (questionIndex, value, iscomment) => {
    setAlignmentMap({ ...alignmentMap, [questionIndex]: value });
    const currentQuestion = npsData.questions[questionIndex];

    if (currentQuestion.questionType.npsOrCsat === "csat") {
      const tagIndex = value - 1;
      // if(iscomment === true){
      //   // console.log
      //   setCommentTypeMap({ ...commentTypeMap, [questionIndex]: value });
      // }
      if (tagIndex >= 0 && tagIndex < 5) {
        if (value === 3) {
          setTagTypeMap({ ...tagTypeMap, [questionIndex]: "neutralTags" });
        } else if (value === 1 || value === 2) {
          setTagTypeMap({ ...tagTypeMap, [questionIndex]: "detractorTags" });
        } else if (value === 4 || value === 5) {
          setTagTypeMap({ ...tagTypeMap, [questionIndex]: "promoterTags" });
        }
      } else {
        setTagTypeMap({ ...tagTypeMap, [questionIndex]: null });
      }
    }
    if (currentQuestion.questionType.npsOrCsat === "na") {
      const updatedFormData = { ...formData };
      setCommentTypeMap({ ...commentTypeMap, [questionIndex]: value });
      setFormData(updatedFormData);
    }
  };

  const handleTagSelectionChange = (questionIndex, selectedTag) => {
    setTagSelectionMap({ ...tagSelectionMap, [questionIndex]: selectedTag });
  };

  const handleCommentAlignmentChange = (questionIndex, value, iscomment) => {
    setAlignmentMap({ ...alignmentMap, [questionIndex]: value });

    if (iscomment === true) {
      setCommentTypeMap({ ...commentTypeMap, [questionIndex - 100]: value });
      if (
        tagSelectionMap[questionIndex - 100] &&
        tagSelectionMap[questionIndex - 100].includes("Any other reason")
      ) {
        setOtherReasonMap({ ...otherReasonMap, [questionIndex - 100]: value });
      }
    }
  };
  const handleTag = (arr, tag) => {
    return arr?.includes(tag);
  };
  const handleNext = () => {
    if (activeQuestion < npsData.questions.length - 1)
      setActiveQuestion(activeQuestion + 1);
  };
  const handleChange = () => {};
  const getCsatLabel = (value) => {
    switch (value) {
      case 1:
        return "Highly Dissatisfied";
      case 2:
        return "Somewhat Dissatisfied";
      case 3:
        return "Neutral";
      case 4:
        return "Somewhat Satisfied";
      case 5:
        return "Highly Satisfied";
      default:
        return "";
    }
  };

  const getNPSLabel = (value) => {
    switch (value) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      case 6:
        return 6;
      case 7:
        return 7;
      case 8:
        return 8;
      case 9:
        return 9;
      case 10:
        return 10;
      default:
        return "";
    }
  };
  if (!loading) {
    npsData &&
      npsData.questions &&
      npsData.questions.map((question, index) => {
        return 1;
      });
  }
  if (formState === "completed") {
    return (
      <div className="response-container">
        <ResponseHeader></ResponseHeader>
        <div className="submissions">
          <br></br>
          Form has already been submitted.
        </div>
      </div>
    );
  }
  if (submission === true) {
    return (
      <div className="response-container">
        <ResponseHeader></ResponseHeader>
        <div className="submissions">
          <br></br>
          Response Submitted Successfully.<br></br>
          Thank you for your response.
        </div>
      </div>
    );
  } else {
    return (
      <div className="response-container">
        <ResponseHeader></ResponseHeader>
        <div className="main">
          <ResponseSidebar
            questions={npsData?.questions}
            activeQuestion={activeQuestion}
            setActiveQuestion={setActiveQuestion}
          ></ResponseSidebar>
          <div className="questions">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {npsData &&
                  npsData.questions &&
                  npsData.questions.map(
                    (question, index) =>
                      activeQuestion == index && (
                        <>
                          <p className="question-label">Question {index + 1}</p>
                          <div
                            key={index}
                            className={
                              question.questionType.npsOrCsat === "nps"
                                ? "nps"
                                : "csat"
                            }
                          >
                            <h4>{question.question}</h4>
                            {question.questionType.npsOrCsat === "nps" ? (
                              <ToggleButtonGroup
  className="numeric-rating"
  value={alignmentMap[index] || null}
  exclusive
  onChange={(event, value) => handleAlignmentChange(index, value)}
  aria-label="NPS Platform"
  style={{ display: 'flex', padding: '0' }}
>
  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
    const isSelected = alignmentMap[index] === value;

    const getColor = () => {
      if (isSelected) {
        return 'rgba(0, 0, 255, 0.7)';
      }
      const red = Math.round(255 - (value - 1) * (255 / 9)); 
      const green = Math.round((value - 1) * (255 / 9));     
      return `rgba(${red}, ${green}, 0, 0.3)`; 
    };

    return (
      <ToggleButton
        key={value}
        value={value}
        style={{
          backgroundColor: getColor(),
          color: 'black', 
          borderRadius: '0',
          border: '1px solid #ccc', 
        }}
      >
        {getNPSLabel(value)}
      </ToggleButton>
    );
  })}
</ToggleButtonGroup>
                           
                            ) : question.questionType.npsOrCsat === "na" ? (
                              <TextField
                                key={index}
                                placeholder="Enter your feedback"
                                multiline
                                fullWidth
                                variant="outlined"
                                onChange={(event) =>
                                  handleCommentAlignmentChange(
                                    index + 100,
                                    event.target.value,
                                    true
                                  )
                                }
                              />
                            ) : (
                              <ToggleButtonGroup
                                color="primary"
                                className="rating"
                                value={alignmentMap[index] || null}
                                exclusive
                                onChange={(event, value) =>
                                  handleAlignmentChange(index, value)
                                }
                                aria-label="CSAT Platform"
                              >
                                {[5, 4, 3, 2, 1].map((value) => [
                                  <ToggleButton key={value} value={value}>
                                    <input
                                      type="checkbox"
                                      className="none custom-check"
                                      onChange={() => {}}
                                      checked={alignmentMap?.[index] == value}
                                    />
                                    {getCsatLabel(value)}
                                  </ToggleButton>,
                                ])}
                              </ToggleButtonGroup>
                            )}
                            {tagTypeMap[index] && (
                              <div className="subtags">
                                <h4>
                                  {tagTypeMap[index] === "promoterTags"
                                    ? "What did you like?"
                                    : tagTypeMap[index] === "neutralTags"
                                    ? "Where can we improve?"
                                    : "What went wrong?"}
                                </h4>
                                <ToggleButtonGroup
                                  className="rating"
                                  color="primary"
                                  value={tagSelectionMap[index] || null}
                                  onChange={(event, selectedTag) =>
                                    handleTagSelectionChange(index, selectedTag)
                                  }
                                  aria-label="CSAT Subtags"
                                >
                                  {npsData.questions[index][
                                    tagTypeMap[index]
                                  ].map((tag, tagIndex) => {
                                    return [
                                      <ToggleButton key={tagIndex} value={tag}>
                                        <input
                                          type="checkbox"
                                          className="none custom-check"
                                          checked={handleTag(
                                            tagSelectionMap?.[index],
                                            tag
                                          )}
                                        />
                                        {tag}
                                      </ToggleButton>,
                                    ];
                                  })}
                                </ToggleButtonGroup>
                              </div>
                            )}
                            {/* {console.log(
                    `Tag selected for the index ${index}: `,
                    tagSelectionMap[index]
                  )} */}
                            {tagSelectionMap[index] &&
                              tagSelectionMap[index].indexOf(
                                "Any other reason"
                              ) !== -1 && (
                                <TextField
                                  key={index}
                                  placeholder="Enter the other reasons"
                                  multiline
                                  fullWidth
                                  variant="outlined"
                                  onChange={(event) =>
                                    handleCommentAlignmentChange(
                                      index + 100,
                                      event.target.value,
                                      true
                                    )
                                  }
                                  value={otherReasonMap[index] || ""}
                                />
                              )}
                          </div>
                        </>
                      )
                  )}
                <div className="btn-center">
                  {activeQuestion < npsData.questions.length - 1 && (
                    <Button variant="outlined" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                  {activeQuestion == npsData.questions.length - 1 && (
                    <Button className="submit-btn" onClick={handleSubmit}>
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
