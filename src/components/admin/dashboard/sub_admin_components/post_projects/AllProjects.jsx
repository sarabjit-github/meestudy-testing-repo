import React, { useState, useEffect, useContext, useCallback } from "react";
import styles from "../../../../../styles/student.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import { BiSearch } from "react-icons/bi";
import { AssignmentModal } from "./AssignmentModal";
import api, { getAccessToken } from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { TutorApplicationModal } from "./TutorApplicationModal";
import { IoMdArrowDropdown } from "react-icons/io";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import { TutorSubmissionViewModal } from "./TutorSubmissionViewModal";
import { ProvideFeedbackModal } from "./ProvideFeedbackModal";

const TABS = [
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

const perPageValuesArray = [5, 20, 60, 80, 100];

const fetchProjects = async (
  activeTab,
  page,
  fetchAllProjectsData,
  setFetchAllProjectsData,
  limit
) => {
  if (activeTab.toLowerCase() === "all") {
    console.log(`page before api hit: ${page}`);
    let data = api
      .get(`/project/get-all-projects?limit=${limit}&page=${page}`, {
        headers: {
          Authorization: getAccessToken(),
        },
      })
      .then((res) => {
        if (!fetchAllProjectsData) {
          setFetchAllProjectsData(true);
        }
        // console.log(`page when fetching data: ${page}`);
        console.log("all projects data: ", res.data);
        return {
          projects: res.data.projects,
          projectCount: res.data.projectCount,
        };
      });
    return data;
  } else {
    const res = await api.get(
      `/project/get-filtered-projects/${activeTab}?limit=${limit}&page=${page}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    console.log("filter data: ", res.data);
    return { projects: res.data.projects, projectCount: res.data.projectCount };
  }
};

const AllProjects = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(TABS[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [fetchAllProjectsData, setFetchAllProjectsData] = useState(false);
  const [limit, setLimit] = useState(perPageValuesArray[0]);
  const [isActivePerPageDropdownOpen, setIsActivePerPageDropdownOpen] =
    useState(false);
  // Using a query hook automatically fetches data and returns query values
  const { data, isLoading, isError, refetch, isFetching, isRefetching } =
    useQuery(["projects", currentActiveTab], () =>
      fetchProjects(
        currentActiveTab,
        currentPage,
        fetchAllProjectsData,
        setFetchAllProjectsData,
        limit
      ),{
        refetchOnWindowFocus: false,
      }
    );

  // pagination states
  const [totalProjectsCount, setTotalProjectsCount] = useState(
    data?.projectCount || 0
  );
  const [totalPages, setTotalPages] = useState([1]);

  const [isTableScrolled, setIsTableScrolled] = useState(false);
  // projects states
  const [projects, setProjects] = useState(data?.projects || []);
  // search states
  const [searchInput, setSearchInput] = useState("");
  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedProjectDetails, setClickedProjectDetails] = useState(null);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [clickedTutorProjectDetails, setClickedTutorProjectDetails] =
    useState(null);
  const [isTutorSubmissionViewModalOpen, setIsTutorSubmissionViewModalOpen] =
    useState(false);
  const [isProvideFeedbackModalOpen, setIsProvideFeedbackModalOpen] =
    useState(false);

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
      // const filterDataByAssignTo = allProjectsData?.filter(
      //   ({ orderStatus }) => {
      //     let modifyOrderStatus = TABS.filter(({ label, value }) => {
      //       return value === orderStatus;
      //     });
      //     return modifyOrderStatus[0].label.toLowerCase().includes(searchInput);
      //   }
      // );
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
      setProjects(data?.projects);
    }
  }, [searchInput, data]);

  async function getAllProjectsData() {
    const res = await api.get("/project/get-all-in-admin", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    setAllProjectsData(res.data.projects);
  }

  useEffect(() => {
    setTotalProjectsCount(data?.projectCount);
    setProjects(data?.projects);
  }, [data]);

  // get total pages
  useEffect(() => {
    if (totalProjectsCount > limit) {
      let totalPagesInteger = Math.ceil(totalProjectsCount / limit);
      let pagesArr = [];
      for (let i = 0; i < totalPagesInteger; i++) {
        pagesArr.push(i + 1);
      }
      setTotalPages(pagesArr);
      // console.log("total pages: ", pagesArr);
    } else {
      setTotalPages([1]);
      setCurrentPage(1);
    }
  }, [limit, totalProjectsCount]);

  // assume if user select limit=5 (5 projects per page) and total project count will be 50
  // so there 10 page will be made, if user is currently on 7th page and he change the limit from 5 to 20 (projects per page) then on what page user will redirect?
  // solution:
  // useEffect(() => {
  //   if(totalPages[totalPages.length-1] < currentPage){
  //     setCurrentPage(totalPages[totalPages.length-1]);
  //     console.log("yeah i caught you");
  //   }
  // }, [limit, totalPages, currentPage]);

  useEffect(() => {
    console.log(`Current page: ${currentPage}\nCurrent limit: ${limit}`);
  }, [currentPage, limit]);

  const [i, setI] = useState(0);
  useEffect(() => {
    setI(i+1);
    refetch();
    console.log(`refetch ${i} times\nCurrent page before refetch: ${currentPage}`)
  }, [currentActiveTab, currentPage, limit, refetch]);
  // whenever tab change set current page = 1 and clear search input field
  useEffect(() => {
    setSearchInput("");
    setCurrentPage(1);
  }, [currentActiveTab]);

  useEffect(() => {
    if (fetchAllProjectsData) {
      // console.log("now you can fetch all projects data");
      getAllProjectsData();
    }
  }, [fetchAllProjectsData]);

  const activePerPageDropdownRef = useClickOutside(() =>
    setIsActivePerPageDropdownOpen(false)
  );

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

  const handleProjectModal = (project) => {
    setClickedProjectDetails(project);
    setIsModalOpen(true);
  };

  const handleOpenTutorApplicationModal = (project) => {
    setIsTutorModalOpen(true);
    setClickedTutorProjectDetails(project);
  };

  const handleOpenTutorSubmissionViewModalOpen = (project) => {
    setClickedProjectDetails(project);
    setIsTutorSubmissionViewModalOpen(true);
  };

  const handleProvideFeedbackModal = (project) => {
    setClickedProjectDetails(project);
    setIsProvideFeedbackModalOpen(true);
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
      {isModalOpen && (
        <AssignmentModal
          setIsModalOpen={setIsModalOpen}
          projectDetails={clickedProjectDetails}
        />
      )}
      {isTutorModalOpen && (
        <TutorApplicationModal
          setIsTutorModalOpen={setIsTutorModalOpen}
          clickedTutorProjectDetails={clickedTutorProjectDetails}
        />
      )}
      {isTutorSubmissionViewModalOpen && (
        <TutorSubmissionViewModal
          setIsTutorSubmissionViewModalOpen={setIsTutorSubmissionViewModalOpen}
          clickedProjectDetails={clickedProjectDetails}
        />
      )}
      {isProvideFeedbackModalOpen && (
        <ProvideFeedbackModal
          setIsProvideFeedbackModalOpen={setIsProvideFeedbackModalOpen}
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
        <div className={glassStyles.searchSection}>
          <div className={glassStyles.dropdownWrapper}>
            <button
              className={glassStyles.dropdownButton}
              disabled={searchInput}
              onClick={() =>
                setIsActivePerPageDropdownOpen(!isActivePerPageDropdownOpen)
              }
            >
              {limit} per page
              <IoMdArrowDropdown />
            </button>
            <AnimatePresence>
              {isActivePerPageDropdownOpen && (
                <motion.div
                  ref={activePerPageDropdownRef}
                  className={glassStyles.dropdownList}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  {perPageValuesArray.map((value, i) => {
                    return (
                      <button
                        key={i}
                        style={{
                          backgroundColor:
                            limit === value ? "rgba(0,0,0,0.05)" : "",
                        }}
                        disabled={searchInput}
                        onClick={() => {
                          setLimit(value);
                          setIsActivePerPageDropdownOpen(false);
                        }}
                      >
                        {value} per page
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                <th>TPayment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {isRefetching ? (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <Loader1 />
              </span>
            ) : (
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
                    let modifyOrderStatus = TABS.filter(({ label, value }) => {
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
                              handleProjectModal(project);
                            }}
                          >
                            {assignmentId || "Assignment id"}
                          </button>
                        </td>
                        <td>{assignmentTitle}</td>
                        <td>{subject}</td>
                        <td>{myDate}</td>
                        <td>{studentName}</td>
                        <td>xyz</td>
                        <td>1600</td>
                        <td>{modifyOrderStatus[0].label}</td>
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
                                handleProjectModal(project);
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
                              onClick={() =>
                                handleOpenTutorSubmissionViewModalOpen(project)
                              }
                            >
                              View submission
                            </button>
                            <button
                              className="btnInfo btn--small"
                              onClick={() => handleBroadcastedAssignment(_id)}
                            >
                              Re-Broadcast
                            </button>
                          </td>
                        ) : orderStatus === "coAdminApproved" ? (
                          <td aria-controls="actions">
                            <button
                              className="btnInfo btn--small"
                              onClick={() =>
                                handleOpenTutorApplicationModal(project)
                              }
                            >
                              View applications
                            </button>
                            {/* <button className="btnInfo btn--small">
                              Notify
                            </button> */}
                          </td>
                        ) : orderStatus === "assigned" ? (
                          <td aria-controls="actions">
                            <button className="btnDanger btn--small">
                              Un-assigned Tutor
                            </button>
                            <button
                              className="btnInfo btn--small"
                              onClick={() => handleBroadcastedAssignment(_id)}
                            >
                              Re-Broadcast
                            </button>
                          </td>
                        ) : orderStatus === "submissionRejected" ? (
                          <td aria-controls="actions">
                            <button
                              className="btnInfo btn--small"
                              onClick={() => handleBroadcastedAssignment(_id)}
                            >
                              Re-Broadcast
                            </button>
                          </td>
                        ) : (
                          orderStatus === "submissionAccepted" && (
                            <td aria-controls="actions">
                              <button
                                className="btnInfo btn--small"
                                onClick={() =>
                                  handleProvideFeedbackModal(project)
                                }
                              >
                                Provide feedback
                              </button>
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
        <div className={glassStyles.paginationWrapper}>
          {totalPages.length > 1 &&
            currentPage !== totalPages[0] &&
            !searchInput && (
              <button
                className={glassStyles.paginationButtonNext}
                onClick={() => setCurrentPage(currentPage - 1)}
                title="Previous page"
              >
                Prev
              </button>
            )}
          {!searchInput &&
            totalPages?.map((page, i) => {
              return (
                <button
                  key={i}
                  style={{
                    backgroundColor: currentPage === page ? "white" : "",
                  }}
                  className={glassStyles.paginationButton}
                  onClick={() => {
                    // console.log(page);
                    setCurrentPage(page);
                  }}
                  title={`Page ${page}`}
                >
                  {page}
                </button>
              );
            })}
          {/* <button className={glassStyles.paginationButton}>1</button>
          <button className={glassStyles.paginationButton}>2</button> */}
          {totalPages.length > 1 &&
            !searchInput &&
            currentPage !== totalPages[totalPages.length - 1] && (
              <button
                className={glassStyles.paginationButtonNext}
                onClick={() => setCurrentPage(currentPage + 1)}
                title="Next page"
              >
                Next
              </button>
            )}
        </div>
      </div>
    </>
  );
};

export default AllProjects;