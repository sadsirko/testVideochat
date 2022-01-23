import { useNavigate, useParams } from "react-router";

import socket from "../../socket";
import useWebRTC, { LOCAL_VIDEO } from "../../hooks/useWebRTC";
import ACTIONS from "../../socket/actions";
import { useEffect } from "react";

function layout(clientsNumber = 1) {
  const pairs = Array.from({ length: clientsNumber })
    .reduce((acc, next, index,arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }

      return acc;
    }, []);

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs.map((row, index, arr) => {
    if (index === arr.length - 1 && row.length === 1) {
      return [{
        width: '100%',
        height,
      }];
    }
    return row.map(() => ({
      width: '50%',
      height,
    }));
  }).flat();
}

export default function Room () {
  const { id: roomID } = useParams();
  const { clients, provideMediaRef, stream } = useWebRTC(roomID);
  const videoLayout = layout(clients.length);
  
  console.log('roomID = ', roomID);
  console.log('clietnts ', clients);

  console.log(' - socket:43 >', socket); // eslint-disable-line no-console

  const navigate = useNavigate();

  useEffect(() => {
    socket.on(ACTIONS.USER_REMOVED, () => {
      alert("You`re removed from this room");
      navigate('/');
    })
    return () => {
      socket.off(ACTIONS.USER_REMOVED);
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      height: '100vh',
    }}>
      {clients.map((clientID, index) => {
        return (
            <div key={clientID} style={videoLayout[index]} id={clientID}>
              <div>
              <video
                width='100%'
                height='100%'
                ref={instance => {
                  provideMediaRef(clientID, instance);
                }}
                autoPlay
                playsInline
                muted={clientID === LOCAL_VIDEO}
              />
              </div>
            {(clientID !== LOCAL_VIDEO) ?
              <button onClick={() => {
                socket.emit(ACTIONS.REMOVE_USER, {clientID});
              }}>Remove User</button>
              : ''  
            }            
            </div>
        );
      })}
      <button onClick={() => {
        console.log(' - 123:63 >', stream); // eslint-disable-line no-console
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;        
      }}> Офф камера</button>
    </div>
  );
}
