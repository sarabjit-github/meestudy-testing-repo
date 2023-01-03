import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/footer.module.scss";
import { Logo, navLinks } from "../header/Header";
import {
  AiOutlineMail,
  AiOutlineInstagram,
  AiOutlineYoutube,
} from "react-icons/ai";
import { BsTelephone, BsFillTelephoneFill } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { RiLinkedinLine, RiTwitterLine, RiFacebookLine } from "react-icons/ri";
import { MdMail, MdLocationOn } from "react-icons/md";

export const contactUsLinks = [
  {
    id: 1,
    label: "meestudy@company.com",
    link: "meestudy@company.com",
    Icon: () => <AiOutlineMail />,
    FilledIcon: ()=><MdMail />,
    type: "email",
  },
  {
    id: 2,
    label: "+91 1234567890",
    link: "+911234567890",
    Icon: () => <BsTelephone />,
    FilledIcon: ()=><BsFillTelephoneFill />,
    type: "tel",
  },
  {
    id: 3,
    label: "India",
    link: undefined,
    Icon: () => <SlLocationPin />,
    FilledIcon: ()=><MdLocationOn />,
    type: "free",
  },
];
export const followUsLinks = [
  {
    id: 1,
    label: "Instagram",
    link: "#",
    Icon: () => <AiOutlineInstagram />,
  },
  {
    id: 2,
    label: "Twitter",
    link: "#",
    Icon: () => <RiTwitterLine />,
  },
  {
    id: 3,
    label: "Facebook",
    link: "#",
    Icon: () => <RiFacebookLine />,
  },
  {
    id: 4,
    label: "LinkedIn",
    link: "#",
    Icon: () => <RiLinkedinLine />,
  },
  {
    id: 5,
    label: "YouTube",
    link: "#",
    Icon: () => <AiOutlineYoutube />,
  },
];

export const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <footer className={styles.footerWrapper}>
        <div className={styles.footerUpperWrapper}>
          <div className={styles.companyAbout}>
            <Logo />
            <p>
              Education is smart enough to change the human mind positively. It
              is all about academic excellence and cultural diversity.
            </p>
          </div>
          <div className={styles.companyLinks}>
            <h3>Company</h3>
            {navLinks.map(({ id, path, label, Icon }) => {
              return (
                <Link to={path} key={id}>
                  <Icon />
                  {label}
                </Link>
              );
            })}
          </div>
          <div className={styles.companyLinks}>
            <h3>Follow us</h3>
            {followUsLinks.map(({ id, label, link, Icon }) => {
              return (
                <a href={link} key={id}>
                  <Icon />
                  {label}
                </a>
              );
            })}
          </div>
          <div className={styles.companyLinks}>
            <h3>Contact us</h3>
            {contactUsLinks.map(({ id, link, label, Icon, type }) => {
              return type !== "free" ? (
                <a
                  href={`${type === "email"
                      ? `mailto:${link}`
                      : type === "tel" && `tel:${link}`
                    }`}
                  key={id}
                >
                  <Icon />
                  {label}
                </a>
              ) : (
                <p key={id}>
                  <Icon /> {label}
                </p>
              );
            })}
          </div>
        </div>
        <div className={styles.copyrightSection}>
          <div>Copyright &copy; 2022 Meestudy</div>
          <div>
            All Rights reserved | <Link to='privacy-policy'>Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
