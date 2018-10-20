import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

import { Controls } from './components/Controls';

class App extends Component {
  constructor(props) {
    super(props);

    this.size = this.props.size || 10;
    this.state = {
      grid: []
    };
  }

  componentDidMount() {
    this.reset();
  }

  createEmptyMatrix = () => {
    let matrix = new Array(this.size)
      .fill(0)
      .map(row => new Array(this.size).fill(0));

    return matrix;
  }

  tick = () => {
    const { interval } = this.props;
    this.tickInterval = setInterval(this.next, interval || 500);
  }

  reset = () => {
    this.pause();

    let startingGrid = this.createEmptyMatrix().map(row =>
      row.map(cell => Math.round(Math.random()))
    );

    this.setState({
      grid: startingGrid
    });
  };

  next = () => {
    const { size } = this;
    const { grid } = this.state;
    let iterationsCnt = 0;
    let newGrid = this.createEmptyMatrix();
    let visitedDead = new Set();

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        iterationsCnt += 1;

        if (grid[y][x] === 1) {
          let alive = this.countAlive(y, x);
          iterationsCnt += 9;

          if (alive === 2 || alive === 3) {
            newGrid[y][x] = 1;
          }

          for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
              iterationsCnt += 1;

              if (i === 0 && j === 0) continue;

              let yy = (y + i + size) % size;
              let xx = (x + j + size) % size;

              if (grid[yy][xx] === 0) {
                if (visitedDead.has(`${yy}-${xx}`)) continue;

                visitedDead.add(`${yy}-${xx}`);

                let alive = this.countAlive(yy, xx);

                if (alive === 3) {
                  newGrid[yy][xx] = 1;
                }
              }
            }
          }
        }
      }
    }

    this.setState({
      grid: newGrid
    });

    // for perfomance testing purpose
    console.log("iterations: ", iterationsCnt);
  }

  countAlive = (y, x) => {
    const { size } = this;
    let { grid } = this.state;
    let alive = 0;

    for (let i = -1; i < 2; i += 1) {
      for (let j = -1; j < 2; j += 1) {
        let yy = (y + i + size) % size;
        let xx = (x + j + size) % size;

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
      <Grid centered>
        <div className="App">
          <div id="grid">
            {grid.map((row, y) =>
              row.map(
                (cell, x) =>
                  cell === 1 ? (
                    <div
                      className="cell"
                      key={`${y}-${x}`}
                      style={{
                        left: x * 5,
                        top: y * 5
                      }}
                    />
                  ) : null
              )
            )}
          </div>
          <Controls
            reset={this.reset}
            tick={this.tick}
            pause={this.pause}
            next={this.next}
          />
        </div>
      </Grid>
    );
  }
}

export default App;
