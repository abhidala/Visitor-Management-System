import React, { useEffect } from "react";

import "./FacesModal.css";
const cellStyle = {
  padding: '4px',
  textAlign: 'left',
  border: '1px solid #ddd',
};

const evenRowStyle = {
  backgroundColor: '#f2f2f2',
};

const oddRowStyle = {
  backgroundColor: '#fff',
};
import { toast } from "react-toastify";

// function FacesModal({
//   setOpenModal,data,handleImageClick
// }) {
//   const canvasRef = React.useRef(null);
//   const closeModal =()=>{
//     setOpenModal(false);
//   }
//   let listItems=[];
//   useEffect(()=>{
//     console.log(data);
//     if(Array.isArray(data)){
//       listItems = data.map(record => (
//         <tr>
//           <td>{record.vFirstName}</td>
//           <td>{record.vLastName}</td>
//           <td><img src={`data:image/jpeg;base64,`+record.vPhoto}/></td>
//           <td>{record.vMobileNo}</td>
//         </tr>
//       ))
//     }
//   },[data]);
//   return (
//     <div className="modalBackground">
//       <div className="modalContainer">
//         <div className="titleCloseBtn">
//           <button 
//            type="button"
//            onClick={closeModal}
//           >X</button>
//         </div>
//         <div className="title">
//           <h1>Please select relevant image from the images</h1>
//         </div>
//         <div className="body">
//           {Array.isArray(data)?listItems:
//           (data && data.croppedImages.map((dataPoint, index) => (
//         <img key={index} src={dataPoint} alt={`Image ${index + 1}`} onClick={() => handleImageClick(dataPoint)} style={{marginRight:'10px',cursor:'pointer'}} />
//       )))}
//         </div>
//         <div className="footer">
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FacesModal;
interface User{
  name:string,
  mobile:string
}
function FacesModal({
  setOpenModal, data, handleImageClick,onRowClickInParent
}) {
  const canvasRef = React.useRef(null);

  const closeModal = () => {
    setOpenModal(false);
  }
  const handleRowClick = (rowData) => {
    if (onRowClickInParent) {
      onRowClickInParent(rowData);
      closeModal();
    }
  };
  const [name, setName] = React.useState('');
 const [mobileNumber, setMobileNumber] = React.useState('');
 const [formData, setFormData] = React.useState<User[]>([]);
 const [sortedData,setSortedData]= React.useState();
 React.useEffect(() => {
  // Initialize formData with an array of empty objects based on the length of data
  setFormData(Array.from({ length: data.croppedImages.length }, () => ({ name: '', mobile: '' })));
}, []);
React.useEffect(()=>{
  if(Array.isArray(data)){
const dataSorted=[...data].sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
setSortedData(dataSorted);}
},[data])
React.useEffect(()=>{
  console.log(formData)
},[formData])
  let listItems = null;
  const handleSubmit= (dataPoint,index) => {
    const obj = {
      "Image":dataPoint.replace(/^[^,]+,\s*/, ''),
      "mobileNumber":formData[index]?.mobile,
      "name":formData[index]?.name,
    }
    if(obj.mobileNumber && obj.name)
    handleImageClick(obj);
  };
  if (Array.isArray(sortedData) && sortedData.length > 0) {
    listItems =  (<table style={{ borderCollapse: 'collapse', width: '100%' }}>
    <thead>
      <tr>
        <th style={cellStyle}>First Name</th>
        {/* <th style={cellStyle}>Last Name</th> */}
        <th style={cellStyle}>Photo</th>
        <th style={cellStyle}>Mobile No</th>
        <th style={cellStyle}>Similarity</th>
      </tr>
    </thead>
    <tbody>
    

      {sortedData.map((record, index) => (
        <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}
        onClick={() => handleRowClick(record)}>
          <td style={cellStyle}>{record.visitorDetails.vFirstName}</td>
          {/* <td style={cellStyle}>{record.visitorDetails.vLastName}</td> */}
          <td style={cellStyle}><img src={`data:image/jpeg;base64,${record.visitorDetails.vPhoto}`} alt={`Photo of ${record.vFirstName} ${record.vLastName}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} /></td>
          <td style={cellStyle}>{record.visitorDetails.vMobileNo}</td>
          <td style={cellStyle}>{record.similarity?.toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
  } else if (data && data.croppedImages) {
    { data.croppedImages.length > 1 ? ( listItems = data.croppedImages.map((dataPoint, index) => (
       
       
      <div key={index} style={{ marginBottom: '20px', textAlign: 'center' }}>
      <img  key={index} src={`data:image/jpeg;base64,`+dataPoint} alt={`Image ${index + 1}`}  style={{ marginRight: '10px', marginLeft:'10px', marginBottom: '10px' }} />
      <div style={{margin:'0' , padding:'0'}}>
        <input type="text" placeholder="Name" value={formData[index]?.name}
            onChange={(e) => {
            const updatedFormData = [...formData];
              updatedFormData[index].name = e.target.value;
             
              setFormData(updatedFormData);}} style={{ marginBottom: '5px', marginLeft:'5px', width:'50%', borderRadius:'0.5rem' }} />
        <input type="text" value={formData[index]?.mobile}
            onChange={(e) => {
              const updatedFormData=[...formData];
              updatedFormData[index].mobile=e.target.value;
              setFormData(updatedFormData);
            }} placeholder="Mobile Number" style={{ marginBottom: '5px' , marginLeft:'5px', width:'75%', borderRadius:'0.5rem'}} />
      <button  onClick={()=>handleSubmit(dataPoint,index)} style={{ background:'blue',marginTop: '10px', borderRadius: '0.5rem', padding: '5px 10px', cursor: 'pointer',color:'white' }}>
            Submit
          </button>
      </div>
    </div>
      )) ) : (  listItems = data.croppedImages.map((dataPoint, index) => (
       
        
      
        <div key={index} style={{ marginBottom: '20px', textAlign: 'center'  , display:"flex" , flexDirection:'row' }}>
       
        
        <img  key={index} src={`data:image/png;base64,`+dataPoint} alt={`Image ${index + 1}`}  style={{  flex :'1.5', marginRight: '10px', marginLeft:'10px', marginBottom: '80px' }} />
        <div style={{margin:'0' , padding:'0', flex:'1'}}>
          <input type="text" placeholder="Name" value={formData[index]?.name}
              onChange={(e) => {
              const updatedFormData = [...formData];
                updatedFormData[index].name = e.target.value;
               
                setFormData(updatedFormData);}} style={{ marginBottom: '5px', marginLeft:'5px', width:'70%', borderRadius:'0.5rem', marginTop:'80px' }} />
          <input type="text" value={formData[index]?.mobile}
              onChange={(e) => {
                const updatedFormData=[...formData];
                updatedFormData[index].mobile=e.target.value;
                setFormData(updatedFormData);
              }} placeholder="Mobile Number" style={{ marginBottom: '5px' , marginLeft:'5px', width:'100%', borderRadius:'0.5rem', marginTop:'10px' }} />
        <button  type="button" onClick={()=>handleSubmit(dataPoint,index)} style={{ background:'blue',marginTop: '50px', borderRadius: '0.5rem', padding: '5px 10px', cursor: 'pointer',color:'white' }}>
              Submit
            </button>
        </div>
      </div>
        )) )}
  }

  return (
    <div className="modalBackground">
      <div className="modalContainer" style={{overflowX: "auto",
  overflowY: "auto"}}>
        <div className="titleCloseBtn">
          <button
            type="button"
            onClick={closeModal}
          >X</button>
        </div>
        <div className="title">
          <h1>Please select a relevant image from the images</h1>
        </div>
        <div className="body" style={{margin:'0', padding:'0'}} >
          {listItems}
        </div>
        <div className="footer">
        </div>
      </div>
    </div>
  );
}

export default FacesModal;
