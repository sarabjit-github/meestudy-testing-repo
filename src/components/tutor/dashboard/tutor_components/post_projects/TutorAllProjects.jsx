import React, { useState, useEffect, useContext } from "react";
import styles from "../../../../../styles/student.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import { BiSearch } from "react-icons/bi";
// import { AssignmentModal } from "./AssignmentModal";
import api, { getAccessToken } from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import userContext from "../../../../../context/userContext";
import { TutorSubmissionModal } from "./TutorSubmissionModal";
import { TutorReSubmissionModal } from "./TutorReSubmissionModal";
// import { TutorApplicationModal } from "./TutorApplicationModal";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "New Assignment",
    value: "coAdminApproved",
  },
  // {
  //   label: "Approved",
  //   value: "adminApproved",
  // },
  // {
  //   label: "Broadcasted",
  //   value: "coAdminApproved",
  // },
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
  // {
  //   label: "Cancelled",
  //   value: "adminRejected",
  // },
];
const allTabs = [
  {
    label: "All",
    value: "all",
  },
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

const fetchProjects = async (
  activeTab,
  page,
  fetchAllProjectsData,
  setFetchAllProjectsData
) => {
  if (activeTab.toLowerCase() === "all") {
    let data = api
      // .get(`/project/get-all-applied-projects-in-tutor?limit=20&page=${page}`, {
      .get(`/project/get-all-applied-projects-in-tutor`, {
        headers: {
          Authorization: getAccessToken(),
        },
      })
      .then((res) => {
        if (!fetchAllProjectsData) {
          setFetchAllProjectsData(true);
        }
        return res.data;
      });
    return data;
  } else {
    // console.log(activeTab);
    let url;
    if (activeTab === "coAdminApproved") {
      url = `/project/get-projects-for-apply-in-tutor?page=1&limit=20`;
    } else {
      url = `/project/get-applied-projects-in-tutor?page=1&filter=${activeTab}`;
    }
    const res = await api.get(
      // `/project/get-filtered-projects/${activeTab}?limit=15&page=1`,
      url,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    console.log("data custom: ", res.data);
    return res.data;
  }
};

export const TutorAllProjects = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(TABS[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [fetchAllProjectsData, setFetchAllProjectsData] = useState(false);

  // Using a query hook automatically fetches data and returns query values
  const { data, isLoading, isError, refetch, isFetching, isRefetching } =
    useQuery(["tutorProjects", currentActiveTab, "allTutorProjectsData"], () =>
      fetchProjects(
        currentActiveTab,
        currentPage,
        fetchAllProjectsData,
        setFetchAllProjectsData
      )
    );

  const { userData } = useContext(userContext);

  async function getAllProjectsData() {
    const res = await api.get("/project/get-all-applied-projects-in-tutor", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    console.log("total projects request called");
    setAllProjectsData(res.data);
    // return res.data.projects;
  }

  useEffect(() => {
    // console.log(totalProjects);
    // console.log("fetch all projects data state: ", fetchAllProjectsData);
    if (fetchAllProjectsData) {
      console.log("now you can fetch all projects data");
      getAllProjectsData();
    }
  }, [fetchAllProjectsData]);

  useEffect(() => {
    refetch();
  }, [currentActiveTab, currentPage]);

  const [isTableScrolled, setIsTableScrolled] = useState(false);
  // projects states
  const [projects, setProjects] = useState(data);
  // search states
  const [searchInput, setSearchInput] = useState("");
  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedProjectDetails, setClickedProjectDetails] = useState(null);
  const [isTutorSubmissionModalOpen, setIsTutorSubmissionModalOpen] =
    useState(false);
  const [isTutorReSubmissionModalOpen, setIsTutorReSubmissionModalOpen] = useState(false);

  useEffect(() => {
    function getSearchedProjects() {
      const filterDataByAssignmentTitle = allProjectsData?.filter(
        ({ assignmentTitle }) => {
          return assignmentTitle.toLowerCase().includes(searchInput);
        }
      );
      const filterDataByStudentName = allProjectsData?.filter(
        ({ studentName }) => {
          return studentName.toLowerCase().includes(searchInput);
        }
      );
      const filterDataBySubject = allProjectsData?.filter(({ subject }) => {
        return subject.toLowerCase().includes(searchInput);
      });
      const filterDataByOrderStatus = allProjectsData?.filter(
        ({ orderStatus }) => {
          let modifyOrderStatus = TABS.filter(({ label, value }) => {
            return value === orderStatus;
          });
          return modifyOrderStatus[0].label.toLowerCase().includes(searchInput);
        }
      );
      let allConcatData = filterDataByAssignmentTitle
        .concat(filterDataByStudentName)
        .concat(filterDataBySubject)
        .concat(filterDataByOrderStatus);
      const allFilterData = Array.from(new Set(allConcatData));
      // console.log("allFilterData: ", allFilterData);
      setProjects(allFilterData);
    }
    if (searchInput !== "") {
      getSearchedProjects();
    } else {
      setProjects(data);
    }
  }, [searchInput, data]);

  function getBetterDateTime(fakeFullDate) {
    let betterDate = new Date(fakeFullDate).toGMTString().slice(5, 17);
    let betterTime = new Date(fakeFullDate).toLocaleTimeString();
    // get short form of timezone
    let now = new Date(fakeFullDate).toString();
    let timeZone = now.replace(/.*[(](.*)[)].*/, "$1");
    let timeZoneWordsArr = timeZone.split(" ");
    let shortFormArr = timeZoneWordsArr.map((word) => {
      return word.slice(0, 1);
    });
    let shortForm = shortFormArr.join("");

    let betterFullDate = `${betterDate} ${betterTime} ${shortForm}`;
    return betterFullDate;
  }

  const handleProjectModal = (
    assignmentId,
    assignmentTitle,
    subject,
    deadline,
    studentName,
    orderStatus,
    desc,
    additionalNotes,
    createdAt,
    assignTo = "",
    _id
  ) => {
    setClickedProjectDetails({
      assignmentId,
      assignmentTitle,
      subject,
      deadline,
      studentName,
      orderStatus,
      desc,
      additionalNotes,
      createdAt,
      assignTo,
      _id,
    });
    setIsModalOpen(true);
  };

  const handleOpenTutorSubmissionModal = (project) => {
    setClickedProjectDetails(project);
    setIsTutorSubmissionModalOpen(true);
  };
  const handleReSubmitAssignmentModal = (project)=>{
    setClickedProjectDetails(project);
    setIsTutorReSubmissionModalOpen(true);
  }

  const handleApplyTutorAssignment = (project) => {
    // setIsTutorModalOpen(true);
    // tutor name, id, email
    const data = {
      data: {
        appliedTutors: [...project.appliedTutors, userData?._id],
      },
      id: project._id,
    };
    console.log(data);
    api
      .patch("/project/update-project-in-tutor", data, {
        headers: { Authorization: getAccessToken() },
      })
      .then((res) => {
        // console.log(res.data);
        toast.success("Assignment applied successfully.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again.");
      });
  };

  const handleApprovedAssignment = async (id) => {
    const data = {
      data: {
        orderStatus: "adminApproved",
      },
      id: id,
    };
    api
      .patch("/project/update-project-in-admin", data, {
        headers: { Authorization: getAccessToken() },
      })
      .then((res) => {
        // console.log(res.data);
        toast.success("Assignment approved successfully.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again.");
      });
  };
  const handleCancelledAssignment = async (id) => {
    const data = {
      data: {
        orderStatus: "adminRejected",
      },
      id: id,
    };
    api
      .patch("/project/update-project-in-admin", data, {
        headers: { Authorization: getAccessToken() },
      })
      .then((res) => {
        // console.log(res.data);
        toast.success("Assignment cancelled successfully.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again.");
      });
  };
  const handleBroadcastedAssignment = async (id) => {
    const data = {
      data: {
        orderStatus: "coAdminApproved",
      },
      id: id,
    };
    api
      .patch("/project/update-project-in-admin", data, {
        headers: { Authorization: getAccessToken() },
      })
      .then((res) => {
        // console.log(res.data);
        toast.success("Assignment broadcasted successfully.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, please try again.");
      });
  };

  if (isLoading)
    return (
      <div className={styles.loaderWrapper}>
        <Loader1 />
      </div>
    );
  if (isError)
    return (
      <div className={styles.loaderWrapper}>
        <div>
          <h2>{isError?.message || "Some error occured."}</h2>
          <br />
          <Link to={-1} className="btnDark btn--medium">
            Go back
          </Link>
        </div>
      </div>
    );

  return (
    <>
      {isTutorSubmissionModalOpen && (
        <TutorSubmissionModal
          setIsTutorSubmissionModalOpen={setIsTutorSubmissionModalOpen}
          clickedProjectDetails={clickedProjectDetails}
        />
      )}
      {isTutorReSubmissionModalOpen && (
        <TutorReSubmissionModal
          setIsTutorReSubmissionModalOpen={setIsTutorReSubmissionModalOpen}
          clickedProjectDetails={clickedProjectDetails}
        />
      )}
      
      <div>
        <h2 style={{ textAlign: "center" }}>All Projects</h2>
        <header className={glassStyles.tabsWrapper}>
          {TABS.map(({ label, value }, i) => {
            return (
              <div
                key={i}
                className={`${glassStyles.tab} ${
                  currentActiveTab === value && glassStyles.activeTab
                }`}
                title={label}
                onClick={() => setCurrentActiveTab(value)}
              >
                {label}
              </div>
            );
          })}
        </header>
        <div className={styles.searchSection}>
          <div
            className={`${glassStyles.inputWrapper} ${glassStyles.searchWrapper}`}
          >
            <input
              type="text"
              placeholder="Search here"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button title="Search">
              <BiSearch />
            </button>
          </div>
        </div>
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
            <thead
              className={`${isTableScrolled && glassStyles.scrolledTableHead}`}
            >
              <tr>
                <th>Assignment Id</th>
                <th>Assignment Name</th>
                <th>Subject</th>
                <th>Deadline</th>
                <th>Student</th>
                <th>Assigned to</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects?.length !== 0 &&
                projects?.map((project) => {
                  let {
                    assignmentId,
                    assignmentTitle,
                    subject,
                    deadline,
                    studentName,
                    orderStatus,
                    description,
                    additionalNotes,
                    createdAt,
                    _id,
                  } = project;
                  let myDate = getBetterDateTime(deadline);
                  let modifyOrderStatus = allTabs.filter(({ label, value }) => {
                    return value === orderStatus;
                  });
                  return (
                    <tr key={assignmentId}>
                      <td>
                        <button
                          className={glassStyles.tableIdButton}
                          onClick={() => {
                            let desc = description || "";
                            let assignTo = "qp";
                            handleProjectModal(
                              assignmentId,
                              assignmentTitle,
                              subject,
                              deadline,
                              studentName,
                              orderStatus,
                              desc,
                              additionalNotes,
                              createdAt,
                              assignTo,
                              _id
                            );
                          }}
                        >
                          {assignmentId || "BIO_Neha_20222212_001542"}
                        </button>
                      </td>
                      <td>{assignmentTitle}</td>
                      <td>{subject}</td>
                      <td>{myDate}</td>
                      <td>{studentName}</td>
                      <td>xyz</td>
                      <td>0</td>
                      <td>{modifyOrderStatus[0].label || "Unknown"}</td>
                      {orderStatus === "newAssignment" ? (
                        <td aria-controls="actions">
                          <button
                            className="btnSuccess btn--small"
                            onClick={() => handleApprovedAssignment(_id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btnDanger btn--small"
                            onClick={() => handleCancelledAssignment(_id)}
                          >
                            Cancel
                          </button>
                        </td>
                      ) : orderStatus === "adminRejected" ? (
                        <td aria-controls="actions">
                          <button
                            className="btnDark btn--small"
                            onClick={() => {
                              let desc = description || "";
                              let assignTo = "qp";
                              handleProjectModal(
                                assignmentId,
                                assignmentTitle,
                                subject,
                                deadline,
                                studentName,
                                orderStatus,
                                desc,
                                additionalNotes,
                                createdAt,
                                assignTo,
                                _id
                              );
                            }}
                          >
                            View
                          </button>
                        </td>
                      ) : orderStatus === "adminApproved" ? (
                        <td aria-controls="actions">
                          <button
                            className="btnInfo btn--small"
                            onClick={() => handleBroadcastedAssignment(_id)}
                          >
                            Broadcast
                          </button>
                        </td>
                      ) : orderStatus === "assignmentSubmitted" ? (
                        <td aria-controls="actions">
                          <button
                            className="btnInfo btn--small"
                          >
                            View submission
                          </button>
                          
                        </td>
                      ) : orderStatus === "coAdminApproved" ? (
                        <td aria-controls="actions">
                          <button
                            className="btnInfo btn--small"
                            onClick={() => handleApplyTutorAssignment(project)}
                          >
                            Apply now
                          </button>
                          {/* <button className="btnInfo btn--small">
                              Notify
                            </button> */}
                        </td>
                      ) : orderStatus === "assigned" ? (
                        <td aria-controls="actions">
                          <button
                            className="btnInfo btn--small"
                            onClick={() =>
                              handleOpenTutorSubmissionModal(project)
                            }
                          >
                            Submit
                          </button>
                        </td>
                      ) : orderStatus === "submissionRejected" ? (
                        <td aria-controls="actions">
                          <button
                            className="btnInfo btn--small"
                            onClick={() => handleReSubmitAssignmentModal(project)}
                          >
                            Re-Submit
                          </button>
                        </td>
                      ) : (
                        orderStatus === "submissionAccepted" && (
                          <td aria-controls="actions">
                            <button className="btnInfo btn--small">
                              View Review
                            </button>
                            
                          </td>
                        )
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className={glassStyles.paginationWrapper}>
          {/* <button className={glassStyles.paginationButtonNext} disabled={true}>
            Prev
          </button>
          <button className={glassStyles.paginationButtonNext}>Next</button> */}
          {currentActiveTab.toLowerCase() === "all" &&
            [1, 2].map((page, i) => {
              return (
                <button
                  key={i}
                  style={{
                    backgroundColor: currentPage === page ? "white" : "",
                  }}
                  className={glassStyles.paginationButton}
                  onClick={() => {
                    console.log(page);
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </button>
              );
            })}
          {/* <button className={glassStyles.paginationButton}>1</button>
          <button className={glassStyles.paginationButton}>2</button> */}
          {/* <button className={glassStyles.paginationButtonNext}>Last</button> */}
        </div>
      </div>
    </>
  );
};
