function AskItem(props) {
  const { ask, total } = props;
  const price = new Intl.NumberFormat("en-US").format(ask[0]);
  const amount = parseFloat(ask[1]).toFixed(4);

  return (
    <tr>
      <td className="text-info">{price}</td>
      <td align="right">{amount}</td>
      <td align="right">{total}</td>
    </tr>
  );
}

export default AskItem;
