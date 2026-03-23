import { useSocket } from "../context/SocketContext";

export default function IncomingCall() {
  const { incomingCall, answerCall, setIncomingCall } = useSocket();

  if (!incomingCall) return null;

  return (
    <div className="modal-overlay">
      <div className="card" style={{textAlign:'center', width:'300px', border:'2px solid var(--primary)'}}>
        <h3 className="mb-10">📞 Incoming Call</h3>
        <p className="mb-20" style={{fontSize:'1.2rem'}}><b>{incomingCall.name}</b> is calling you...</p>
        
        <div className="flex gap-10 justify-center">
          <button onClick={() => setIncomingCall(null)} className="btn btn-danger">Decline</button>
          <button onClick={answerCall} className="btn btn-success">Answer</button>
        </div>
      </div>
    </div>
  );
}