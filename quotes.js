const islamicQuotes = [
    "Sesungguhnya bersama kesulitan ada kemudahan. (QS. Ash-Sharh: 6)",
    "Barang siapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga. (HR. Muslim)",
    "Dan barang siapa yang bertakwa kepada Allah, niscaya Dia akan menjadikan baginya jalan keluar. (QS. At-Talaq: 2)",
    "Berdoalah kepada-Ku, niscaya akan Kuperkenankan bagimu. (QS. Ghafir: 60)",
    "Carilah ilmu sejak dari buaian hingga liang lahat. (HR. Ibnu Abdil Barr)",
    "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. (QS. Al-Baqarah: 286)",
    "Keutamaan ilmu lebih baik daripada keutamaan ibadah. (HR. Tirmidzi)",
    "Sesungguhnya Allah menyukai jika seseorang melakukan pekerjaan dengan sempurna. (HR. Thabrani)",
    "Janganlah kamu berputus asa dari rahmat Allah. (QS. Az-Zumar: 53)",
    "Ilmu itu cahaya, dan cahaya Allah tidak diberikan kepada orang yang bermaksiat. (HR. Ad-Dailami)"
];

function displayRandomQuote() {
    const quoteText = document.querySelector('#quote-text');
    const randomQuote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)];
    quoteText.textContent = randomQuote;
    quoteText.style.animation = 'slideIn 0.5s';
    setTimeout(() => quoteText.style.animation = '', 500);
}

document.addEventListener('DOMContentLoaded', () => {
    displayRandomQuote();
    setInterval(displayRandomQuote, 30000); // Change quote every 30 seconds
});