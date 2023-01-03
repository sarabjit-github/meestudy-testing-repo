import React from 'react';
import styles from "../../../styles/dashboardHeader.module.scss";

export const DashboardHeader = ({isSidebarCollapse}) => {
  return (
    <header className={styles.header} 
    style={{left: isSidebarCollapse ? "90px":"280px"}}
    >
        <div className={styles.bgChangeWrapper}>
            <button className='btnNeutral btn--small'>Change background</button>
        </div>
    </header>
  )
}
