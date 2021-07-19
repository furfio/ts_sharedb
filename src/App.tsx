import {useState,useEffect} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Stage, Layer, Rect, Text} from 'react-konva';

const sharedb = require('sharedb/lib/client');

// Open WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket("ws://localhost:8080");
const connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
const doc = connection.get('examples', 'counter');

function App() {

  const [num,setNum] = useState()
  const [rect,setRect] = useState([0,0,100,100])

  useEffect(()=>{
    // Get initial value of document and subscribe to changes
    doc.subscribe(showNumbers);
    // When document changes (by this client or any other, or the server),
    // update the number on the page
    doc.on('op', showNumbers);

  },[connection])

  function increment() {
    // Increment `doc.data.numClicks`. See
    // https://github.com/ottypes/json0 for list of valid operations.
    doc.submitOp([{p: ['numClicks'], na: 1}]);
  }
  const showNumbers =()=>{
    setNum(doc.data.numClicks)
  }

  const move = (e:any) =>{
    setRect([e.target.x(),e.target.y(),100,100])
  }

  return (
    <div className="App">
      <button onClick={increment}> +1</button>
      {num}
      <div>
        <p>
          {rect[0]},{rect[1]}
        </p>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Text text="Some text on canvas" fontSize={15} />
            <Rect
                draggable={true}
                x={rect[0]}
                y={rect[1]}
                width={100}
                height={100}
                opacity={0.5}
                fill="red"
                shadowBlur={10}
                onDragMove={move}
            />
          </Layer>
        </Stage>
      </div>

    </div>
  );
}
export default App;
