import "./styles.css";
import React from "react";

class BalanceAmount extends React.Component {
  render() {
    const balance = this.props.cash - this.props.bill;
    return (
      <span>
        <label>Balance amount: </label>
        {balance}
      </span>
    );
  }
}

class TableGenerator extends React.Component {
  render() {
    const denominations = this.props.denominations;
    var balance = this.props.cash - this.props.bill;
    var number,
      start,
      current,
      minNotes = 0;
    var notes = {
      "1": 0,
      "5": 0,
      "10": 0,
      "20": 0,
      "100": 0,
      "500": 0,
      "2000": 0
    };

    for (var i = denominations.length - 1; i >= 0; i--) {
      if (balance >= denominations[i]) {
        start = i;
        break;
      }
    }

    while (balance > 0) {
      current = balance;
      balance = balance % denominations[start];
      minNotes = minNotes + (current - balance) / denominations[start];
      number = denominations[start];
      notes[number] = (current - balance) / denominations[start];
      start--;
    }

    const rows = denominations.map((denomination) => {
      return (
        <tr>
          <td>{denomination}</td>
          <td>{notes[denomination]}</td>
        </tr>
      );
    });

    return (
      <table id="dnm">
        <thead>
          <tr>
            <th>Denomination</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class BillAndCashDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handleBillChange = this.handleBillChange.bind(this);
    this.handleCashChange = this.handleCashChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { isSubmitted: false };
  }

  handleBillChange(e) {
    this.props.onBillChange(e.target.value);
  }

  handleCashChange(e) {
    this.props.onCashChange(e.target.value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true });
  }

  render() {
    let x;
    const bal = this.props.cashReceived - this.props.billAmount;
    if (this.state.isSubmitted && bal < 0) {
      x = <div>Bill amount is greater than cash received!!!</div>;
    } else {
      x = (
        <div>
          {this.state.isSubmitted && (
            <BalanceAmount
              isSubmitted={this.state.isSubmitted}
              bill={this.props.billAmount}
              cash={this.props.cashReceived}
            />
          )}
          {this.state.isSubmitted && (
            <TableGenerator
              denominations={[1, 5, 10, 20, 100, 500, 2000]}
              bill={this.props.billAmount}
              cash={this.props.cashReceived}
            />
          )}
        </div>
      );
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="amount">
            <label>
              Bill amount: <br />
              <input
                type="number"
                required
                min="1"
                value={this.props.billAmount}
                onChange={this.handleBillChange}
              />
            </label>
          </div>

          <div className="amount">
            <label>
              Cash received: <br />
              <input
                type="number"
                required
                min="1"
                value={this.props.cashReceived}
                onChange={this.handleCashChange}
              />
            </label>
          </div>
          <button id="btn">Calculate</button>
        </form>
        {x}
      </div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { billAmount: 0, cashReceived: 0 };
    this.handleBillChange = this.handleBillChange.bind(this);
    this.handleCashChange = this.handleCashChange.bind(this);
  }

  handleBillChange(bill) {
    this.setState({ billAmount: bill });
  }

  handleCashChange(cash) {
    this.setState({ cashReceived: cash });
  }

  render() {
    return (
      <div className="App">
        <h1> Cash Register</h1>
        <BillAndCashDetail
          billAmount={this.state.billAmount}
          cashReceived={this.state.cashReceived}
          onBillChange={this.handleBillChange}
          onCashChange={this.handleCashChange}
        />
      </div>
    );
  }
}
