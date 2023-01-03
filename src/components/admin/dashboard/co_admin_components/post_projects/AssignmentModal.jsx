import React, { useState, useEffect } from "react";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import api, { getAccessToken } from "../../../../../services/api";
import { MdDelete } from "react-icons/md";
import { useQuery } from "react-query";
import { toast } from "react-hot-toast";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { AiFillFile, AiOutlineDownload } from "react-icons/ai";

export const AssignmentModal = ({ setIsModalOpen, projectDetails }) => {
  const {
    assignmentId,
    assignmentTitle,
    assignmentPrice,
    subject,
    deadline,
    studentName,
    orderStatus,
    description,
    additionalNotes,
    createdAt,
    assignTo,
    _id,
    tutorPayment,
    sPayment,
    assignedCoAdmin,
  } = projectDetails;

  console.log(projectDetails);

  const [subjects, setSubjects] = useState([]);
  const [projectId, setProjectId] = useState(_id);

  const { data: coAdminsArr } = useQuery("co-admins", async () => {
    const res = await api.get("/admin/get-all-admin/Co-Admin");
    return res.data;
  });

  const assignmentModalRef = useClickOutside(() => {
    setIsModalOpen(false);
  });


  // console.log("co-admins data: ", coAdminsArr);

  const formik = useFormik({
    initialValues: {
      assignmentId: assignmentId || "",
      assignmentTitle: assignmentTitle || "",
      subject: subject || "",
      documentType: [...projectDetails.documentType],
      englishLevel: "Basic",
      referencingStyle: "Apa",
      deadline: deadline || "",
      createdAt: createdAt || "",
      description: description || "",
      supportingDocs: [],
      additionalNotes: additionalNotes || "",
      amount: "",
      assignedCoAdmin: assignedCoAdmin || [],
      assignTo: assignTo || "",
      tutorPayment: Number(tutorPayment) || Number("0"),
      rejectionReason: "Please add explanation for each graph",
      status: "Paid",
      assignmentStatus: orderStatus || "Rejected",
      assignmentPrice: Number(assignmentPrice) || Number("0"),
      sPayment: Number(sPayment) || Number("0"),
    },
    validationSchema: Yup.object({
      assignmentTitle: Yup.string().required("Assignment title is required"),
      subject: Yup.string().required("Please select your subject"),
      documentType: Yup.array()
        .required("Please select document type")
        .min(1, "Please select at least one document type"),
      englishLevel: Yup.string().required("Please select english level"),
      referencingStyle: Yup.string().required(
        "Please select referencing style"
      ),
      deadline: Yup.string().required("Please select deadline of assignment"),
      createdAt: Yup.string(),
      description: Yup.string().required("Description is required"),
      additionalNotes: Yup.string(),
      tutorPayment: Yup.number(),
      rejectionReason: Yup.string(),
      assignedCoAdmin: Yup.array().required("Assign Co-Admin is required"),
      sPayment: Yup.number().required("S Payment is required"),
      assignmentPrice: Yup.number()
    }),
    onSubmit: (values) => {
      let {
        assignmentTitle,
        deadline,
        additionalNotes,
        amount,
        description,
        documentType,
        englishLevel,
        assignedCoAdmin,
        referencingStyle,
        subject,
        assignmentStatus,
        supportingDocs: files,
      } = values;
      // console.log(values);
      const data = {
        data: {
          orderStatus: assignmentStatus,
          style: referencingStyle,
        },
        id: projectId,
      };
      // console.log(values);
      api
        .patch("/project/update-project-in-admin", data, {
          headers: { Authorization: getAccessToken() },
        })
        .then((res) => {
          // console.log(res.data);
          setIsModalOpen(false);
          toast.success("Data successfully updated.");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong, please try again.");
        });
    },
  });

  useEffect(() => {
    async function getSubjects() {
      const res = await api.get("/subject/get-all");
      const data = res.data;

      setSubjects(
        data.map((item) => {
          return { label: item.subjectName, value: item.subjectName };
        })
      );
    }
    getSubjects();
  }, []);

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const englishLevelArr = ["Basic", "Intermediate", "Professional"];
  const referencingStyleArr = ["Apa", "Harvard", "Chicago", "MLA", "Others"];
  const statusArr = ["Un-paid", "Paid"];
  const assignmentStatusArr = [
    {
      label: "New Assignment",
      value: "newAssignment",
    },
    {
      label: "Approved",
      value: "adminApproved",
    },
    {
      label: "Broadcasted",
      value: "coAdminApproved",
    },
    {
      label: "Assigned",
      value: "assigned",
    },
    {
      label: "Completed",
      value: "assignmentSubmitted",
    },
    {
      label: "Accepted",
      value: "submissionAccepted",
    },
    {
      label: "Rejected",
      value: "submissionRejected",
    },
    {
      label: "Cancelled",
      value: "adminRejected",
    },
  ];

  return (
    <div className={glassStyles.modalWrapper}>
      <div ref={assignmentModalRef} className={glassStyles.modalBoxWrapper}>
        <div className={glassStyles.header}>
          <h3>Assignment details</h3>
          <button className="btnDark btn--medium" onClick={handleCloseModal}>
            Close
          </button>
        </div>
        <div className={glassStyles.formWrapper}>
          <form onSubmit={formik.handleSubmit}>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="assignmentId">Assignment id</label>
                <input
                  type="text"
                  id="assignmentId"
                  value={formik.values.assignmentId}
                  //   disabled
                  readOnly
                  placeholder="It will generate automatically"
                />
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="assignmentTitle">Assignment title</label>
                <input
                  type="text"
                  name="assignmentTitle"
                  id="assignmentTitle"
                  defaultValue={formik.values.assignmentTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter assignment title here"
                  className={
                    formik.errors.assignmentTitle &&
                    formik.touched.assignmentTitle &&
                    glassStyles.errorBorder
                  }
                />
                {formik.errors.assignmentTitle &&
                  formik.touched.assignmentTitle && (
                    <div className={glassStyles.error}>
                      {formik.errors.assignmentTitle}
                    </div>
                  )}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="subject">Subjects</label>
                <select
                  name="subject"
                  id="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.subject &&
                    formik.touched.subject &&
                    glassStyles.errorBorder
                  }
                >
                  <option value="">Select your subject</option>
                  {subjects.map(({ value }, i) => {
                    return (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
                {formik.errors.subject && formik.touched.subject && (
                  <div className={glassStyles.error}>
                    {formik.errors.subject}
                  </div>
                )}
              </div>
              <div className={glassStyles.checkboxWrapper}>
                <h4>Document Type</h4>
                <div className={glassStyles.flexWrapper}>
                  <div>
                    <input
                      type="checkbox"
                      name="documentType"
                      id="word"
                      value="word"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      defaultChecked={projectDetails.documentType.includes(
                        "word"
                      )}
                    />
                    <label htmlFor="word">Word</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="documentType"
                      id="ppt"
                      value="ppt"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      defaultChecked={projectDetails.documentType.includes(
                        "ppt"
                      )}
                    />
                    <label htmlFor="ppt">PPT</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="documentType"
                      id="excel"
                      value="excel"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      defaultChecked={projectDetails.documentType.includes(
                        "excel"
                      )}
                    />
                    <label htmlFor="excel">Excel</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="documentType"
                      id="miscellaneous"
                      value="miscellaneous"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      defaultChecked={projectDetails.documentType.includes(
                        "miscellaneous"
                      )}
                    />
                    <label htmlFor="miscellaneous">Miscellaneous</label>
                  </div>
                </div>
                {formik.errors.documentType && formik.touched.documentType && (
                  <div className={glassStyles.error}>
                    {formik.errors.documentType}
                  </div>
                )}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="englishLevel">English Level</label>
                <select
                  name="englishLevel"
                  id="englishLevel"
                  value={formik.values.englishLevel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.englishLevel &&
                    formik.touched.englishLevel &&
                    glassStyles.errorBorder
                  }
                >
                  {/* <option value="">Please select english level</option> */}
                  {englishLevelArr.map((value, i) => {
                    return (
                      <option
                        key={i}
                        value={value}
                        //  selected={formik.values.englishLevel === value}
                      >
                        {value}
                      </option>
                    );
                  })}
                </select>
                {formik.errors.englishLevel && formik.touched.englishLevel && (
                  <div className={glassStyles.error}>
                    {formik.errors.englishLevel}
                  </div>
                )}
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="referencingStyle">Referencing Style</label>
                <select
                  name="referencingStyle"
                  id="referencingStyle"
                  value={formik.values.referencingStyle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.referencingStyle &&
                    formik.touched.referencingStyle &&
                    glassStyles.errorBorder
                  }
                >
                  {referencingStyleArr.map((value, i) => {
                    return (
                      <option
                        key={i}
                        value={value}
                        //   selected={formik.values.referencingStyle === value}
                      >
                        {value}
                      </option>
                    );
                  })}
                </select>
                {formik.errors.referencingStyle &&
                  formik.touched.referencingStyle && (
                    <div className={glassStyles.error}>
                      {formik.errors.referencingStyle}
                    </div>
                  )}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="deadline">
                  Deadline{" "}
                  <span>
                    ({new Date(formik.values.deadline).toLocaleString()})
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  id="deadline"
                  // value={new Date(formik.values.deadline).toLocaleString()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.deadline &&
                    formik.touched.deadline &&
                    glassStyles.errorBorder
                  }
                />
                {formik.errors.deadline && formik.touched.deadline && (
                  <div className={glassStyles.error}>
                    {formik.errors.deadline}
                  </div>
                )}
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="createdAt">
                  Upload date{" "}
                  <span>
                    ({new Date(formik.values.createdAt).toLocaleString()})
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="createdAt"
                  id="createdAt"
                  value={new Date(formik.values.createdAt).toLocaleString()}
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  readOnly
                  className={
                    formik.errors.createdAt &&
                    formik.touched.createdAt &&
                    glassStyles.errorBorder
                  }
                />
                {formik.errors.createdAt && formik.touched.createdAt && (
                  <div className={glassStyles.error}>
                    {formik.errors.createdAt}
                  </div>
                )}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Write description here"
                  className={
                    formik.errors.description &&
                    formik.touched.description &&
                    glassStyles.errorBorder
                  }
                ></textarea>
                {formik.errors.description && formik.touched.description && (
                  <div className={glassStyles.error}>
                    {formik.errors.description}
                  </div>
                )}
              </div>
              <div className={glassStyles.uploadWrapper}>
                <div className={glassStyles.tutorSubmissionViewWrapper}>
                  <h3>Submitted documents</h3>
                  <div className={glassStyles.filesWrapper}>
                    {projectDetails?.downloadUrl.map(
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
                <h4>Upload Assignment guidelines and Supporting Docs</h4>
                <div className={glassStyles.uploadButton}>
                  Upload documents
                  <input
                    type="file"
                    name="supportingDocs"
                    id="supportingDocs"
                    accept="image/*, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf"
                    multiple
                    title="Add file"
                    onChange={(e) => {
                      if (e.target.files.length !== 0) {
                        let supportingDocsNamesArr =
                          formik.values.supportingDocs.map(({ name }) => {
                            return name;
                          });
                        if (
                          supportingDocsNamesArr.includes(
                            e.target.files[0].name
                          )
                        ) {
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
                            "supportingDocs",
                            formik.values.supportingDocs.concat(
                              e.target.files[0]
                            )
                          );
                        }
                      }
                      // console.log("files: ", e.target.files);
                    }}
                  />
                </div>
                {/* <h4>Selected files</h4> */}
                {formik.values.supportingDocs.length !== 0 &&
                  formik.values.supportingDocs?.map(({ name, size }, i) => {
                    let sizeInKb = size / 1000;
                    let sizeInMb = size / 1000000;
                    return (
                      <div className={glassStyles.selectedFile} key={i}>
                        <div>
                          <h6>
                            {name.length > 20
                              ? `${name.slice(0, 20)}...`
                              : name}
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
                            let filterArr =
                              formik.values.supportingDocs?.filter(
                                ({ name: fname }) => {
                                  return fname !== name;
                                }
                              );
                            formik.setFieldValue("supportingDocs", filterArr);
                            // console.log("deleted", filterArr);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="assignedCoAdmin">Assign Co-Admin</label>
                <input type="text" name="assignedCoAdmin"
                  id="assignedCoAdmin"
                  value={formik.values.assignedCoAdmin[0]?.name}
                  readOnly={true}
                  placeholder="Assigned co-admin"
                  />
                {formik.errors.assignedCoAdmin &&
                  formik.touched.assignedCoAdmin && (
                    <div className={glassStyles.error}>
                      {formik.errors.assignedCoAdmin}
                    </div>
                  )}
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="assignTo">Assign to</label>
                <input
                  type="text"
                  name="assignTo"
                  id="assignTo"
                  // defaultValue={formik.values.assignTo}
                  value={formik.values.assignTo}
                  readOnly
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Assign to"
                  className={
                    formik.errors.assignTo &&
                    formik.touched.assignTo &&
                    glassStyles.errorBorder
                  }
                />
                {formik.errors.assignTo && formik.touched.assignTo && (
                  <div className={glassStyles.error}>
                    {formik.errors.assignTo}
                  </div>
                )}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.bigInputWrapper}>
                <div className={glassStyles.inputWrapper}>
                  <label htmlFor="tutorPayment">Tutor Payment</label>
                  <input
                    type="number"
                    name="tutorPayment"
                    id="tutorPayment"
                    readOnly={true}
                    // defaultValue={formik.values.tutorPayment}
                    value={formik.values.tutorPayment}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Tutor payment"
                    className={
                      formik.errors.tutorPayment &&
                      formik.touched.tutorPayment &&
                      glassStyles.errorBorder
                    }
                  />
                  {formik.errors.tutorPayment &&
                    formik.touched.tutorPayment && (
                      <div className={glassStyles.error}>
                        {formik.errors.tutorPayment}
                      </div>
                    )}
                </div>
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="rejectionReason">Rejection reason</label>
                <input
                  type="text"
                  name="rejectionReason"
                  id="rejectionReason"
                  // defaultValue={formik.values.rejectionReason}
                  value={formik.values.rejectionReason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Type rejection reason"
                  className={
                    formik.errors.rejectionReason &&
                    formik.touched.rejectionReason &&
                    glassStyles.errorBorder
                  }
                />
                {formik.errors.rejectionReason &&
                  formik.touched.rejectionReason && (
                    <div className={glassStyles.error}>
                      {formik.errors.rejectionReason}
                    </div>
                  )}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="additionalNotes">Additional notes</label>
                <textarea
                  name="additionalNotes"
                  id="additionalNotes"
                  placeholder="Write additional notes here"
                  defaultValue={formik.values.additionalNotes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.additionalNotes &&
                    formik.touched.additionalNotes &&
                    glassStyles.errorBorder
                  }
                ></textarea>
                {formik.errors.additionalNotes &&
                  formik.touched.additionalNotes && (
                    <div className={glassStyles.error}>
                      {formik.errors.additionalNotes}
                    </div>
                  )}
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  id="status"
                  defaultValue={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.status &&
                    formik.touched.status &&
                    glassStyles.errorBorder
                  }
                >
                  {/* <option value="">Please select english level</option> */}
                  {statusArr.map((value, i) => {
                    return (
                      <option
                        key={i}
                        value={value}
                        //  selected={formik.values.englishLevel === value}
                      >
                        {value}
                      </option>
                    );
                  })}
                </select>
                {formik.errors.status && formik.touched.status && (
                  <div className={glassStyles.error}>
                    {formik.errors.status}
                  </div>
                )}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="assignmentStatus">Assignment Status</label>
                <select
                  name="assignmentStatus"
                  id="assignmentStatus"
                  defaultValue={formik.values.assignmentStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.assignmentStatus &&
                    formik.touched.assignmentStatus &&
                    glassStyles.errorBorder
                  }
                >
                  {/* <option value="">Please select english level</option> */}
                  {assignmentStatusArr.map(({ value, label }, i) => {
                    return (
                      <option
                        key={i}
                        value={value}
                        //  selected={formik.values.englishLevel === value}
                      >
                        {label}
                      </option>
                    );
                  })}
                </select>
                {formik.errors.assignmentStatus &&
                  formik.touched.assignmentStatus && (
                    <div className={glassStyles.error}>
                      {formik.errors.assignmentStatus}
                    </div>
                  )}
              </div>
            </div>
            <div className={glassStyles.btnsWrapper}>
              <button
                style={{ width: "fit-content" }}
                type="submit"
                className="btnPrimary btn--medium"
              >
                Update
              </button>
              <div>
                {orderStatus === "newAssignment" ? (
                  <td aria-controls="actions">
                    <button className="btnSuccess btn--small">Approve</button>
                    <button className="btnDanger btn--small">Cancel</button>
                  </td>
                ) : orderStatus === "adminRejected" ? (
                  <td aria-controls="actions">
                    <button
                      className="btnDark btn--small"
                      onClick={() => {
                        let desc = description || "";
                        let assignTo = "qp";
                        // handleProjectModal(
                        //   assignmentId,
                        //   assignmentTitle,
                        //   subject,
                        //   deadline,
                        //   studentName,
                        //   orderStatus,
                        //   desc,
                        //   additionalNotes,
                        //   createdAt,
                        //   assignTo,
                        //   _id
                        // );
                      }}
                    >
                      View application
                    </button>
                  </td>
                ) : orderStatus === "adminApproved" ? (
                  <td aria-controls="actions">
                    <button className="btnInfo btn--small">Broadcast</button>
                  </td>
                ) : orderStatus === "assignmentSubmitted" ? (
                  <td aria-controls="actions">
                    <button className="btnInfo btn--small">
                      View submission
                    </button>
                    <button className="btnInfo btn--small">Re-Broadcast</button>
                  </td>
                ) : orderStatus === "coAdminApproved" ? (
                  <td aria-controls="actions">
                    <button className="btnInfo btn--small">
                      View applications
                    </button>
                    <button className="btnInfo btn--small">Notify</button>
                  </td>
                ) : orderStatus === "assigned" ? (
                  <td aria-controls="actions">
                    <button className="btnDanger btn--small">
                      Un-assigned Tutor
                    </button>
                    <button className="btnInfo btn--small">Re-Broadcast</button>
                  </td>
                ) : orderStatus === "submissionRejected" ? (
                  <td aria-controls="actions">
                    <button className="btnInfo btn--small">Re-Broadcast</button>
                  </td>
                ) : (
                  orderStatus === "submissionAccepted" && (
                    <td aria-controls="actions">
                      <button className="btnInfo btn--small">
                        Provide feedback
                      </button>
                      <button className="btnInfo btn--small">Reviewed</button>
                    </td>
                  )
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
