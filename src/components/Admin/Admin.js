import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './Admin.css'; // Import a CSS file for styling


function Admin({ userDetails, userDocId }) {
  
  const [teacherName, setTeacherName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [designation, setDesignation] = useState('');
  const [daysAvailable, setDaysAvailable] = useState('');
  const [floor, setFloor] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [teacherList, setTeacherList] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
 
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // Update existing teacher
        const teacherRef = doc(db, 'teachers', selectedTeacher.id);
        await updateDoc(teacherRef, {
          name: teacherName,
          classroom: classroom,
          designation: designation,
          daysAvailable: daysAvailable,
          floor: floor,
        });
        alert(`Teacher ${teacherName} updated successfully!`);
      } else {
        // Add new teacher
        const docRef = await addDoc(collection(db, 'teachers'), {
          name: teacherName,
          classroom: classroom,
          designation: designation,
          daysAvailable: daysAvailable,
          floor: floor,
        });
        alert(`Teacher ${teacherName} added successfully!`);
      }

      // Reset state
      setTeacherName('');
      setClassroom('');
      setDesignation('');
      setDaysAvailable('');
      setFloor('');
      setEditMode(false);
      setSelectedTeacher(null);
    } catch (e) {
      console.error('Error submitting document: ', e);
      alert('Error submitting teacher details. Please try again.');
    }
  };

  const handleRoomClick = async (roomNumber) => {
    try {
      const q = query(collection(db, 'teachers'), where('classroom', '==', roomNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const teachers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTeacherList(teachers);
        setSelectedTeacher(null);
      } else {
        alert('No details found for this room.');
        setTeacherList([]);
        setRoomDetails(null);
      }
    } catch (e) {
      console.error('Error fetching room details: ', e);
      alert('Error fetching details. Please try again.');
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setRoomDetails(teacher);
    setTeacherName(teacher.name);
    setClassroom(teacher.classroom);
    setDesignation(teacher.designation);
    setDaysAvailable(teacher.daysAvailable);
    setFloor(teacher.floor);
    setEditMode(true);
    setShowEditTeacherModal(true); // Show edit teacher modal
  };

  const handleEditTeacher = () => {
    setEditMode(true);
    setShowEditTeacherModal(true); // Show edit teacher modal
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      if (teacherId) {
        await deleteDoc(doc(db, 'teachers', teacherId));
        alert(`Teacher deleted successfully!`);
        setSelectedTeacher(null);
        setTeacherList(teacherList.filter(teacher => teacher.id !== teacherId)); // Update the list
        setRoomDetails(null);
      } else {
        alert('No teacher selected to delete.');
      }
    } catch (e) {
      console.error('Error deleting document: ', e);
      alert('Error deleting teacher. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setRoomDetails(null);
    setTeacherList([]);
    setSelectedTeacher(null);
    setShowEditTeacherModal(false); // Close edit teacher modal
  };

  const handleAllFloorsClick = () => {
    setShowFloorModal(true);
  };

  const handleFloorSelect = (floorNumber) => {
    setSelectedFloor(floorNumber);
    setShowFloorModal(false);
  };

  const generateClassroomNumbers = (floorNumber) => {
    const prefix = floorNumber.toString().padStart(2, '6');
    return [
      `${prefix}15`,
      `${prefix}14`,
      `${prefix}16`,
      `${prefix}17`,
      `${prefix}18`,
      `${prefix}19`
    ];
  };

  return (
    
    <div className="Admin">
      
      <h1>{editMode ? 'Edit Teacher Information' : 'Add Teacher Information'}</h1>
      <form  className="form"onSubmit={handleSubmit}>
        <div>
          <label>Teacher Name:</label>
          <input
            type="text"
            placeholder='Enter Name of Teacher'
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            placeholder='Enter Location'
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Designation:</label>
          <input
            type="text"
            placeholder='Enter Teacher Designation'
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Days Available:</label>
          <input
            type="text"
            placeholder='Availability'
            value={daysAvailable}
            onChange={(e) => setDaysAvailable(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Floor:</label>
          <input
            type="number"
            placeholder='Enter Floor Location'
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            required
            min="1"
            max="5"
          />
        </div>

        <div className='btn'>
        <button type="submit">{editMode ? 'Update Teacher' : 'Add Teacher'}</button>
        <button type="button" onClick={handleAllFloorsClick}>
          All floors
        </button>
        <button type="button" onClick={handleEditTeacher}>
          Edit Teacher
        </button>
        
        </div>
        <button  type="button" onClick={handleLogout}>Logout</button>
      </form>

      {selectedFloor && (
        <div className="rectangle" id="rec">
          <div className="floor-label">{selectedFloor}th Floor</div>
          <div className="room-container left">
            {generateClassroomNumbers(selectedFloor).slice(0, 3).map((room) => (
              <button key={room} className="room" onClick={() => handleRoomClick(room)}>
                {room}
              </button>
            ))}
          </div>
          <div className="room-container right">
            {generateClassroomNumbers(selectedFloor).slice(3).map((room) => (
              <button key={room} className="room" onClick={() => handleRoomClick(room)}>
                {room}
              </button>
            ))}
          </div>
        </div>
      )}
      {teacherList.length > 0 && (
        <div className="modal">
          <div className="modal-content" id="teacher-container">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Room {classroom} Details</h2>
            <div className="teacher-details">
              {teacherList.map((teacher) => (
                <div key={teacher.id} className="teacher-box">
                  <div><strong>Name:</strong> {teacher.name}</div>
                  <div><strong>Classroom:</strong> {teacher.classroom}</div>
                  <div><strong>Designation:</strong> {teacher.designation}</div>
                  <div><strong>Days Available:</strong> {teacher.daysAvailable}</div>
                  <div><strong>Floor:</strong> {teacher.floor}</div>
                  <div className="actions">
                    <button onClick={() => handleTeacherSelect(teacher)}>Edit</button>
                    <button onClick={() => handleDeleteTeacher(teacher.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showEditTeacherModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Edit Teacher Information</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Teacher Name:</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Classroom:</label>
                <input
                  type="text"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Designation:</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Days Available:</label>
                <input
                  type="text"
                  value={daysAvailable}
                  onChange={(e) => setDaysAvailable(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Floor:</label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  required
                  min="1"
                  max="5"
                />
              </div>
              <button type="submit">Update Teacher</button>
            </form>
          </div>
        </div>
      )}
      {showFloorModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowFloorModal(false)}>
              &times;
            </span>
            <h2>Select a Floor</h2>
            <div className='floor-btn'>
            {[1, 2, 3, 4, 5].map((floorNumber) => (
              <button key={floorNumber} onClick={() => handleFloorSelect(floorNumber)}>
                {floorNumber}
              </button>
            ))} </div>
          </div>
        </div>
      )}
    </div>
    

  );
}

export default Admin;
