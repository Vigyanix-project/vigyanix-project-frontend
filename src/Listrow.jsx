import React from 'react'

function Listrow() {
  return (
    <div className='row-container'>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">T</th>
            <th scope="col">Estimated Hours</th>
            <th scope="col">Actual Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr className='list-row'>
            <th scope="row">1</th>
            <td>L65456</td>
            <td>15:56</td>
            <td>02:58</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Listrow;