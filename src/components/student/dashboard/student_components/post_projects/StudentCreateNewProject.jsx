import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import styles from "../../../../../styles/student.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import api, { getAccessToken } from "../../../../../services/api";
import { MdDelete, MdInfo } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";

export const StudentCreateNewProject = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  const { data: allAdminsEmails } = useQuery("admins-emails", async () => {
    const res = await api.get("/admin/get-all-admin-emails", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    return res.data;
  });

  const formik = useFormik({
    initialValues: {
      assignmentTitle: "",
      subject: "",
      documentType: [],
      englishLevel: "",
      style: "Apa",
      deadline: "",
      description: "",
      additionalNotes: "",
      amount: "0",
      files: [],
    },
    validationSchema: Yup.object().shape({
      assignmentTitle: Yup.string().required("Assignment title is required"),
      subject: Yup.string().required("Please select your subject"),
      documentType: Yup.array()
        .min(1, "Please select at least one document type")
        .required("Please select document type"),
      englishLevel: Yup.string().required("Please select english level"),
      style: Yup.string().required("Please select referencing style"),
      deadline: Yup.string().required("Please select deadline of assignment"),
      description: Yup.string().required("Description is required"),
      additionalNotes: Yup.string(),
      files: Yup.array()
        .min(
          1,
          "Please upload at least one document related to your assignment."
        )
        .required("Document is required"),
      amount: Yup.string(),
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
        style,
        subject,
        files,
      } = values;

      handleSubmit(values);
    },
  });
  async function handleSubmit(values) {
    const formData = new FormData();
    for (let d in values) {
      if (d === "files") {
        values[d].forEach((item) => {
          formData.append(d, item);
        });
      }
      if (d === "documentType") {
        if (values[d].length === 1) {
          values[d].forEach((item) => {
            formData.append(d, item);
            formData.append(d, "extra");
          });
        } else {
          values[d].forEach((item) => {
            formData.append(d, item);
          });
        }
      } else {
        formData.append(d, values[d]);
      }
      console.log(d, ":", values[d]);
    }
    // console.log(formData);
    try {
      console.log("1");
      let res = await api.post("/project/student-upload", formData, {
        headers: { Authorization: getAccessToken() },
      });
      // console.log("hello")
      console.log(res.data);
      navigate("/student/home");
      toast.success("Successfully project submitted.", {
        duration: 4000,
      });
      if (res.data) {
        let assignmentId = res.data?.assignedId;
        // console.log(assignmentId);
        const chunkSize = 80;
        // const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
        let AdminsEmails = [...allAdminsEmails, "websachin111@gmail.com"]
        const groups = AdminsEmails
          .map((e, i) => {
            return i % chunkSize === 0
              ? AdminsEmails.slice(i, i + chunkSize)
              : null;
          })
          .filter((e) => {
            return e;
          });
        // console.log("groups: ", groups);
        groups.forEach((checkmail) => {
          let mailData = {
            to: checkmail,
            subject: "New Assignment",
            discdescription: "Project with ID",
            description: "project uploaded by student do please check it",
            titlemail: "Project Assigned",
            maillink: assignmentId,
            hrefmail: "https://www.mymegaminds.com/",
            emaillinkmsg: "Click to View the DETAILS",
            descriptiontitlemail: "has been uploaded by student. Please review it by logging it into admin panel.",
          };
          axios
            .post(`https://nodemailer-backend.onrender.com/users`, mailData)
            .then(() => console.log("email sent"))
            .catch((e) => console.log(e));
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.\nPlease try again");
    }
  }

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

  const styleArr = ["Apa", "Harvard", "Chicago", "MLA", "Others"];

  return (
    <section className={styles.postProjectSection}>
      <h3>Create new assignment</h3>
      <div className={styles.formWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="assignment-id">Assignment id</label>
            <input
              type="text"
              id="assignment-id"
              // disabled
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
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="subject">Subjects</label>
            <select
              name="subject"
              id="subject"
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
              <div className={glassStyles.error}>{formik.errors.subject}</div>
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
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="englishLevel">English Level</label>
            <select
              name="englishLevel"
              id="englishLevel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.errors.englishLevel &&
                formik.touched.englishLevel &&
                glassStyles.errorBorder
              }
            >
              <option value="">Please select english level</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="professional">Professional</option>
            </select>
            {formik.errors.englishLevel && formik.touched.englishLevel && (
              <div className={glassStyles.error}>
                {formik.errors.englishLevel}
              </div>
            )}
          </div>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="style">Referencing Style</label>
            <select
              name="style"
              id="style"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.errors.style &&
                formik.touched.style &&
                glassStyles.errorBorder
              }
            >
              {styleArr.map((value, i) => {
                return (
                  <option key={i} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
            {formik.errors.style && formik.touched.style && (
              <div className={glassStyles.error}>{formik.errors.style}</div>
            )}
          </div>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="deadline">Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              id="deadline"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.errors.deadline &&
                formik.touched.deadline &&
                glassStyles.errorBorder
              }
            />
            {formik.errors.deadline && formik.touched.deadline && (
              <div className={glassStyles.error}>{formik.errors.deadline}</div>
            )}
          </div>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Write description here"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
                    let filesNamesArr = formik.values.files.map(({ name }) => {
                      return name;
                    });
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
            {formik.errors.files && formik.touched.files && (
              <div className={glassStyles.error}>{formik.errors.files}</div>
            )}
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
                        // console.log("deleted", filterArr);
                      }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                );
              })}
          </div>
          <div className={glassStyles.inputWrapper}>
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              name="additionalNotes"
              id="additionalNotes"
              placeholder="Addtional notes is optional"
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
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              placeholder="amount"
              disabled
            />
          </div>
          <button type="submit" className="btnPrimary btn--large">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};
