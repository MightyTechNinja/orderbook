import { useEffect, useState, useRef } from "react";
import { Centrifuge } from "centrifuge";
import Bids from "./Bids";
import Asks from "./Asks";

function Orderbook() {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const bidsRef = useRef([]);
  const asksRef = useRef([]);

  // Update current array with new array
  const updateArray = (curArr, newArr) => {
    for (let i = 0; i < newArr.length; i++) {
      // Binary search to find the corresponding price
      let left = 0;
      let right = curArr.length - 1;
      let exsit = false;
      newArr[i][0] = parseInt(newArr[i][0]);
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (curArr[mid][0] === newArr[i][0]) {
          left = mid;
          exsit = true;
          break;
        } else if (curArr[mid][0] < newArr[i][0]) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      if (exsit) {
        // If exsit
        if (newArr[i][1] === "0") {
          // If amount is 0, remove it from the array
          curArr.splice(left, 1);
        } else {
          // If amount is not 0, update it
          curArr[left][1] = newArr[i][1];
        }
      } else if (newArr[i][1] !== "0") {
        // If not exsit and amount is not 0, add it to the array
        curArr.splice(left, 0, newArr[i]);
      }
    }
  };

  // Parse the price to integer
  const parseIntArray = (arr) => {
    const newArr = [...arr];
    for (let i = 0; i < arr.length; i++) {
      newArr[i][0] = parseInt(arr[i][0]);
    }
    return newArr;
  };

  useEffect(() => {
    const centrifuge = new Centrifuge("wss://api.prod.rabbitx.io/ws", {
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDAwMDAwMDAwIiwiZXhwIjo2NTQ4NDg3NTY5fQ.o_qBZltZdDHBH3zHPQkcRhVBQCtejIuyq8V1yj5kYq8`,
    });

    centrifuge
      .on("connecting", function (ctx) {
        console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
      })
      .on("connected", function (ctx) {
        console.log(`connected over ${ctx.transport}`);
      })
      .on("disconnected", function (ctx) {
        console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
        // Automatically reconnect
        centrifuge.connect();
      })
      .connect();

    const sub = centrifuge.newSubscription("orderbook:BTC-USD");

    sub
      .on("publication", function (ctx) {
        // Update bids
        updateArray(bidsRef.current, ctx.data.bids);
        setBids([...bidsRef.current]);
        // Update asks
        updateArray(asksRef.current, ctx.data.asks);
        setAsks([...asksRef.current]);
      })
      .on("subscribing", function (ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
      })
      .on("subscribed", function (ctx) {
        // Set bids
        bidsRef.current = parseIntArray(ctx.data.bids);
        setBids(bidsRef.current);
        // Set asks
        asksRef.current = parseIntArray(ctx.data.asks);
        setAsks(asksRef.current);
      })
      .on("unsubscribed", function (ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
        // Automatically resubscribe
        sub.subscribe();
      })
      .subscribe();
  }, []);

  return (
    <div>
      <Bids bids={bids} />
      <Asks asks={asks} />
    </div>
  );
}

export default Orderbook;
