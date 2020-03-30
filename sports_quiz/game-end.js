const USERNAME = document.getElementById('username')
const SAVESCOREBTN = document.getElementById('saveScoreBtn')
const FINALSCORE = document.getElementById('finalScore')
const MOSTRECENTSCORE = localStorage.getItem('mostRecentScore')

FINALSCORE.innerText = `FINAL SCORE:\n${MOSTRECENTSCORE}/15`
