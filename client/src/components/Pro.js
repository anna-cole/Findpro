import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditPro from "./EditPro";
// import AddReview from "./AddReview";

const Pro = ({ currentUser, deletePro, updatePro }) => {
  const [pro, setPro] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [reviews, setReviews] = useState([])
  const params = useParams();
  const proId = params.id;
 
  useEffect(() => {
    fetch(`/pros/${proId}`)
    .then(r => {
      if (r.ok) {
        r.json().then(pro => setPro(pro))
      }
    })
  }, [proId])

  useEffect(() => {
    fetch("/reviews")
    .then(r => {
      if (r.ok) {
        r.json().then(reviews => setReviews(reviews));
      }
    })
  }, [])

  const handleDelete = () => {
    if (currentUser.id === pro.id) {
      fetch(`/pros/${pro.id}`, {method: "DELETE"})
      deletePro(pro.id)
    } 
  }

  const onUpdatePro = updatedPro => {
    if (currentUser.id === pro.id) {
      setIsEditing(false)
      updatePro(updatedPro)
    }
  }

  // const submitNewReview = (newReview) => {
  //   setReviews([...reviews, newReview])
  // }

  const reviewsToDisplay = 
  reviews.filter(review => review.pro_id === pro.id)
  
  if (!pro.name) {
    return <h1>Loading...</h1>
  }
  
  return (
    <div className="app">
      <h2>{pro.name}</h2>
      <img className="background-image" src={pro.image_url} alt={pro.name} width="300" height="300"/>
      <ul>
        <li>Average rating: {pro.average_rating} &nbsp;
        {Array(pro.average_rating).fill("⭐").join("")}</li>
        <li>Services: {pro.service}</li>
        <li>Serves: {pro.area_served}</li>
      </ul>
      {currentUser.id === pro.id ? (
        <>
          <button onClick={handleDelete}>Delete</button>&nbsp;
          <button onClick={() => setIsEditing((isEditing) => !isEditing)}>Edit</button>
        </>
      ) : null}
      {isEditing ? (
        <EditPro pro={pro} onUpdatePro={onUpdatePro} />
      ) : null}


      <h3>Reviews:</h3>
      {reviewsToDisplay.map(review => 
        <ul key={review.id} className="reviews-list">
          <li>User: {review.user.username}</li>
          <li>Rating: {Array(review.rating).fill("⭐").join("")}</li>
          <li>{review.content}</li>
        </ul>
      )}
      <h3>Add a review for this pro</h3>
      {/* <AddReview pro={pro} submitNewReview={submitNewReview}/> */}
    </div>
  )
}

export default Pro
  
 