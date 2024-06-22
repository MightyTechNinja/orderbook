import { useEffect, useState } from "react";
import BidItem from "./BidItem";

function Bids(props) {
  const [bids, setBids] = useState([]);
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    const tempBids = [...props.bids];
    const tempTotals = [];
    let sum = 0;
    for (let i = 0; i < tempBids.length; i++) {
      sum += parseFloat(tempBids[i][1]);
      tempTotals.push(sum.toFixed(4));
    }
    setBids(tempBids.reverse());
    setTotals(tempTotals.reverse());
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
        {bids.length > 0 &&
          bids.map((bid, index) => (
            <BidItem bid={bid} total={totals[index]} key={index} />
          ))}
      </tbody>
    </table>
  );
}

export default Bids;
