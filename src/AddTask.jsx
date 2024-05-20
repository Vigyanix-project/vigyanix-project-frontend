import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import makeHttpRequest from './http';


function AddTask() {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [tasks, setTasks] = useState(null);
  const [index, setIndex] = useState(-1);

  const validationSchema = Yup.object().shape({
    taskNumber: Yup.string().required("Task number is required."),
    actualHours: Yup.number().required("Estimated hours is required.").test(
      'is-decimal',
      'invalid decimal',
      value => (value + "").match(/^\d*\.{1}\d*$/)),
    estimatedHours: Yup.number().required("Estimated hours is required.").test(
      'is-decimal',
      'invalid decimal',
      value => (value + "").match(/^\d*\.{1}\d*$/))
  })

  const formik = useFormik({
    initialValues: {
      taskNumber: "",
      actualHours: "",
      estimatedHours: ""
    },
    validationSchema: validationSchema
  });

  const calculateTime = (x) => {
    let integralPart = parseInt(x)
    let decimalPart = 100 * (x - integralPart)

    if (decimalPart >= 60) {
      integralPart += decimalPart / 60
      decimalPart %= 60
    }
    return x = integralPart + (decimalPart / 100);
  }
  
  const submitHandler = async (val) => {
    let resp;
    let estimatedHours = calculateTime(formik.values.estimatedHours);
    let actualHours = calculateTime(formik.values.actualHours);
    if (val == "add" && tasks == null) {
      const body = {
        taskNumber: formik.values.taskNumber,
        items: [
          {
            "estimatedNotes": content,
            "estimatedHours": estimatedHours,
            "actualHours": actualHours
          }
        ]
      }
      resp = await makeHttpRequest('post', 'create', body);
      console.log("------------>", resp)

    } else if (val == "update") {
      let items = tasks;

      if (index != -1) {
        const totalInitialTasks = [...tasks?.items];

        const newItem = {
          "estimatedNotes": tasks?.items[index].estimatedNotes,
          "estimatedHours": tasks?.items[index].estimatedHours,
          "actualHours": actualHours
        }

        totalInitialTasks[index] = newItem;
        items = totalInitialTasks;
      }

      const body = {
        taskNumber: formik.values.taskNumber,
        items: items
      }
      resp = await makeHttpRequest('put', 'update', body);
    } else {
      let items = tasks?.items;


      const item = {
        "estimatedNotes": content,
        "estimatedHours": estimatedHours,
        "actualHours": actualHours
      }
      items = [
        ...tasks.items,
        item
      ]


      const body = {
        taskNumber: formik.values.taskNumber,
        items: items
      }
      resp = await makeHttpRequest('put', 'update', body);
    }
    console.log(resp?.task?.taskNumber)
    getList(resp?.task?.taskNumber);
  }

  const getList = async (taskNumber) => {
    try {
      console.log(taskNumber)
      const body = {
        taskNumber: taskNumber
      }
      console.log(body)
      const resp = await makeHttpRequest('get', 'get', body);
      console.log(resp);
    } catch (error) {
      console.log(error)
    }


    // setTasks(resp[0]);
    // formik.setValues({
    //   ...formik.values, // Keep the existing values
    //   taskNumber  : resp[0]?.taskNumber
    // });
  }

  const editData = (index, val) => {
    setIndex(index);
    setContent(val?.estimatedNotes);
    formik.setValues({
      ...formik.values, // Keep the existing values
      estimatedHours: val?.estimatedHours,
      actualHours: val?.actualHours
    });
  }

  const taskNumberChecker = () => {
    if (tasks == null) return;
    formik.setValues({
      estimatedHours: '',
      actualHours: ''
    });
    setContent('');
    setIndex(-1);

  }

  // useEffect(() => {
  //   getList();
  // }, []);

  return (
    <div className='container'>
      <div className='header'>
        <h1>Add Notes</h1>
        <div className="add-underline" id='3'></div>
      </div>
      <div className="add-button-box">
        <button type="button" className="btn btn-secondary btn-dark home-button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" onClick={() => taskNumberChecker()}>Add Tasks</button>
        <button type="button" className="btn btn-secondary btn-dark home-button" onClick={() => navigate(-1)}>Back</button>
      </div>



      <div className='row-container'>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Task Number</th>
              <th scope="col">Estimated Hours</th>
              <th scope="col">Actual Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.items?.map((val, index) => (<tr className='list-row' key={index}>
              <th scope="row">{index + 1}</th>
              <td>{formik?.values?.taskNumber}</td>
              <td>{val.estimatedHours}</td>
              <td>{val.actualHours}</td>
              <td>
                <button type="button" className="btn btn-secondary btn-dark home-edit-button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" onClick={() => editData(index, val)}
                // disabled = {tasks?.confirmed == true}
                >Edit Task</button>
              </td>
            </tr>))}
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
                {tasks == null ? <div className="task-number">
                  <input type='text' placeholder='Add task number' name="taskNumber" {...formik.getFieldProps("taskNumber")} />
                  {formik.touched.taskNumber && formik.errors.taskNumber ? (
                    <div className='errorClass'>{formik.errors.taskNumber}</div>
                  ) : null}
                </div> : null}
                <div className='Editor-div'>
                  {index == -1 ? <JoditEditor
                    ref={editor}
                    value={content}
                    onChange={newContent => setContent(newContent)}
                  /> :
                    <JoditEditor
                      ref={editor}
                      value={content}
                    />
                  }
                </div>
                <div className="time">
                  <div className="m-3">

                    <label htmlFor="recipient-name" className="col-form-label">Estiamted Time</label>
                    <input type="text" className="form-control" id="recipient-name" name='estimatedHours' {...formik.getFieldProps("estimatedHours")}
                      disabled={index != -1}
                    />
                    {formik.touched.estimatedHours && formik.errors.estimatedHours ? (
                      <div className='errorClass'>{formik.errors.estimatedHours}</div>
                    ) : null}
                  </div>
                  <div className="m-3">

                    <label htmlFor="recipient-name" className="col-form-label">Real Time</label>
                    <input type="text" className="form-control" id="recipient-name" name='actualHours' {...formik.getFieldProps("actualHours")} />
                    {formik.touched.actualHours && formik.errors.estimatedHours ? (
                      <div className='errorClass'>{formik.errors.actualHours}</div>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-dark" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-secondary btn-dark" onClick={() => submitHandler(index == -1 ? "add" : "update")}>{index == -1 ? "Add Task" : "Update"}</button>
              {index != -1 ?
                <button type="button" className="btn btn-secondary btn-dark" onClick={() => submitHandler()}>Confirmed</button> :
                null
              }
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default AddTask