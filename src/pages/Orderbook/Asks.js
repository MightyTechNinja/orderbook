import { useEffect, useState } from "react";
import AskItem from "./AskItem";

function Asks(props) {
  const [asks, setAsks] = useState([]);
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    const tempAsks = [...props.asks];
    setAsks(tempAsks.reverse());
    const tempTotals = [];
    let sum = 0;
    for (let i = 0; i < tempAsks.length; i++) {
      sum += parseFloat(tempAsks[i][1]);
      tempTotals.push(sum.toFixed(4));
    }
    setTotals(tempTotals);
  }, [props]);

  return (
    <table
      className="table table-sm table-dark table-borderless"
      style={{ width: "400px" }}
    >
      <thead>
        <tr>
          <th>
            Price <span className="badge text-bg-secondary">USD</span>
          </th>
          <th style={{ textAlign: "right" }}>
            Amount <span className="badge text-bg-secondary">BTC</span>
          </th>
          <th style={{ textAlign: "right" }}>
            Total <span className="badge text-bg-secondary">BTC</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {asks.length > 0 &&
          asks.map((ask, index) => (
            <AskItem ask={ask} total={totals[index]} key={index} />
          ))}
      </tbody>
    </table>
  );
}

export default Asks;
