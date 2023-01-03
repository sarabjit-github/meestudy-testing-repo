import React from "react";
import styles from "../../styles/ChatAdmin.module.scss";
import defaultImage from "../../assets/defaultImage.jpg";

const RecentUsers = ({ data, conversation, setConversation, joinRoom, setToggleClass }) => {

  let user;
  
  if (data?.student) {
    user = data.student
  } else if (data?.tutor) {
    user = data.tutor
  } else if (data?.admin) {
    user = data.admin
  }

  const setUserData = () => {
    // console.log(user._id , "<<<in recent user")
    joinRoom(user._id)
    setConversation(data)
    setToggleClass(true)
  };

  return (
    <div
      onClick={setUserData}
      className={styles.sideUserMainCard}
      style={{
        backgroundColor:
          conversation?._id === data._id
            ? "rgba(255, 255, 255, 0.5)"
            : "",
      }}
    >
      <div
        style={{ backgroundColor: `${user?.onlineStatus === true ? "#4bb543" : "rgb(221, 95, 95)"}` }}
        className={styles.onlineStatus}
      >
        {user?.onlineStatus === true ? "Active" : "InActive"}
      </div>
      <div className={styles.userInfo}>
        <img className={styles.UserImage} src={defaultImage} alt="userImage" />
        <div className={styles.nameLastMsg}>
          <h4>{user?.name}</h4>
          <p>
            {data?.latestMessage?.MessageType === "File" ? "File" : data?.latestMessage?.textContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentUsers;
