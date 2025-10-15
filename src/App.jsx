import './App.css' 
import './index.css' 


const hasLiked = true;


const Card = ({title}) => {
  return (
    <div className='card'>
      <h2> {title}</h2>
    </div>
  )
}

const App = () => {

  return (
    <div className='card-container'>
      <h2> Functional Arrow Component</h2>
      <Card title="Baahubali"/>
      <Card title="RRR" />
      <Card title="Kalki 2898 A.D" />
    
    </div>
  )
}
export default App
