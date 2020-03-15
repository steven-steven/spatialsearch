import React from 'react';
import styled from 'styled-components';

const SCALE = 1;
const OFFSET = 0;
const WIDTH = 500;
const HEIGHT = 500;

const Button = styled.button`
  height: 3em;
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
  position: absolute;
  top: 0;
  left: 0;
`;

const Container = styled.div`
  border: 1px solid black;
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
`;

function draw(ctx, location) {
  ctx.fillStyle = '#000000';
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
    locations.forEach(location => draw(ctx, location));
  });
  return [locations, setLocations, canvasRef];
}

function App() {
  const [locations, setLocations, canvasRef] = usePersistentCanvas();

  function handleClear() {
    setLocations([]);
  }
  function handleUndo() {
    setLocations(locations.slice(0, -1));
  }

  return (
    <Container>
      <Controls>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={handleUndo}>Undo</Button>
      </Controls>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onClick={e => {
          const newLocation = { x: e.clientX, y: e.clientY };
          setLocations([...locations, newLocation]);
        }}
      />
    </Container>
  )
}

export default App