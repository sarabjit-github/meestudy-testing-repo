import React, { useState, useEffect } from "react";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { AiFillFile, AiOutlineDownload } from "react-icons/ai";
import { toast } from "react-hot-toast";
import api, { getAccessToken } from "../../../../../services/api";

export const TutorSubmissionViewModal = ({
  setIsTutorSubmissionViewModalOpen,
  clickedProjectDetails,
}) => {
  const tutorSubmissioniViewModalRef = useClickOutside(() =>
    setIsTutorSubmissionViewModalOpen(false)
  );
  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    // console.log("clicked project details: ",clickedProjectDetails);

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  const handleAcceptTutorProject = async () => {
    const data = {
      data: {
        orderStatus: "submissionAccepted",
      },
      id: clickedProjectDetails._id,
    };
    api
      .patch("/project/update-project-in-admin", data, {
        headers: { Authorization: getAccessToken() },
      })
      .then((res) => {
        // console.log(res.data);
        toast.success("Assignment accepted successfully.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again.");
      });
  };
  const handleRejectTutorProject = () => {
    const data = {
      data: {
        orderStatus: "submissionRejected",
      },
      id: clickedProjectDetails._id,
    };
    api
      .patch("/project/update-project-in-admin", data, {
        headers: { Authorization: getAccessToken() },
      })
      .then((res) => {
        // console.log(res.data);
        toast.success("Assignment rejected successfully.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again.");
      });
  };
  return (
    <div
      className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`}
    >
      <div
        ref={tutorSubmissioniViewModalRef}
        className={glassStyles.submissionModalBoxWrapper}
      >
        <div className={glassStyles.header}>
          <h3>Tutor submitted data</h3>
          <button
            className="btnDark btn--medium"
            onClick={() => setIsTutorSubmissionViewModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className={glassStyles.tutorSubmissionViewWrapper}>
          <h3>Submitted documents</h3>
          <div className={glassStyles.filesWrapper}>
            {clickedProjectDetails?.assignmentSubmissionUrls.map(
              (fileUrl, i) => {
                return (
                  <a
                    href={fileUrl}
                    key={i}
                    className={glassStyles.file}
                    title={`Document ${i + 1}`}
                  >
                    <span>
                      <AiFillFile />
                      <span>{`Document ${i + 1}`}</span>
                    </span>
                    <AiOutlineDownload />
                  </a>
                );
              }
            )}
          </div>
          <div className={glassStyles.changesWrapper}>
            <h3>Changes</h3>
            <p>{clickedProjectDetails?.changes}</p>
          </div>
          <div className={glassStyles.actionButtonsWrapper}>
            <button
              className="btnSuccess btn--medium"
              onClick={handleAcceptTutorProject}
            >
              Accept
            </button>
            <button
              className="btnDanger btn--medium"
              onClick={handleRejectTutorProject}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
