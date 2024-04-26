import React from 'react';
import tinycolor from 'tinycolor2';

const ColorSquares = ({ startingColor }) => {
  // Function to generate an array of colors
  const generateColors = (baseColor) => {
    let colors = [];
    let currentColor = tinycolor(baseColor);

    for (let i = 0; i < 10; i++) {
      colors.push(currentColor.toHexString());
      currentColor = currentColor.darken(5); // Darken the current color by 5%
    }

    return colors;
  };

  // Array of color squares
  const colorSquares = generateColors(startingColor).map((color, index) => (
    <div key={index} className='demo_color_square' style={{
      width: '60px',
      height: '60px',
      backgroundColor: color,
      margin: '5px'
    }} />
  ));

  return (
    <div style={{ display: 'flex' }}>
      {colorSquares}
    </div>
  );
};

export default ColorSquares;