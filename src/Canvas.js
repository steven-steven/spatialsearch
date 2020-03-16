import React from 'react';
import styled from 'styled-components';

const WIDTH = 500;
const HEIGHT = 500;

const StyledCanvas = styled.canvas`
  border: 1px solid black;
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
`

function Canvas({handleClick, canvasRef, position, handleSearch}) {

  React.useEffect(() => {
    handleSearch(position);
  }, [handleSearch, position]);

  return (
      <StyledCanvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onClick={e => {
          handleClick(e.clientX, e.clientY);
        }}
      />
  ) 
}


export default Canvas