import { useState, useRef } from "react";
import React from "react";

function Sum() {
  const [number_a, set_number_a] = useState(0);
  const [number_b, set_number_b] = useState(0);

  // Use ref contains a mutable object that is stored for the duration of the life of the component
  // Refs are usually used for non react native things
  // look up DOM node thing
  const output = useRef<HTMLSpanElement>(null);

  const submitSumRequest = () => {
    console.log(`Number A is: ${number_a}, Number B is: ${number_b}`);

    fetch("/sum", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ a: number_a, b: number_b }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (output.current != null) {
          output.current.innerHTML = data.sum;
        }
      })
      .catch((error) =>
        console.log(`A terrible, evil error has occurred: ${error}`)
      );
  };

  return (
    <div>
      <input
        type="number"
        value={number_a}
        onChange={(event) => set_number_a(Number(event.target.value))}
      ></input>
      <br />
      <input
        type="number"
        value={number_b}
        onChange={(event) => set_number_b(Number(event.target.value))}
      ></input>
      <br />
      <button onClick={submitSumRequest}>Add!</button>
      <br />
      <p>
        The result is: <span ref={output}>0</span>
      </p>
    </div>
  );
}

export default Sum;
