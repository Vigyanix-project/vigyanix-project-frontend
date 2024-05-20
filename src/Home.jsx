import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className='container'>
      <div className='header'>
        <h1>Vigyanix Project</h1>
        <div className="underlin" id='3'></div>
      </div>
      <div className="button-box">
      <button type="button" className="btn btn-secondary btn-dark home-button" onClick={()=>navigate('/AddTask')}>Add Notes</button>
      <button type="button" className="btn btn-secondary btn-dark home-button" onClick={()=>navigate('/List')}>View All Notes</button>
      </div>
    </div>
  )
}

export default Home