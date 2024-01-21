//   I don' know when I imported this
// import { eventNames } from "process";
import { error } from "console";
import { useState, useRef } from "react";

function Sum() {
  const [number_a, set_number_a] = useState(0);
  const [number_b, set_number_b] = useState(0);

  const output = useRef<HTMLSpanElement>(null);

  const submit_sum_request = () => {
    console.log(`Number a is ${number_a} and Number b is ${number_b} `);

    // using  a relative route
    // note the labels we define here must match the ones from the main.py body
    fetch("/sum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: number_a, b: number_b }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (output.current !== null) {
          output.current.innerHTML = data.sum;
        }
        console.log("Hi!!!");
      })
      .catch((error) => console.log("An error as occured"));
    console.log("Hello");
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

      <button onClick={submit_sum_request}>Add!</button>
      <br />

      <p>
        The result is: <span ref={output}></span>
      </p>
    </div>
  );
}

export default Sum;
