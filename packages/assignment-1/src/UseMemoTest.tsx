import { useState } from "react";
import { repeatBarked, repeatMeow } from "./utils";


// NOTE: state의 값이 정상적으로 변경이 되도록 만들어주세요.
export default function UseMemoTest() {
  const [meowCount, setMeowCount] = useState(1);
  const [barkedCount, setBarkedCount] = useState(1);

  const meow = repeatMeow(meowCount);
  const bark = repeatBarked(barkedCount);

  return (
    <div>
      <p data-testid="cat">고양이 "{meow}"</p>
      <p data-testid="dog">강아지 "{bark}"</p>
      <button data-testid="meow" onClick={() => setMeowCount(n => n + 1)}>야옹</button>
      <button data-testid="bark" onClick={() => setBarkedCount(n => n + 1)}>멍멍</button>
    </div>
  );
}
