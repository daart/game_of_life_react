import React, { Component } from 'react';

import { Controls } from './components/Controls';

class App extends Component {
  constructor(props) {
    super(props);

    this.size = this.props.size || 10;
    this.state = {
      grid: [] 
    }
  }
  
  createEmptyMatrix = () => {
    let matrix = new Array(this.size).fill(0).map(row => new Array(this.size).fill(0))
    
    return matrix;
  }

  tick = () => {
    const { interval } = this.props;
    this.tickInterval = setInterval(this.next, interval || 500);
  }

  reset = () => {
    this.pause();

    let startingGrid = this.createEmptyMatrix()
      .map(row => row
        .map(cell => Math.round(Math.random())));

    this.setState({
      grid: startingGrid
      
    });
    
  }

  componentDidMount() {
    this.reset();
  }
  
  next = () => {
    const { size } = this;
    const { grid } = this.state;
    let iterationsCnt = 0;
    let newGrid = this.createEmptyMatrix();

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        iterationsCnt += 1;

        let alive = this.countAlive(y, x);
        iterationsCnt += 9;

        if (grid[y][x] === 1 && (alive < 2 || alive > 3)) {
          newGrid[y][x] = 0;
        } else if(grid[y][x] === 0 && alive === 3) {
          newGrid[y][x] = 1
        } else {
          newGrid[y][x] = grid[y][x];
        }
      }
    }

    this.setState({
      grid: newGrid
    })

    // for perfomance testing purpose
    console.log('iterations: ', iterationsCnt); 
  }

  countAlive = (y, x) => {
    let { grid } = this.state;
    let alive = 0;
    
    for (let i = -1; i < 2; i += 1) {
      for (let j = -1; j < 2; j += 1) {
        let yy = (y + i + this.size) % this.size;
        let xx = (x + j + this.size) % this.size;
        
        alive += grid[yy][xx];
      }
    }

    alive -= grid[y][x];

    return alive; 
  }

  pause = () => {
    clearInterval(this.tickInterval);
  }

  render() {
    const { grid } = this.state;

    return (
      <div className="App">
        <div id="grid">
        {
          grid.map((row, y) => (
            row.map((cell, x) => cell === 1 ? (
              <div
                className="cell"
                key={`${y}-${x}`}
                style={{
                  left: x * 5,
                  top: y * 5
                }}              
              >
              </div>
            ) : null)
          ))
        }
        </div>
        <Controls reset={this.reset} tick={this.tick} pause={this.pause} next={this.next} />
      </div>
    );
  }
}

export default App;
