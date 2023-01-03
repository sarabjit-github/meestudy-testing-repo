import React, { useState, useEffect } from "react";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { AiFillFile, AiOutlineDownload } from "react-icons/ai";
import { toast } from "react-hot-toast";
import api, { getAccessToken } from "../../../../../services/api";
import { useFormik } from "formik";
import * as Yup from "yup";

export const ProvideFeedbackModal = ({
  setIsProvideFeedbackModalOpen,
  clickedProjectDetails,
}) => {
  const provideFeedbackModalRef = useClickOutside(() =>
    setIsProvideFeedbackModalOpen(false)
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

  const formik = useFormik({
    initialValues: {
      feedback: "",
    },
    validationSchema: Yup.object({
      feedback: Yup.string().required("Please provide feedback"),
    }),
    onSubmit: (values) => {
      // console.log(values);
      const data = {
        data: {
          feedbackReview: values.feedback,
        },
        id: clickedProjectDetails._id,
      };
      api
        .patch("/project/update-project-in-admin", data, {
          headers: { Authorization: getAccessToken() },
        })
        .then((res) => {
          // console.log(res.data);
          toast.success("Feedback submitted successfully.");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong.\n please try again.");
        });
    },
  });

  return (
    <div
      className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`}
    >
      <div
        ref={provideFeedbackModalRef}
        className={glassStyles.submissionModalBoxWrapper}
      >
        <div className={glassStyles.header}>
          <h3>Tutor submitted data</h3>
          <button
            className="btnDark btn--medium"
            onClick={() => setIsProvideFeedbackModalOpen(false)}
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
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="feedback">Feedback</label>
              <textarea
                name="feedback"
                id="feedback"
                placeholder="Write feedback here"
                defaultValue={formik.values.feedback}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.feedback &&
                  formik.touched.feedback &&
                  glassStyles.errorBorder
                }
              ></textarea>
              {formik.errors.feedback && formik.touched.feedback && (
                <div className={glassStyles.error}>
                  {formik.errors.feedback}
                </div>
              )}
            </div>
          </form>
          <div className={glassStyles.actionButtonsWrapper}>
            <button
              type="submit"
              className="btnSuccess btn--medium"
              onClick={formik.handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
