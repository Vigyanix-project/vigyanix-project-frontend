import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import makeHttpRequest from './http';

function TaskList() {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [tasks, setTasks] = useState(null);
  let count = 1;
  const formik = useFormik({
    initialValues: {
      actualHours: "",
      estimatedHours: ""
    },
  });

  const getList = async () => {


    const resp = await makeHttpRequest('get', 'get-all');
    console.log(resp);
    setTasks(resp);

  }

  const editData = (index, val) => {
    setContent(val?.estimatedNotes);
    formik.setValues({
      estimatedHours: val?.estimatedHours,
      actualHours: val?.actualHours
    });
  }

  useEffect(() => {
    getList();
  }, [])
  return (
    <div className='container'>
      <div className='header'>
        <h1>List Of Tasks</h1>
        <div className="list-underline" id='3'></div>
      </div>
      <div className="add-button-box">
        <button type="button" className="btn btn-secondary btn-dark home-button" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className='row-container'>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Estimated Hours</th>
              <th scope="col">Actual Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => {
              return task?.items?.map((val, index) => {
                return (
                  <tr className="list-row" key={`${task.taskNumber}-${index}`}>
                    <th scope="row">{count++}</th>
                    <td>{val.estimatedHours}</td>
                    <td>{val.actualHours}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-dark home-edit-button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        data-bs-whatever="@mdo"
                        onClick={() => editData(index, val)}
                      // disabled={tasks?.confirmed == true}
                      >
                        View Task
                      </button>
                    </td>
                  </tr>
                );
              });
            })}

          </tbody>
        </table>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add Task</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className='Editor-div'>
                  <JoditEditor
                    ref={editor}
                    value={content}
                  // onChange={newContent => { setContent(newContent) }}
                  />
                </div>
                <div className="time">
                  <div className="m-3">

                    <label htmlFor="recipient-name" className="col-form-label">Estiamted Time</label>
                    <input type="text" className="form-control" id="recipient-name" name='estimatedHours' disabled={true} {...formik.getFieldProps("estimatedHours")} />

                  </div>
                  <div className="m-3">

                    <label htmlFor="recipient-name" className="col-form-label">Real Time</label>
                    <input type="text" className="form-control" id="recipient-name" name='actualHours' disabled={true} {...formik.getFieldProps("actualHours")} />

                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-dark" data-bs-dismiss="modal">Close</button>

            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default TaskList