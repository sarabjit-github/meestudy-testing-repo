import React, { useState, useEffect } from "react";
import glassStyles from "../../../../../styles/glass.module.scss";
import api, { getAccessToken } from "../../../../../services/api";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { useQuery } from "react-query";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDelete } from "react-icons/md";
import { AiFillFile, AiOutlineDownload } from "react-icons/ai";

export const TutorReSubmissionModal = ({
  setIsTutorReSubmissionModalOpen,
  clickedProjectDetails,
}) => {
  const reSubmissionModalRef = useClickOutside(() => {
    setIsTutorReSubmissionModalOpen(false);
  });
  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    // console.log(clickedProjectDetails);

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      files: [],
      changes: clickedProjectDetails.changes || "",
    },
    validationSchema: Yup.object({
      files: Yup.array()
        .min(1, "Please add at least one doc.")
        .required("Please add assignment submission docs."),
      changes: Yup.string().required("Please add submission reason."),
    }),
    onSubmit: async (values) => {
      console.log("submit values: ", values);
      const formData = new FormData();
      const data = {
        changes: values.changes,
        files: values.files,
        id: clickedProjectDetails._id,
        orderStatus: "assignmentSubmitted",
      };
      for (let i in data) {
        if (i === "files") {
          data[i].forEach((item) => {
            formData.append(i, item);
          });
        } else {
          formData.append(i, data[i]);
        }
      }

    //   try {
    //     const res = await api.patch(
    //       "/project/update-project-in-tutor/",
    //       formData,
    //       {
    //         headers: {
    //           Authorization: getAccessToken(),
    //         },
    //       }
    //     );
    //     toast.success("Assignment submitted successfully.");
    //   } catch (error) {
    //     console.log(error);
    //     toast.error("Something went wrong.\n Please try again");
    //   }
    },
  });

  return (
    <div
      className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`}
    >
      <div
        ref={reSubmissionModalRef}
        className={glassStyles.submissionModalBoxWrapper}
      >
        <div className={glassStyles.header}>
          <h3>Re-Submit Assignment</h3>
          <button
            className="btnDark btn--medium"
            onClick={() => setIsTutorReSubmissionModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className={glassStyles.tutorSubmissionViewWrapper}>
          <h3>Previous submitted documents</h3>
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
        </div>
        <div className={glassStyles.formWrapper}>
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.uploadWrapper}>
              <h4>Upload Assignment guidelines and Supporting Docs</h4>
              <div className={glassStyles.uploadButton}>
                Upload documents
                <input
                  type="file"
                  name="files"
                  id="files"
                  accept="image/*, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf"
                  multiple
                  title="Add file"
                  onChange={(e) => {
                    if (e.target.files.length !== 0) {
                      let filesNamesArr = formik.values.files.map(
                        ({ name }) => {
                          return name;
                        }
                      );
                      if (filesNamesArr.includes(e.target.files[0].name)) {
                        toast("File already added", {
                          position: "top-center",
                          duration: 3000,
                          icon: <MdInfo fill="var(--warning-500)" />,
                          style: {
                            padding: ".5rem 1rem",
                            backgroundColor: "white",
                            borderRadius: ".75rem",
                            border: "2px solid var(--warning-300)",
                          },
                        });
                      } else {
                        formik.setFieldValue(
                          "files",
                          formik.values.files.concat(e.target.files[0])
                        );
                      }
                    }
                    // console.log("files: ", e.target.files);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.errors.files && formik.touched.files ? (
                <div className={glassStyles.error}>{formik.errors.files}</div>
              ) : null}
              {/* <h4>Selected files</h4> */}
              {formik.values.files.length !== 0 &&
                formik.values.files?.map(({ name, size }, i) => {
                  let sizeInKb = size / 1000;
                  let sizeInMb = size / 1000000;
                  return (
                    <div className={glassStyles.selectedFile} key={i}>
                      <div>
                        <h6>
                          {name.length > 20 ? `${name.slice(0, 20)}...` : name}
                        </h6>
                        <span>
                          {sizeInMb >= 1
                            ? `${sizeInMb.toString().slice(0, 5)} MB`
                            : `${sizeInKb.toString().slice(0, 5)} KB`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          let filterArr = formik.values.files?.filter(
                            ({ name: fname }) => {
                              return fname !== name;
                            }
                          );
                          formik.setFieldValue("files", filterArr);
                          //   console.log("deleted", filterArr);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  );
                })}
            </div>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="changes">Overview</label>
              <textarea
                name="changes"
                id="changes"
                placeholder="Write overview here"
                defaultValue={formik.values.changes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.changes &&
                  formik.touched.changes &&
                  glassStyles.errorBorder
                }
              ></textarea>
              {formik.errors.changes && formik.touched.changes && (
                <div className={glassStyles.error}>{formik.errors.changes}</div>
              )}
            </div>
            <button type="submit" className="btnPrimary btn--medium">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
