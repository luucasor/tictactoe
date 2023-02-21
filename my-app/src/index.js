import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//TODO Corrigir estrutura do squares para o método calculateWinner voltar a funcionar
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }  
  }
  return null;
}

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i] ? this.props.squares[i].simbol : null} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null), //{ [null, null, null, null, null, null, null, null, null]}
      }], 
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];

    let line = lines.find(item => item.includes(i));

    squares[i] = {
        simbol: this.state.xIsNext ? 'X' : 'O',
        col: line ? line.indexOf(i) + 1 : null,
        lin: line ? lines.indexOf(line) + 1 : null,
        mov: this.state.stepNumber + 1
    };
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    console.log("history", history);
    console.log("current", current);
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // let line = lines.find(item => item.includes(current.moves.squareNumber));
      // const colIndex = line ? line.indexOf(current.squareNumber) + 1 : null;
      // const linIndex = line ? lines.indexOf(line) + 1 : null;
      // const simbol = current.simbol;

      // array1.forEach((item, i) => {
      //   var same = array2[i] === item;
      //   if(!same){
      //       diff = {
      //           simbol: array2[i],
      //           index: i
      //       }
      //       return;
      //   }
      // });


      console.log("step", step);
      console.log("move", move);
      // console.log("stepMove", step.squares[move]);

      const currentMove = step.squares.find(x => x && x.mov === move);
      const desc = move ? 
        `Go to move # ${move} - ${(currentMove ? currentMove.simbol : '')} Col: ${currentMove.col} Lin: ${currentMove.lin}`:
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

