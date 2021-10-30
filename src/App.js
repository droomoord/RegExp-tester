import "./App.scss";
import { useState, useEffect } from "react";
import InfoBox from "./components/InfoBox";
import info from "./img/info.png";
import js from "./img/js.png";

function App() {
  const [input, setInput] = useState("the");
  const [input2, setInput2] = useState("");
  const [regexCode, setRegexCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [flags, setFlags] = useState({
    g: {
      name: "global",
      state: true,
      description:
        'The global flag indicates that the regular expression should be tested against all possible matches in a string. A regular expression defined as both global ("g") and sticky ("y") will ignore the global flag and perform sticky matches.',
    },
    i: {
      name: "case insensative",
      state: true,
      description:
        "This flag indicates that case should be ignored while attempting a match in a string.",
    },
    m: {
      name: "multi-line",
      state: false,
      description:
        'This flag indicates that a multiline input string should be treated as multiple lines. For example, if "m" is used, "^" and "$" change from matching at only the start or end of the entire string to the start or end of any line within the string.',
    },
    s: {
      name: "allow . to match \\n",
      state: false,
      description:
        'This flag indicates that the dot special character (".") should additionally match the following line terminator ("newline") characters in a string, which it would not match otherwise',
    },
    u: {
      name: "unicode",
      state: false,
      description:
        'This flag enables various Unicode-related features. With the "u" flag, any Unicode code point escapes will be interpreted as such, for example.',
    },
    y: {
      name: "sticky",
      state: false,
      description:
        "This flag indicates that it matches only from the index indicated by the lastIndex property of this regular expression in the target string (and does not attempt to match from any later indexes). A regular expression defined as both sticky and global ignores the global flag.",
    },
  });
  const [output, setOutput] = useState(null);
  const [methods] = useState([
    {
      name: "test",
      code: "$regex.test(string)",
      methodOf: "regex",
    },
    {
      name: "exec",
      code: "$regex.exec(string)",
      methodOf: "regex",
    },
    {
      name: "replace",
      code: "string.replace($regex, $replacement)",
      methodOf: "string",
    },

    {
      name: "search",
      code: "string.search($regex)",
      methodOf: "string",
    },
    {
      name: "match",
      code: "string.match($regex)",
      methodOf: "string",
    },
  ]);

  const [method, setMethod] = useState(methods[0].name);
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog."
  );
  function createFlagsString(flags) {
    let flagsString = "";
    for (let flag in flags) {
      flagsString += flags[flag].state ? flag : "";
    }
    return flagsString;
  }

  useEffect(() => {
    let flagsString = createFlagsString(flags);
    setRegexCode(`/${input}/${flagsString}`);
  }, [input, flags]);

  useEffect(() => {
    const code = methods.find((m) => m.name === method).code;
    let parsedCode = code.replace(/\$regex/, regexCode);
    if (method === "replace") {
      parsedCode = parsedCode[method](/\$replacement/, `"${input2}"`);
    }
    setJsCode(parsedCode);
  }, [method, regexCode, input2, methods]);

  useEffect(() => {
    function arrayToString(array) {
      let string = "";
      for (let item in array) {
        string += `${item}: ${
          typeof array[item] === "string"
            ? '"' + array[item] + '"'
            : array[item]
        }, `;
      }
      return `[${string}]`.replace(/, (])$/, "$1");
    }
    setOutput(() => {
      let flagsString = createFlagsString(flags);
      let regex;
      let output;
      try {
        regex = new RegExp(input, flagsString);
        const methodOf = methods.find((m) => m.name === method).methodOf;
        if (method === "replace") {
          output = text.replace(regex, input2);
        } else if (methodOf === "regex") output = regex[method](text);
        else output = text[method](regex);
      } catch (error) {
        output = error;
      }
      switch (typeof output) {
        case "boolean":
          return output ? "true" : "false";
        case "object":
          if (Array.isArray(output)) {
            return arrayToString(output);
          } else if (output instanceof Error) {
            return "error";
          } else return JSON.stringify(output);
        case "string":
          return `"${output}"`;
        default:
          return output;
      }
    });
  }, [flags, input, methods, method, text, input2]);

  useEffect(() => {
    const output = document.querySelector(".output");
    output.innerHTML = output.innerHTML
      .replace(
        /true|false|null|undefined|NaN/gm,
        "<span class='blue'>$&</span>"
      )
      .replace(/\d+[^:]/gm, "<span class='number'>$&</span>")
      .replace(/error/, "<span class='error'>$&</span>")
      .replace(/"[^"]*"/gm, "<span class='string'>$&</span>");
  }, [output]);

  function changedCheckbox(flag, state) {
    const flagsCopy = { ...flags };
    flagsCopy[flag].state = !state;
    setFlags(flagsCopy);
  }

  return (
    <div className="app">
      <div className="side-bar">
        <div className="input-wrapper">
          <div className="input-group">
            <label htmlFor="input">regExp: (without //)</label>
            <input
              id="input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {method === "replace" ? (
            <div className="input-group">
              <label htmlFor="input2">replace with:</label>
              <input
                id="input2"
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
              />
            </div>
          ) : null}
        </div>
        <div className="checkboxes">
          <div className="title">Flags</div>
          {Object.keys(flags).map((flag) => {
            const { state, name, description } = flags[flag];
            return (
              <div key={flag}>
                <div className="checkbox">
                  <input
                    type="checkbox"
                    name={name}
                    id={flag}
                    defaultChecked={state}
                    onChange={() => changedCheckbox(flag, state)}
                  />
                  <label htmlFor={flag}>
                    {flags[flag].name}
                    <span className="info">
                      <img src={info} alt="" />
                    </span>
                    <InfoBox description={description} />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <div className="radios">
          <div className="title">Methods</div>
          {methods.map((m) => {
            return (
              <label key={m.name}>
                <input
                  type="radio"
                  name={m.name}
                  value={m.name}
                  checked={m.name === method}
                  onChange={() => setMethod(m.name)}
                />
                <span>{m.name}</span>
              </label>
            );
          })}
        </div>
        <div className="code">
          RegEx syntax: <strong>{regexCode}</strong>
        </div>
        <div className="code">
          <img src={js} alt="" width={50} />
          <strong>{jsCode}</strong>
        </div>
      </div>
      <div className="main">
        <div>
          <label htmlFor="input-text">input string:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            name="input-text"
            id="input-text"
            cols="30"
            rows="10"
          ></textarea>
        </div>

        <div>
          Output: <span className="output">{output}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
