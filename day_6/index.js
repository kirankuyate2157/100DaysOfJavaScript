const shuffle = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const res = document.getElementById("result");
const btn = document.getElementById("btn");
const bg = document.getElementsByClassName("container");

const shuffleDice = () => {
  let num = shuffle();
  let path = `images/dice${num}.png`;
  return { path, num };
};

const determineWinner = (s1, s2, s3, s4) => {
  const maxScore = Math.max(s1, s2, s3, s4);

  if (s1 === maxScore) {
    return "Player 1 wins!";
  } else if (s2 === maxScore) {
    return "Player 2 wins!";
  } else if (s3 === maxScore) {
    return "Player 3 wins!";
  } else if (s4 === maxScore) {
    return "Player 4 wins!";
  } else {
    return "It's a tie!";
  }
};

btn.addEventListener("click", () => {
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");
  const dice3 = document.getElementById("dice3");
  const dice4 = document.getElementById("dice4");
  const { s1, s2, s3, s4 } = (() => {
    return {
      s1: shuffleDice(),
      s2: shuffleDice(),
      s3: shuffleDice(),
      s4: shuffleDice(),
    };
  })();

  dice1.setAttribute("src", s1.path);
  dice2.setAttribute("src", s2.path);
  dice3.setAttribute("src", s3.path);
  dice4.setAttribute("src", s4.path);
  btn.style.backgroundColor = "red";
  res.textContent = determineWinner(s1.num, s2.num, s3.num, s4.num);
});
