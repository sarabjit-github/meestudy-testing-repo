import React, { useState, useEffect } from "react";
import glassStyles from "../../../../../styles/glass.module.scss";
import api, { getAccessToken } from "../../../../../services/api";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { useQuery } from "react-query";
import { toast } from "react-hot-toast";
import { Loader1 } from "../../../../Loaders/Loader1";

export const TutorApplicationModal = ({ setIsTutorModalOpen, clickedTutorProjectDetails }) => {
  const assignmentModalRef = useClickOutside(() => {
    setIsTutorModalOpen(false);
  });

  // const { data, isLoading } = useQuery("tutorAppliedInfo", async()=>{
  //   const res = await api.get(`/project/get-all-applied-tutors-in-admin?assignmenteId=${clickedTutorProjectDetails.assignmentId}`, {
  //       headers: {
  //           Authorization: getAccessToken(),
  //       }
  //   })
  //   // console.log(res.data)
  //   return res.data;
  // });

  const [appliedTutors, setAppliedTutors] = useState([]);

  useEffect(() => {

    // console.log("clicke project details: ", clickedTutorProjectDetails.assignmentId);

    async function getAssingmentData() {
      const res = await api.get(`/project/get-all-applied-tutors-in-admin?assignmenteId=${clickedTutorProjectDetails.assignmentId}`, {
        headers: {
          Authorization: getAccessToken(),
        }
      })
      // console.log(res.data)
      let data = res.data;
      console.log("data: ", data);
      setAppliedTutors(data[0].appliedTutors);
    }
    getAssingmentData();
    // console.log(data);
    // const res = api.get(`/project/get-all-applied-tutors-in-admin?assignmenteId=${clickedTutorProjectDetails.assignmentId}`, {
  }, [])

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

  const handleAssignedTutor = (id) => {
    const data = {
      data: {
        orderStatus: "assigned",
        assignedTo: id,
      },
      id: clickedTutorProjectDetails._id
    }
    console.log(id);
    api
        .patch("/project/update-project-in-admin", data, {
          headers: { Authorization: getAccessToken() },
        })
        .then((res) => {
          console.log(res.data);
          toast.success("Assigned successfully.");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong, please try again.");
        });
  }

  const handleCloseModal = () => {
    setIsTutorModalOpen(false);
  };

  // if (isLoading)
  // return (
  //   // <div className={styles.loaderWrapper}>
  //     <Loader1 />
  //   // </div>
  // );
  return (
    <div className={glassStyles.modalWrapper}>
      <div ref={assignmentModalRef} className={glassStyles.tableModalBoxWrapper}>
        <div className={glassStyles.tableWrapper}>
          <table className={glassStyles.table} id="jobTable">
            <thead
            //   className={`${isTableScrolled && glassStyles.scrolledTableHead}`}
            >
              <tr>
                <th>Tutor Name</th>
                <th>Tutor Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                appliedTutors.length !== 0 && appliedTutors?.map(({ name, email, _id }, i) => {
                  return <tr key={i}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td aria-controls="actions">
                      <button className="btnInfo btn--small" onClick={() => handleAssignedTutor(_id)}>Assign</button>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
