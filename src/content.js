/*global chrome*/
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import "./content.css";

const Main = () => {
  const [count, setCount] = useState(0);
  const [currentTabId, setCurrentTabId] = useState(0);

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.message === "clicked_browser_action") {
        toggle();
        setCurrentTabId(request.tabId);
        setCount(Number(localStorage.getItem(request.tabId)));
      }
    }
  );

  return (
    <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
      <FrameContextConsumer>
        {
          ({ document, window }) => {
            return (
              <div className={'extension_wrapper'}>
                <h1>Clicked {count} times</h1>
                <div className="button_wrapper">
                  <button
                    onClick={() => {
                      setCount((prevCount) => prevCount + 1);
                      localStorage.setItem(currentTabId, count + 1);
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => {
                      count > 0 && setCount((prevCount) => prevCount - 1);
                      localStorage.setItem(currentTabId, count - 1);
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      setCount(0);
                      localStorage.setItem(currentTabId, 0);
                    }}
                  >
                    reset
                  </button>
                </div>
              </div>
            )
          }
        }
      </FrameContextConsumer>
    </Frame>
  );
}

const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";

function toggle() {
  if (app.style.display === "none") {
    app.style.display = "block";
  } else {
    app.style.display = "none";
  }
}
