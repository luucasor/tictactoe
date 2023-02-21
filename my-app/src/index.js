import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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

    const squaresA = squares[a] ? squares[a].simbol : null;
    const squaresB = squares[b] ? squares[b].simbol : null;
    const squaresC = squares[c] ? squares[c].simbol : null;

    if(squaresA && squaresA === squaresB && squaresA === squaresC){
      return {
        simbol: squaresA,
        moves: [squares[a], squares[b], squares[c]]
      };
    }  
  }
  return null;
}

function Square(props) {
    return (
      <button className={ props.winner ? "square winner-square" : "square"} onClick={props.onClick} reference={props.reference}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(counter, col) {
    const winner = this.props.winnerNumbers && this.props.winnerNumbers.find(item => item === counter) >= 0 ? true : false;
    return (
      <Square 
        value={this.props.squares[counter] ? this.props.squares[counter].simbol : null} 
        onClick={() => this.props.onClick(counter)}
        key={counter}
        reference={ "col-"+(col+1) }
        winner={ winner }
      />
    );
  }

  render() {
    let board = [];
    let counter = 0;

    for(var i = 0; i < this.props.squareNumbers.length; i++){
      let rows = [];
      for(var ii = 0; ii < this.props.squareNumbers[i].length; ii++){
        rows.push(this.renderSquare(counter, ii));
        counter++;
      }
      board.push(React.createElement('div', { className: "board-row", key: "row-"+i, reference:"row-"+(i+1) }, rows));
    }
    return board;
  }
}

class Sorting extends React.Component {
  render() {
     return <button onClick={() => this.props.onClick()}>Sorting: { this.props.ascending ? "DESC" : "ASC" }</button>
  };
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }], 
      stepNumber: 0,
      xIsNext: true,
      ascending: true
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }

    let line = this.props.squareNumbers.find(item => item.includes(i));
    squares[i] = {
        simbol: this.state.xIsNext ? 'X' : 'O',
        col: line ? line.indexOf(i) + 1 : null,
        lin: line ? this.props.squareNumbers.indexOf(line) + 1 : null,
        mov: this.state.stepNumber + 1,
        squareNumber: i
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

  handleSortClick(){
    this.setState({
      ascending: !this.state.ascending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winnerNumbers = winner ? winner.moves.map(item => {
      return item.squareNumber;
    }) : null;

    const moves = history.map((step, move) => {
      const currentMove = step.squares.find(x => x && x.mov === move);
      const desc = move ? 
        `Go to move # ${move} - ${(currentMove ? currentMove.simbol : '')} Col: ${currentMove.col} Lin: ${currentMove.lin}`:
        'Go to game start';
      return (
        <li key={move}>
          { move === this.state.stepNumber ? (
            <button onClick={() => this.jumpTo(move)}><b>{ desc }</b></button>
          ) : (
            <button onClick={() => this.jumpTo(move)}>{ desc }</button>
          )}
        </li>
      );
    });

    if(!this.state.ascending){
      moves.reverse();
    }

    let status;
    if(winner){
      status = 'Winner: ' + winner.simbol;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={ current.squares }
            onClick={ (i) => this.handleClick(i) }
            squareNumbers={ this.props.squareNumbers }
            winnerNumbers={ winnerNumbers }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <Sorting ascending={ this.state.ascending } onClick={()=> this.handleSortClick()}/>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
const squareNumbers = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];
root.render(<Game squareNumbers={squareNumbers}/>);

