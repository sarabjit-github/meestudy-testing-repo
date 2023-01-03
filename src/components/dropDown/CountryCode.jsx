import React, { useState, useEffect } from 'react'
import api from '../../services/api';
import styles from "../../styles/auth.module.scss";

const CountryCode = ({ data, setData }) => {
    const [togglePhoneCode, setTogglePhoneCode] = useState(false)
    const [allCountries, setAllCountries] = useState([]);
    const [codeDropDownBtnState, setCodeDropDownBtnState] = useState('code')

    useEffect(() => {
        async function getCountrycode() {
            const res = await api.get("/country/get-all");
            setAllCountries(res.data)
        }
        getCountrycode();
    }, []);

    const handelCountryCode = (e, id) => {
        let code = e.target.value
        // setCountryCode(code)
        let name = e.target.innerHTML
        let codeName = name.slice(name.indexOf("(") + 1, name.indexOf(")"))
        let countryName = name.slice(0, name.indexOf("("))
        setTogglePhoneCode(false)
        setCodeDropDownBtnState(codeName)
        setData({ countryName, code, id })
    }

    const toggleCountryCode = () => {
        togglePhoneCode === true ? setTogglePhoneCode(false) : setTogglePhoneCode(true)
    }

    return (
        <>
            <button
                type='button'
                onClick={toggleCountryCode}
                className={styles.countryCodeBtn}>
                {codeDropDownBtnState}▼
                <br />
                {data?.code}
            </button>
            <div
                style={{ display: `${togglePhoneCode === true ? "flex" : 'none'}` }}
                className={styles.codeInputBtnContainer}>
                {allCountries.map((country) => {
                    return (
                        <button
                            type='button'
                            value={country.phoneCode}
                            onClick={(e) => handelCountryCode(e, country._id)}
                            key={country._id}
                            className={styles.codeInputBtn}
                        >
                            {`${country.country}(${country.countryCode})`}
                        </button>
                    )
                })}
            </div>
        </>
    )
}

export default CountryCode