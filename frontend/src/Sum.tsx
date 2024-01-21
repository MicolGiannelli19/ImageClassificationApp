import { useState, useRef } from "react";
// understand what useRef does

function Sum() {
  const [number_a, set_number_a] = useState(0);
  const [number_b, set_number_b] = useState(0);

  //   I think there is a mistake in the code because null is not in round brackets
  const output = useRef<HTMLSpanElement>(null);

  //   there is an issue with this output thing

  // Note how functions are defined as variables
  const submit_sum_request = () => {};
  // I don't understand why this is being called before I press the button
  console.log(`Number A is : ${number_a}, Number B`);
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
      <p>
        The result is: <span ref={output}>0</span>
      </p>
      <br />
    </div>
  );
}

export default Sum;
