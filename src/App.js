import React, { useState } from "react";
import "./styles.css";

function One() {
  console.log("Rndering One Component");
  return <h2>One</h2>;
}

function Two() {
  console.log("Rndering Two Component");
  return <h2>Two</h2>;
}

const MemoOne = React.memo(function One() {
  console.log("Rndering MemoOne Component");
  return <h2>MemoOne</h2>;
});
const MemoTwo = React.memo(function Two() {
  console.log("Rndering MemoTwo Component");
  return <h2>MemoTwo</h2>;
});

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <div>{count}</div>
      <button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        Click
      </button>
      <One />
      <Two />
      <MemoOne />
      <MemoTwo />
    </div>
  );
}
