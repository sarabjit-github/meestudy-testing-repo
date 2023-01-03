import React from "react";
import styles from "../../../../styles/dashboard.module.scss";
import { NavCard } from "../NavCard";
import { linksArr } from "../../left_sidebar/SuperAdminSidebar";


export const AdminHome = () => {

  return (
    <div
    >
      <h2>👋 Hello Admin!</h2>
      <section className={styles.navCardsWrapper}>
        {linksArr.map(({ id, path, label, Icon, hasChild, nestedRoutes }) => {
          return (
            <NavCard
              key={id}
              id={id}
              path={path}
              label={label}
              Icon={Icon}
              hasChild={hasChild}
              nestedRoutes={nestedRoutes}
              routesFor="admin"
            />
          );
        })}
      </section>
    </div>
  );
};
