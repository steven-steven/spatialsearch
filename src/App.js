import React from 'react';
import styled from 'styled-components';
import KDBush from 'kdbush';
import Canvas from './Canvas';
import ReactCursorPosition from 'react-cursor-position';

const SCALE = 1;
const OFFSET = 10;
const WIDTH = 500;
const HEIGHT = 500;

const Button = styled.button`
  height: 4em;
  width: 6em;
  margin: 1em;
  font-weight: bold;
  font-size: 0.5em;
  text-transform: uppercase;
  cursor: pointer;
  color: white;
  border: 1px solid white;
  background-color: black;

  &:hover {
    color: black;
    background-color: #00baff;
  }
  &:focus {
    border: 1px solid #00baff;
  }
  &:active{
    background-color: #1f1f1f;
    color: white;
  }
`;

const Controls = styled.div`
  margin: 20px;
`;

const Step = styled.div`
  display: block;
  
  > p{
    font-size: 13px;
  }
`;

const Container = styled.div`
  display: flex;
`;

function draw(ctx, location, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.save();
  //ctx.scale(SCALE, SCALE);  
  ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

// Custom hook with local storage
function usePersistentState(init) {
  const [value, setValue] = React.useState(JSON.parse(localStorage.getItem('draw-app')) || init); 
  // a side effect (store local)
  React.useEffect(() => {
    localStorage.setItem('draw-app', JSON.stringify(value));
  })
  return [value, setValue];
}

// custom hook to provide location state and side-effect functionality of canvas.
function usePersistentCanvas() {
  const [locations, setLocations] = usePersistentState([]);
  
  const canvasRef = React.useRef(null);
  //side effect of changes in state, clear and draw canvas (given the ref)
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    locations.forEach(location => draw(ctx, location, '#000000'));
  });
  return [locations, setLocations, canvasRef];
}

function App() {
  const [locations, setLocations, canvasRef] = usePersistentCanvas();
  const [index, setIndex] = React.useState(new KDBush([]));
  const [range, setRange] = React.useState(50);

  function handleClear() {
    setLocations([]);
    setIndex(new KDBush([]));
  }
  function handleUndo() {
    setLocations(locations.slice(0, -1));
  }
  function handleIndex() {
    setIndex(new KDBush(locations, p=>p.x, p=>p.y, 32, Int32Array));
  }

  function handleSearch(position){
    const results = index.within(position.x, position.y, range).map(id => locations[id]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    locations.forEach(location => draw(ctx, location, '#000000'));
    results.forEach(location => draw(ctx, location, "#ffa500"));
  }
  
  function handleClick(x,y){
    const newLocation = { x, y };
    setLocations([...locations, newLocation]);
  }

  return (
    <Container>
      <ReactCursorPosition>
        <Canvas
          canvasRef={canvasRef}
          handleClick={handleClick} 
          handleSearch={handleSearch}
        />
      </ReactCursorPosition>

      <Controls>
        <Step>
          <p>Step 1: Plot Coordinates</p>
          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={handleUndo}>Undo</Button>
        </Step>
        <Step>
          <p>Step 2: Specify Range of Search ({range}px)</p>
          <input 
            type="range" 
            min="10"
            max="250" 
            value={range} 
            onChange={(e)=>{setRange(e.target.value)}}
            step="10"/>
        </Step>
        <Step>
          <p>Step 3: Index and Hover over</p>
          <Button onClick={handleIndex}>Index</Button>
        </Step>
      </Controls>
    </Container>
  )
}

export default App