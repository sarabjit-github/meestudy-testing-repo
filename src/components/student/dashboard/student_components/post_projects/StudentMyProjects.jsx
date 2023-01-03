import React, { useState, useEffect, useRef } from "react";
import api, { getAccessToken } from "../../../../../services/api";
import glassStyles from "../../../../../styles/glass.module.scss";
import styles from "../../../../../styles/student.module.scss";
import moment from "moment/moment";

export const StudentMyProjects = () => {
  // loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const pageRef = useRef(1);
  const limitRef = useRef(50);

  useEffect(() => {
    async function getProjects() {
      const res = await api.get(
        `/project/get-all-in-student?page=${pageRef.current}&limit=${limitRef.current}`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
      let data = res.data;
      setProjects(data.projects);
    }
    getProjects();
  }, []);

  useEffect(() => {
    let deadline = "2022-12-29T15:22:00.000Z";
    let deadlineCountry = "2022-12-26T17:29:54+0000";

    function getShortFormOfTimeZone(){
      let now = new Date(deadlineCountry).toString();
      let timeZone = now.replace(/.*[(](.*)[)].*/, "$1"); 
      let timeZoneWordsArr = timeZone.split(" ");
      let shortFormArr = timeZoneWordsArr.map((word)=>{
        return word.slice(0,1);
      })
      let shortForm = shortFormArr.join("");
    }
    getShortFormOfTimeZone();
  }, []);

  const [isTableScrolled, setIsTableScrolled] = useState(false);
  return (
    <div>
      <h2>My Projects</h2>
      <div
        className={glassStyles.tableWrapper}
        onScroll={(e) => {
          if (e.target.scrollTop > 0) {
            setIsTableScrolled(true);
          } else {
            setIsTableScrolled(false);
          }
        }}
      >
        <table className={glassStyles.table} id="jobTable">
          <thead className={`${isTableScrolled && styles.scrolledTableHead}`}>
            <tr>
              <th>Assignment Id</th>
              <th>Assignment Name</th>
              <th>Subject</th>
              <th>Deadline</th>
              <th>Student</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length !== 0 &&
              projects?.map(
                (
                  {
                    assignmentId,
                    assignmentTitle,
                    subject,
                    deadline,
                    studentName,
                    orderStatus,
                  },
                  i
                ) => {
                  return (
                    <tr key={i}>
                      <td>{assignmentId}</td>
                      <td>{assignmentTitle}</td>
                      <td>{subject}</td>
                      <td>{deadline}</td>
                      <td>{studentName}</td>
                      <td>1600</td>
                      <td>{orderStatus}</td>
                      <td aria-controls="actions">
                        {/* <button className="btnSuccess btn--small">Approve</button>
                  <button className="btnDanger btn--small">Danger</button> */}
                        <button className="btnDark btn--small">See all</button>
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
