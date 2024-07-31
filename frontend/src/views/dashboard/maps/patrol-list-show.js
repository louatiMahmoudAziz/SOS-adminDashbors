import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from '../../../components/Card';
import { fetchData } from '../../../services/mix';
import globalConfig from '../../../services/config';

const PatrolListShow = () => {
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [showPatrolListModal, setShowPatrolListModal] = useState(false);
   const [selectedPatrol, setSelectedPatrol] = useState(null);
   const [patrollist, setPatrollist] = useState([]);
   const [patrolsToAssign, setPatrolsToAssign] = useState([]);
   const [mode, setMode] = useState('create');

   const handleCloseAssignModal = () => setShowAssignModal(false);
   const handleShowAssignModal = () => setShowAssignModal(true);

   const handleClosePatrolListModal = () => setShowPatrolListModal(false);
   const handleShowPatrolListModal = () => setShowPatrolListModal(true);

   const refresh = () => {
      fetchData(`${globalConfig.BACKEND_URL}/api/patrols/`)
         .then(response => {
            setPatrollist(response);
            setPatrolsToAssign(response); // Set patrols to assign initially
         });
   }

   useEffect(() => {
      refresh();
   }, []);

   return (
      <>
         <div>
            <Row>
               <Col sm="12">
                  <Card>
                     <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                           <h4 className="card-title">Patrol List</h4>
                        </div>
                     </Card.Header>
                     <Card.Body className="px-0">
                        <div className="table-responsive">
                           <table id="patrol-list-table" className="table table-striped" role="grid" data-toggle="data-table">
                              <thead>
                                 <tr className="light">
                                    <th>Supervisor Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Team Members</th>
                                    <th minWidth="100px">Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    patrollist.map((item, idx) => (
                                       <tr key={idx}>
                                          <td>{item.supervisor.name}</td>
                                          <td>{item.supervisor.email}</td>
                                          <td>{item.status}</td>
                                          <td>{item.location}</td>
                                          <td>{item.teamMembers.join(', ')}</td>
                                          <td>
                                             <div className="flex align-items-center list-patrol-action">
                                                {/* Assign Icon */}
                                                <Link 
                                                   onClick={() => {
                                                      setSelectedPatrol(item);
                                                      handleShowPatrolListModal();
                                                   }}
                                                   className="btn btn-sm btn-icon btn-primary" 
                                                   data-toggle="tooltip" 
                                                   data-placement="top" 
                                                   title="Assign" 
                                                   data-original-title="Assign"
                                                   to="#"
                                                >
                                                   <span className="btn-inner">
                                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                         <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
                                                      </svg>
                                                   </span>
                                                </Link>
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 }
                              </tbody>
                           </table>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>

         {/* Modal to display patrol details */}
         <Modal show={showAssignModal} onHide={handleCloseAssignModal} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>Assign Patrol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {selectedPatrol ? (
                  <div>
                     <h5>Supervisor Name: {selectedPatrol.supervisor.name}</h5>
                     <p>Email: {selectedPatrol.supervisor.email}</p>
                     <p>Status: {selectedPatrol.status}</p>
                     <p>Location: {selectedPatrol.location}</p>
                     <p>Team Members: {selectedPatrol.teamMembers.join(', ')}</p>
                     <p>Assigned Missions: {selectedPatrol.assignedMissions.join(', ')}</p>
                  </div>
               ) : (
                  <p>No details available.</p>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseAssignModal}>
                  Close
               </Button>
               <Button variant="primary" onClick={() => { /* Handle assignment logic here */ }}>
                  Assign
               </Button>
            </Modal.Footer>
         </Modal>

         {/* Modal to display the list of patrols */}
         <Modal show={showPatrolListModal} onHide={handleClosePatrolListModal} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>Select Patrol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="table-responsive">
                  <table id="patrol-list-table" className="table table-striped" role="grid" data-toggle="data-table">
                     <thead>
                        <tr className="light">
                           <th>Supervisor Name</th>
                           <th>Email</th>
                           <th>Status</th>
                           <th>Location</th>
                           <th>Team Members</th>
                           <th minWidth="100px">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           patrolsToAssign.map((item, idx) => (
                              <tr key={idx}>
                                 <td>{item.supervisor.name}</td>
                                 <td>{item.supervisor.email}</td>
                                 <td>{item.status}</td>
                                 <td>{item.location}</td>
                                 <td>{item.teamMembers.join(', ')}</td>
                                 <td>
                                    <div className="flex align-items-center list-patrol-action">
                                       <Button
                                          onClick={() => {
                                             setSelectedPatrol(item);
                                             handleClosePatrolListModal();
                                             handleShowAssignModal();
                                          }}
                                          className="btn btn-sm btn-primary"
                                       >
                                          Select
                                       </Button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        }
                     </tbody>
                  </table>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClosePatrolListModal}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   )
}

export default PatrolListShow;
