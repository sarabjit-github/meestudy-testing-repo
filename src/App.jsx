import { useState, useEffect } from "react";
import { Route, Routes, useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { LoginStudent } from "./pages/LoginStudent";
import { RegisterStudent } from "./pages/RegisterStudent";
import { RegisterTutor } from "./pages/RegisterTutor";
import "./styles/global.scss";
// import AlertState from "./context/Alert/alertState";s
import api, { getAccessToken, SOCKET_BASE_URL } from "./services/api";
import userContext from "./context/userContext";
import { LoginTutor } from "./pages/LoginTutor";
import { LoginAdmin } from "./pages/LoginAdmin";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { Homepage } from "./pages/Homepage";
import styles from "./styles/app.module.scss";
import { Toaster } from "react-hot-toast";
import { About } from "./pages/About";
import ResetPassword from "./pages/ResetPassword";
import { AdminForgotPassword } from "./components/auth/AdminForgotPassword";
import { SuperAdminDashboard } from "./components/admin/dashboard/SuperAdminDashboard";
import { SuperAdminHome } from "./components/admin/dashboard/super_admin_components/SuperAdminHome";
import { SessionShedule } from "./components/admin/dashboard/super_admin_components/SessionShedule";
import { PersonalDetails } from "./components/admin/dashboard/super_admin_components/PersonalDetails";
import { ApprovedTutors } from "./components/admin/dashboard/super_admin_components/tutors/ApprovedTutors";
import { RejectedTutors } from "./components/admin/dashboard/super_admin_components/tutors/RejectedTutors";
import { RegisteredUnapprovedTutors } from "./components/admin/dashboard/super_admin_components/tutors/RegisteredUnapproved";
import { TutorPayment } from "./components/admin/dashboard/super_admin_components/tutors/TutorPayment";
import { TutorSessionHistory } from "./components/admin/dashboard/super_admin_components/tutors/TutorSessionHistory";
import { ViewAllStudents } from "./components/admin/dashboard/super_admin_components/students/ViewAllStudents";
import { StudentPayment } from "./components/admin/dashboard/super_admin_components/students/StudentPayment";
import { StudentsSessionHistory } from "./components/admin/dashboard/super_admin_components/students/StudentsSessionHistory";
import { SuperAdminMaps } from "./components/admin/dashboard/super_admin_components/SuperAdminMaps";
import { SuperAdminQuery } from "./components/admin/dashboard/super_admin_components/SuperAdminQuery";
import { SuperAdminTestResults } from "./components/admin/dashboard/super_admin_components/SuperAdminTestResults";
import { Create_CoAdmin_SubAdmin } from "./components/admin/dashboard/super_admin_components/Create_CoAdmin_SubAdmin";
import { ViewAllAdmins } from "./components/admin/dashboard/super_admin_components/ViewAllAdmins";
import { AllProjects } from "./components/admin/dashboard/super_admin_components/post_projects/AllProjects";
import { ActivityLog } from "./components/admin/dashboard/super_admin_components/ActivityLog";
import { SuperAdminPayments } from "./components/admin/dashboard/super_admin_components/SuperAdminPayments";
import AddSubject from "./components/admin/dashboard/super_admin_components/addData/AddSubject";
import AddJobs from "./components/admin/dashboard/super_admin_components/addData/AddJobs";
import AddCountry from "./components/admin/dashboard/super_admin_components/addData/AddCountry";
import Career from "./pages/Career";
import JobDescription from "./pages/JobDescription";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { SuperAdminApplicants } from "./components/admin/dashboard/super_admin_components/applicants/SuperAdminApplicants";

// import AdminChat from "./pages/AdminChat";
// import StudentChatPage from "./pages/StudentChatPage";
import StudentChat from "./components/student/dashboard/chat/StudentChat";
import AdminStudentChat from "./components/admin/dashboard/super_admin_components/adminChat/adminStudentChat/AdminStudentChat";
import AdminTutorChat from "./components/admin/dashboard/super_admin_components/adminChat/adminTutorChat/AdminTutorChat";
import { StudentDashboard } from "./components/student/dashboard/StudentDashboard";
import { StudentHome } from "./components/student/dashboard/student_components/StudentHome";
import { StudentPersonalDetails } from "./components/student/dashboard/student_components/StudentPersonalDetails";
import { StudentJoinRoom } from "./components/student/dashboard/student_components/StudentJoinRoom";
import { StudentGroupRoom } from "./components/student/dashboard/student_components/StudentGroupRoom";
import { StudentEnterSession } from "./components/student/dashboard/student_components/StudentEnterSession";
import { StudentMyProjects } from "./components/student/dashboard/student_components/post_projects/StudentMyProjects";
import { SuperAdminApplicantsHome } from "./components/admin/dashboard/super_admin_components/applicants/SuperAdminApplicantsHome";
import { StudentCreateNewProject } from "./components/student/dashboard/student_components/post_projects/StudentCreateNewProject";
import { TutorDashboard } from "./components/tutor/dashboard/TutorDashboard";
import { TutorHome } from "./components/tutor/dashboard/tutor_components/TutorHome";
import { TutorPersonalDetails } from "./components/tutor/dashboard/tutor_components/TutorPersonalDetails";
import { TutorJoinRoom } from "./components/tutor/dashboard/tutor_components/TutorJoinRoom";
import { TutorGroupRoom } from "./components/tutor/dashboard/tutor_components/TutorGroupRoom";
import { TutorTakeTest } from "./components/tutor/dashboard/tutor_components/TutorTakeTest";
import { TutorEnterSession } from "./components/tutor/dashboard/tutor_components/TutorEnterSession";
import { TutorAllProjects } from "./components/tutor/dashboard/tutor_components/post_projects/TutorAllProjects";
import { TutorChat } from "./components/tutor/dashboard/tutor_components/TutorChat/TutorChat";
import Camera from "./components/camera/Camera";
import Video from "./components/camera/Video";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { AdminDashboard } from "./components/admin/dashboard/AdminDashboard";
import { AdminHome } from "./components/admin/dashboard/admin_components/AdminHome";
import { CoAdminDashboard } from "./components/admin/dashboard/CoAdminDasboard";
import { CoAdminHome, CoAdminSessionShedule, CoAdminPersonalDetails, CoAdminMaps, CoAdminQuery, CoAdminTestResults, CoAdminPayments, CoAdminAllProjects } from "./components/admin/dashboard/co_admin_components";
import { SubAdminDashboard } from "./components/admin/dashboard/SubAdminDashboard";
import { SubAdminAllProjects, SubAdminHome, SubAdminMaps, SubAdminPayments, SubAdminPersonalDetails, SubAdminQuery, SubAdminSessionShedule, SubAdminTestResults } from "./components/admin/dashboard/sub_admin_components";
import StudentsGroups from "./components/admin/dashboard/super_admin_components/createGroups/StudentsGroups";
import TutorGroups from "./components/admin/dashboard/super_admin_components/createGroups/TutorGroups";


function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState()
  const location = useLocation();
  const [userData, setUserData] = useState();
  const navigate = useNavigate()

  async function check_previous_session(token, skt) {

    try {
      const { data } = await api.get("user/me", { headers: { Authorization: token } })
      setUserData(data)

      if (location.pathname === "/") {
        if (data.userType === "Student") {
          skt.emit("student_admin_go_online", data?._id)
          navigate("/student")
        }
        else if (data.userType === "Tutor") {
          skt.emit("tutor_admin_go_online", data?._id)
          navigate("/tutor")
        } else if (data.userType === "Admin" || data.userType === "Co-Admin" || data.userType === "Sub-Admin" || data.userType === "Super-Admin") {
          navigate("/super-admin")
        }
      }
    } catch (err) {
      console.log(err)
    }

  }


  useEffect(() => {
    const skt = io(SOCKET_BASE_URL)
    setSocket(skt)
    const token = getAccessToken()
    if (token === null) return;
    check_previous_session(token, skt)

  }, [])

  const Compilation_admin_subdomain = () =>
    window.location.host.split(".")[0] === "admin" ? (
      <LoginAdmin />
    ) : (
      <Homepage />
    );


  const logout = async () => {
    try {
      const res = await api.post("user/handle-logout-updates", {}, {
        headers: {
          Authorization: getAccessToken()
        }
      })
      if (userData.userType === "Student") {
        socket.emit("student_admin_go_offline", userData?._id)
      } else if (userData.userType === "Tutor") {
        socket.emit("tutor_admin_go_offline", userData?._id)
      }
      localStorage.removeItem("access_token")
      setUserData()
      toast.success("loggedout successfully", {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--success-color)" },
      });
    } catch (err) {
      console.log(err)
    }
    navigate("/")
  };

  return (
    <userContext.Provider
      value={{ userData, setUserData, user, setUser, logout, socket, setSocket }}
    >
      <div className="App">
        <main className={location.pathname === "/" ? styles.main : ""}>
          <Routes>
            <Route path="/" element={<Compilation_admin_subdomain />} />
            <Route path="/login/admin" element={<LoginAdmin />} />
            <Route path="/login/student" element={<LoginStudent />} />
            <Route path="/login/tutor" element={<LoginTutor />} />
            <Route path="/register/student" element={<RegisterStudent />} />
            <Route path="/register/tutor" element={<RegisterTutor />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/video" element={<Video />} />
            <Route
              path="/admin-forgot-password"
              element={<AdminForgotPassword />}
            />
            <Route path="/career" element={<Career />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/jobDescription/:id" element={<JobDescription />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/reset-password/:token1/:token2/:token3"
              element={<ResetPassword />}
            />
            {/* ************************ */}
            // Dashboard Super Admin Routes
            {userData ? (
              userData?.userType == "Super-Admin" ? (
                <Route path="/super-admin" element={<SuperAdminDashboard />}>
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<SuperAdminHome />} />
                  <Route path="session-shedule" element={<SessionShedule />} />
                  <Route
                    path="personal-details"
                    element={<PersonalDetails />}
                  />
                  <Route path="add-country" element={<AddCountry />} />
                  <Route path="add-subject" element={<AddSubject />} />
                  <Route path="add-jobs" element={<AddJobs />} />
                  <Route path="student-groups" element={<StudentsGroups />} />
                  <Route path="tutor-groups" element={<TutorGroups />} />
                  // tutors start
                  <Route path="approved-tutors" element={<ApprovedTutors />} />
                  <Route path="rejected-tutors" element={<RejectedTutors />} />
                  <Route
                    path="registered-unapproved-tutors"
                    element={<RegisteredUnapprovedTutors />}
                  />
                  <Route path="tutors-payment" element={<TutorPayment />} />
                  <Route
                    path="tutors-session-history"
                    element={<TutorSessionHistory />}
                  />
                  <Route path="admin-tutor-chat" element={<AdminTutorChat />} />
                  // tutors end // students start
                  <Route
                    path="view-all-students"
                    element={<ViewAllStudents />}
                  />
                  <Route path="admin-student-chat" element={<AdminStudentChat />} />
                  <Route path="students-payment" element={<StudentPayment />} />
                  <Route
                    path="students-session-history"
                    element={<StudentsSessionHistory />}
                  />
                  // students end
                  <Route path="maps" element={<SuperAdminMaps />} />
                  <Route path="query" element={<SuperAdminQuery />} />
                  <Route
                    path="test-results"
                    element={<SuperAdminTestResults />}
                  />
                  <Route
                    path="create-coadmin-subadmin"
                    element={<Create_CoAdmin_SubAdmin />}
                  />
                  <Route path="view-all-admins" element={<ViewAllAdmins />} />
                  <Route path="all-projects" element={<AllProjects />} />
                  <Route path="activity-log" element={<ActivityLog />} />
                  <Route path="payments" element={<SuperAdminPayments />} />
                  <Route
                    path="job-applicants"
                    element={<SuperAdminApplicantsHome />}
                  />
                  <Route
                    path="job-applicants/applicants/:jobId"
                    element={<SuperAdminApplicants />}
                  />
                </Route>
              ) : (
                "404 page not found."
              )
            ) : (
              ""
            )}
            {/* ************************ */}
            // Dashboard Admin Routes (all routes similar to the SuperAdmin
            routes)
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="session-shedule" element={<SessionShedule />} />
              <Route path="personal-details" element={<PersonalDetails />} />
              <Route path="add-country" element={<AddCountry />} />
              <Route path="add-subject" element={<AddSubject />} />
              <Route path="add-jobs" element={<AddJobs />} />
              // tutors start
              <Route path="approved-tutors" element={<ApprovedTutors />} />
              <Route path="rejected-tutors" element={<RejectedTutors />} />
              <Route
                path="registered-unapproved-tutors"
                element={<RegisteredUnapprovedTutors />}
              />
              <Route path="tutors-payment" element={<TutorPayment />} />
              <Route
                path="tutors-session-history"
                element={<TutorSessionHistory />}
              />
              <Route path="admin-tutor-chat" element={<AdminTutorChat />} />
              // tutors end // students start
              <Route path="view-all-students" element={<ViewAllStudents />} />
              <Route path="admin-chat" element={<AdminStudentChat />} />
              <Route path="students-payment" element={<StudentPayment />} />
              <Route
                path="students-session-history"
                element={<StudentsSessionHistory />}
              />
              <Route path="admin-student-chat" element={<AdminStudentChat />} />
              // students end
              <Route path="maps" element={<SuperAdminMaps />} />
              <Route path="query" element={<SuperAdminQuery />} />
              <Route path="test-results" element={<SuperAdminTestResults />} />
              <Route
                path="create-coadmin-subadmin"
                element={<Create_CoAdmin_SubAdmin />}
              />
              <Route path="view-all-admins" element={<ViewAllAdmins />} />
              <Route path="all-projects" element={<AllProjects />} />
              <Route path="activity-log" element={<ActivityLog />} />
              <Route path="payments" element={<SuperAdminPayments />} />
              <Route
                path="job-applicants"
                element={<SuperAdminApplicantsHome />}
              />
              <Route
                path="job-applicants/applicants/:jobId"
                element={<SuperAdminApplicants />}
              />
            </Route>
            {/* ************************ */}
            // Dashboard Co-Admin Routes
            <Route path="/co-admin" element={<CoAdminDashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<CoAdminHome />} />
              <Route path="session-shedule" element={<CoAdminSessionShedule />} />
              <Route path="personal-details" element={<CoAdminPersonalDetails />} />
              // tutors routes start (rendering same components as super-admin tutor components)
              <Route path="approved-tutors" element={<ApprovedTutors />} />
              <Route path="rejected-tutors" element={<RejectedTutors />} />
              <Route
                path="registered-unapproved-tutors"
                element={<RegisteredUnapprovedTutors />}
              />
              <Route path="tutors-payment" element={<TutorPayment />} />
              <Route
                path="tutors-session-history"
                element={<TutorSessionHistory />}
              />
              <Route path="coadmin-tutor-chat" element={<AdminTutorChat />} />
              // tutors routes end
              <Route path="maps" element={<CoAdminMaps />} />
              <Route path="query" element={<CoAdminQuery />} />
              <Route path="test-results" element={<CoAdminTestResults />} />
              <Route path="all-projects" element={<CoAdminAllProjects />} />
              <Route path="payments" element={<CoAdminPayments />} />
            </Route>
            {/* ************************ */}
            // Dashboard Sub-Admin Routes
            <Route path="/sub-admin" element={<SubAdminDashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<SubAdminHome />} />
              <Route path="session-shedule" element={<SubAdminSessionShedule />} />
              <Route path="personal-details" element={<SubAdminPersonalDetails />} />
              <Route path="subadmin-student-chat" element={<AdminStudentChat />} />
              // students routes start (rendering same components as super-admin students components)
              <Route path="view-all-students" element={<ViewAllStudents />} />
              {/* <Route path="admin-chat" element={<AdminChat />} /> */}
              <Route path="students-payment" element={<StudentPayment />} />
              <Route
                path="students-session-history"
                element={<StudentsSessionHistory />}
              />
              // students routes end
              <Route path="maps" element={<SubAdminMaps />} />
              <Route path="query" element={<SubAdminQuery />} />
              <Route path="test-results" element={<SubAdminTestResults />} />
              <Route path="all-projects" element={<SubAdminAllProjects />} />
              <Route path="payments" element={<SubAdminPayments />} />
            </Route>
            {/* ************************ */}
            // Dashboard Student Routes
            <Route path="/student" element={<StudentDashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<StudentHome />} />
              <Route path="chat" element={<StudentChat />} />
              <Route
                path="personal-details"
                element={<StudentPersonalDetails />}
              />
              <Route path="join-room" element={<StudentJoinRoom />} />
              <Route path="group-room" element={<StudentGroupRoom />} />
              <Route
                path="session-history"
                element={<StudentsSessionHistory />}
              />
              <Route path="enter-session" element={<StudentEnterSession />} />
              <Route
                path="create-new-project"
                element={<StudentCreateNewProject />}
              />
              <Route path="my-projects" element={<StudentMyProjects />} />
            </Route>
            {/* ************************ */}
            // Dashboard Tutor Routes
            <Route path="/tutor" element={<TutorDashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<TutorHome />} />
              <Route
                path="personal-details"
                element={<TutorPersonalDetails />}
              />
              <Route path="join-room" element={<TutorJoinRoom />} />
              <Route path="group-room" element={<TutorGroupRoom />} />
              <Route path="take-test" element={<TutorTakeTest />} />
              <Route path="session-history" element={<TutorSessionHistory />} />
              <Route path="enter-session" element={<TutorEnterSession />} />
              <Route path="all-projects" element={<TutorAllProjects />} />
              <Route path="chat" element={<TutorChat />} />
            </Route>
            <Route
              path="*"
              element={
                <h1>
                  404 page not found. <Link to="/">Go to home</Link>
                  <br />
                  <Link to={-1}>⬅ go back</Link>
                </h1>
              }
            />
          </Routes>
        </main>
        <Toaster />
      </div>
    </userContext.Provider>
  );
}

export default App;
