import React, { useState, useEffect } from 'react'
import styles from '../../../../../styles/addData.module.scss'
import { AiFillEye, AiFillEyeInvisible, AiFillEdit, AiTwotoneDelete } from "react-icons/ai";
import api from '../../../../../services/api'
import DeleteComponent from './DeleteComponent';
import toast from "react-hot-toast";

const AddSubject = () => {
  const [allSubjects, setAllSubjects] = useState([])
  const [toggleForm, setToggleForm] = useState(false)
  const [toggleDelete, setToggleDelete] = useState(false)
  const [searchSubject, setSearchSubject] = useState('')
  const [deleteData, setDeleteData] = useState({ header: "", name: "", id: "" })
  const [subject, setSubject] = useState({ subjectName: '', action: '' })

  useEffect(() => {
    async function getSubjects() {
      const res = await api.get(`/subject/get-all-in-admin/?page=1&limit=10`);
      setAllSubjects(res.data.subjects)
    }
    getSubjects();
  }, []);

  const handelForm = () => {
    toggleForm === true ? setToggleForm(false) : setToggleForm(true)
  }

  const handelFormData = (e) => {
    setSubject({ ...subject, [e.target.name]: e.target.value })
  }

  const handelFormSubmit = async (e) => {
    e.preventDefault()
    const data = {
      subjectName: subject.subjectName
    }

    if (subject.action === "edit") {
      try {
        const res = await api.put(`/subject/edit/`, { ...data, id: subject.id })
        setToggleForm(false)
        setSubject({ subjectName: '', action: '' })
        const updatedData = allSubjects.map((item) => {
          if (subject.id === item._id) {
            return {
              ...item,
              ...data
            }
          }
          else {
            return item
          }
        })
        setAllSubjects(updatedData)
        toast.success(res.data.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
      } catch (err) {
        setLoading(false)
        const error = err?.response
        let message = ""
        if (error) {
          if (error.status === 422) {
            const len = error.data.validationError.length
            error.data.validationError.forEach((item, i) => message += `${item.message}${i + 1 != len ? " , " : " ."}`)
          }
          else if (error.status === 403) {
            message = error.data.message
          }
          else if (error.status === 409) {
            message = error.data.message
          }
        }
        if (message) {
          toast.error(message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          })
        } else {
          toast.error(err.message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          })
        }
      }

    } else {
      try {
        const res = await api.post("/subject/create", data);
        setAllSubjects(allSubjects.concat(res.data.data))
        toast.success(res.data.message, {
          duration: 4000,
          position: "top-center",
          style: { border: "2px solid var(--success-color)" },
        });
        setSubject({ subjectName: '', action: '' })
      } catch (err) {
        setLoading(false)
        const error = err?.response
        let message = ""
        if (error) {
          if (error.status === 422) {
            const len = error.data.validationError.length
            error.data.validationError.forEach((item, i) => message += `${item.message}${i + 1 != len ? " , " : " ."}`)
          }
          else if (error.status === 403) {
            message = error.data.message
          }
          else if (error.status === 409) {
            message = error.data.message
          }
        }
        if (message) {
          toast.error(message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          })
        } else {
          toast.error(err.message, {
            duration: 4000,
            position: "top-center",
            style: { border: "2px solid var(--danger-color)" },
          })
        }
      }
    }
  }

  const handelSearch = (e) => {
    setSearchSubject(e.target.value)
  }

  const data = allSubjects.filter((x) => {
    if (searchSubject === '') {
      return x;
    } else {
      return x.subjectName.toLowerCase().includes(searchSubject)
    }
  })

  const editDataAction = (id, subjectName) => {
    setSubject({
      subjectName: subjectName,
      id: id,
      action: "edit"
    })
    setToggleForm(true)
  }

  const handelCloseModal = () => {
    setToggleForm(false)
    setSubject({ subjectName: '', action: '' })
  }

  const toggleDeleteWrapper = (id, subjectName) => {
    setDeleteData({
      header: "subject",
      name: subjectName,
      id: id,
    })
    setToggleDelete(true)
  }

  const toggleActiveInactive = async (id) => {
    const res = await api.patch(`/subject/active-inactive/${id}`)
    const updatedData = allSubjects.map((item) => {
      if (id === item._id) {
        return {
          ...item,
          isActive: !item.isActive
        }
      }
      else {
        return item
      }
    })
    set(updatedData)
    toast.success(res.data.message, {
      duration: 4000,
      position: "top-center",
      style: { border: "2px solid var(--success-color)" },
    });
  }

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Subjects List</h2>
      <div className={styles.topContainer}>
        <div className={styles.searchContainer}>
          <label
            htmlFor="SearchCountry">Search:</label>
          <input
            onChange={handelSearch}
            value={searchSubject}
            placeholder='Search Subject'
            className={styles.searchCountry}
            type="text"
          />
        </div>
        <button
          onClick={handelForm}
          className={styles.createCountryButton}>
          + Create a New Subject
        </button>
      </div>
      <div className={styles.mainContainer}>
        <table className={styles.countryTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th style={{ width: '10%' }} >S No.</th>
              <th style={{ width: '35%', textAlign: "left", paddingLeft: "20px" }} >Subject Name</th>
              <th style={{ width: '25%' }} >Status</th>
              <th style={{ width: '30%' }} >Action</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {data.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: "left", paddingLeft: '20px' }}>
                    {item.subjectName}
                  </td>
                  <td>
                    {item.isActive === true ? "Active" : "Inactive"}
                  </td>
                  <td>
                    {item.isActive === true ?
                      <abbr title="Hide">
                        <AiFillEye
                          onClick={() => toggleActiveInactive(item._id)}
                          className={styles.actionIcons} />
                      </abbr> :
                      <abbr title="Unhide">
                        <AiFillEyeInvisible
                          onClick={() => toggleActiveInactive(item._id)}
                          className={styles.actionIcons} />
                      </abbr>
                    }
                    <abbr title="Edit">
                      <AiFillEdit
                        onClick={() => editDataAction(item._id, item.subjectName)}
                        className={styles.actionIcons}
                      />
                    </abbr>
                    <abbr title="Delete">
                      <AiTwotoneDelete
                        onClick={() => toggleDeleteWrapper(item._id, item.subjectName)}
                        className={`${styles.actionIcons} ${styles.trash}`}
                      />
                    </abbr>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
      <div
        className={`${styles.createFormMainContainer} ${toggleForm === true && styles.toggleClass}`}
      >
        <div className={styles.createdCountryWrapper}></div>
        <button
          onClick={handelCloseModal}
          className={`${styles.btnClose} ${styles.SubjectBtnClose}`}>
          &times;
        </button>
        <div className={`${styles.formSubjectContainer} ${styles.formContainer}`}>
          <form
            onSubmit={handelFormSubmit}
            className={styles.entryForm}
          >
            <h2>Add a New Subject</h2>
            <div className={styles.inputContainer}>
              <label
                htmlFor="subjectName">
                Subject Name
              </label>
              <input
                required
                onChange={handelFormData}
                name="subjectName"
                value={subject.subjectName}
                type="text"
                placeholder='Enter Subject Name'
              />
            </div>
            <button
              className={styles.btnAdd}
              type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      <DeleteComponent
        valueProp={allSubjects}
        setValueProp={setAllSubjects}
        setToggleDelete={setToggleDelete}
        toggleDelete={toggleDelete}
        data={deleteData}
      />
    </>
  )
}

export default AddSubject
