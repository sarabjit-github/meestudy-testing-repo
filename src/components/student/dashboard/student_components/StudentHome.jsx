import React from "react";
import styles from "../../../../styles/dashboard.module.scss";
import { NavCard } from "../NavCard";
import { linksArr } from "../../left_sidebar/StudentSidebar";


export const StudentHome = () => {

  return (
    <div
    >
      <h2>👋 Hello Student!</h2>
      <section className={styles.navCardsWrapper}>
        {linksArr.map(({ id, path, label, Icon, hasChild, nestedRoutes }, i) => {
          return (
            <NavCard
              key={id}
              id={i}
              path={path}
              label={label}
              Icon={Icon}
              hasChild={hasChild}
              nestedRoutes={nestedRoutes}
            />
          );
        })}
      </section>
    </div>
  );
};
