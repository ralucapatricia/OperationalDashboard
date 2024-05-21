import "./TicketCount.css";

export default function TicketCount({value}) {
  return (
    <div className="ticket-count-container">
      <div className="ticket-count">TICKET COUNT:</div>
      <div className="number">{value}</div>
    </div>
  );
}
