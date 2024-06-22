function BidItem(props) {
  const { bid, total } = props;
  const price = new Intl.NumberFormat("en-US").format(bid[0]);
  const amount = parseFloat(bid[1]).toFixed(4);

  return (
    <tr>
      <td className="text-danger">{price}</td>
      <td align="right">{amount}</td>
      <td align="right">{total}</td>
    </tr>
  );
}

export default BidItem;
