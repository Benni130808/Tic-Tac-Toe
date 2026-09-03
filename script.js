let spielfeld = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let aktuellerSpieler = "X";
let spielBeendet = false;
let punktestand1 = 0;
let punktestand2 = 0;
let naechsterStartSpieler = "X";
const kombinationen = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function holeWertAnIndex(index) {
  const reihe = Math.floor(index / 3);
  const spalte = index % 3;
  return spielfeld[reihe][spalte];
}

function wechsleSpieler() {
  aktuellerSpieler = aktuellerSpieler === "X" ? "O" : "X";
}

function pruefeUnentschieden() {
  for (let reihe = 0; reihe < 3; reihe++) {
    for (let spalte = 0; spalte < 3; spalte++) {
      if (spielfeld[reihe][spalte] === "") {
        return false;
      }
    }
  }
  return true;
}

function pruefeGewinner() {
  for (const [a, b, c] of kombinationen) {
    const wertA = holeWertAnIndex(a);
    const wertB = holeWertAnIndex(b);
    const wertC = holeWertAnIndex(c);
    if (wertA && wertA === wertB && wertA === wertC) {
      return wertA;
    }
  }
  return null;
}

function istZugErlaubt(reihe, spalte) {
  if (spielBeendet || spielfeld[reihe][spalte] !== "") {
    return false;
  } else {
    return true;
  }
}

function setzeZug(reihe, spalte) {
  if (!istZugErlaubt(reihe, spalte)) {
    return;
  }
  spielfeld[reihe][spalte] = aktuellerSpieler;
}

function aktualisiereSpielfeld() {
  for (let reihe = 0; reihe < 3; reihe++) {
    for (let spalte = 0; spalte < 3; spalte++) {
      const zellenZahl = reihe * 3 + spalte;
      const zelle = document.querySelector(
        `[data-index="zelle-${zellenZahl}"]`,
      );
      const wert = spielfeld[reihe][spalte];
      zelle.textContent = wert;
      if (wert === "X") {
        zelle.classList.add("spieler-x");
        zelle.classList.remove("spieler-o");
      } else if (wert === "O") {
        zelle.classList.add("spieler-o");
        zelle.classList.remove("spieler-x");
      } else {
        zelle.classList.remove("spieler-x", "spieler-o");
      }
    }
  }
}

function beendeSpiel(gewinner) {
  spielBeendet = true;
  const overlay = document.getElementById("spielende-overlay");
  overlay.hidden = false;
  const punktestand1Anzeige = document.getElementById("punktestand-1");
  const punktestand2Anzeige = document.getElementById("punktestand-2");
  let gewinnerText = document.getElementById("gewinner");
  let gewinnerLabel = document.getElementById("gewinner-label");
  if (gewinner === "X") {
    punktestand1++;
    punktestand1Anzeige.textContent = punktestand1;
    punktestand2Anzeige.textContent = punktestand2;
    gewinnerLabel.textContent = "Gewinner: ";
    gewinnerText.textContent = "X hat gewonnen!";
  } else if (gewinner === "O") {
    punktestand2++;
    punktestand2Anzeige.textContent = punktestand2;
    punktestand1Anzeige.textContent = punktestand1;
    gewinnerLabel.textContent = "Gewinner: ";
    gewinnerText.textContent = "O hat gewonnen!";
  } else if (gewinner === null) {
    gewinnerLabel.textContent = "";
    gewinnerText.textContent = "Unentschieden!";
  }
}

function neuesSpiel() {
  document.getElementById("spielende-overlay").hidden = true;
  spielfeld = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  aktuellerSpieler = naechsterStartSpieler;
  naechsterStartSpieler = aktuellerSpieler === "X" ? "O" : "X";
  spielBeendet = false;
  aktualisiereSpielfeld();
}

function handleZellenKlick(event) {
  const zelle = event.target;
  const index = parseInt(zelle.dataset.index.split("-")[1]);
  const reihe = Math.floor(index / 3);
  const spalte = index % 3;
  if (istZugErlaubt(reihe, spalte)) {
    setzeZug(reihe, spalte);
    wechsleSpieler();
    const gewinner = pruefeGewinner();
    if (gewinner) {
      beendeSpiel(gewinner);
    } else if (pruefeUnentschieden()) {
      beendeSpiel(null);
    }
  }
  aktualisiereSpielfeld();
}

document.querySelectorAll(".zelle").forEach((zelle) => {
  zelle.addEventListener("click", handleZellenKlick);
});
document
  .getElementById("nochmal-spielen")
  .addEventListener("click", function () {
    neuesSpiel();
  });

neuesSpiel();