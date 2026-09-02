/* =========================================================
   DREAMVERSE
   Life Simulator + Story Game
========================================================= */


/* =========================
   DEFAULT GAME
========================= */

const DEFAULT_GAME = {

  name: "Nova",

  personality: "Kind Soul",

  avatar: "🌙",

  coins: 350,

  level: 1,

  xp: 0,

  happiness: 80,

  energy: 100,

  day: 1,

  activitiesToday: 0,

  storyChoice: null,

  friendships: {

    aeri: 10,

    leo: 5,

    mira: 0,

    kael: 0

  },

  journal: [

    {

      day: 1,

      title: "Welcome to Lunaria",

      text:
        "You opened your eyes in a strange but beautiful city. Something tells you that this place is waiting for you."

    }

  ],

  achievements: {

    firstStep: false,

    socialButterfly: false,

    creativeSoul: false,

    bookworm: false,

    kindHeart: false,

    mystery: false

  }

};


let game = loadGame();


/* =========================
   LOAD GAME
========================= */

function loadGame() {

  try {

    const saved =
      localStorage.getItem(
        "dreamverseSave"
      );

    if (!saved) {

      return structuredClone(
        DEFAULT_GAME
      );

    }

    return {
      ...structuredClone(DEFAULT_GAME),
      ...JSON.parse(saved)
    };

  } catch {

    return structuredClone(
      DEFAULT_GAME
    );

  }

}


/* =========================
   SAVE
========================= */

function saveGame(showToastMessage = false) {

  localStorage.setItem(
    "dreamverseSave",
    JSON.stringify(game)
  );

  updateUI();

  if (showToastMessage) {

    showToast(
      "💾",
      "Your dream has been saved."
    );

  }

}


/* =========================
   DOM
========================= */

const coinsEl =
  document.getElementById("coins");

const levelEl =
  document.getElementById("level");

const happinessEl =
  document.getElementById("happiness");

const energyEl =
  document.getElementById("energy");

const xpEl =
  document.getElementById("xp");

const happinessBar =
  document.getElementById("happinessBar");

const energyBar =
  document.getElementById("energyBar");

const xpBar =
  document.getElementById("xpBar");

const characterName =
  document.getElementById("characterName");

const characterAvatar =
  document.getElementById("characterAvatar");

const personalityText =
  document.getElementById("personalityText");

const dayText =
  document.getElementById("dayText");

const timeText =
  document.getElementById("timeText");

const welcomeTitle =
  document.getElementById("welcomeTitle");

const questBar =
  document.getElementById("questBar");

const questCount =
  document.getElementById("questCount");


/* =========================
   NAVIGATION
========================= */

const allNavButtons =
  document.querySelectorAll(
    ".nav-button, .mobile-nav button"
  );


allNavButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const page =
        button.dataset.page;

      switchPage(page);

    }
  );

});


function switchPage(page) {

  document
    .querySelectorAll(".page")
    .forEach(section => {

      section.classList.remove("active");

    });


  const target =
    document.getElementById(
      `${page}Page`
    );

  if (target) {

    target.classList.add("active");

  }


  allNavButtons.forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.page === page
    );

  });

}


/* =========================
   TIME
========================= */

function getTimeOfDay() {

  const hour =
    new Date().getHours();

  if (hour >= 5 && hour < 11) {

    return {
      name: "Morning",
      emoji: "🌅"
    };

  }

  if (hour >= 11 && hour < 17) {

    return {
      name: "Afternoon",
      emoji: "☀️"
    };

  }

  if (hour >= 17 && hour < 21) {

    return {
      name: "Evening",
      emoji: "🌆"
    };

  }

  return {

    name: "Night",
    emoji: "🌙"

  };

}


/* =========================
   UI
========================= */

function updateUI() {

  coinsEl.textContent =
    game.coins.toLocaleString();

  levelEl.textContent =
    game.level;

  happinessEl.textContent =
    game.happiness;

  energyEl.textContent =
    game.energy;

  xpEl.textContent =
    game.xp;


  characterName.textContent =
    game.name;

  characterAvatar.textContent =
    game.avatar;

  personalityText.textContent =
    game.personality;


  happinessBar.style.width =
    `${game.happiness}%`;

  energyBar.style.width =
    `${game.energy}%`;


  const needed =
    xpNeeded();

  xpBar.style.width =
    `${Math.min(
      100,
      (game.xp / needed) * 100
    )}%`;


  dayText.textContent =
    `Day ${game.day}`;


  const time =
    getTimeOfDay();

  timeText.textContent =
    time.name;


  welcomeTitle.textContent =
    `Good ${time.name.toLowerCase()}, ${game.name} ${time.emoji}`;


  questCount.textContent =
    `${Math.min(game.activitiesToday, 2)} / 2`;


  questBar.style.width =
    `${Math.min(
      100,
      game.activitiesToday * 50
    )}%`;


  updateFriendships();

  renderJournal();

  renderAchievements();

}


/* =========================
   XP
========================= */

function xpNeeded() {

  return 100 +
    (game.level - 1) * 50;

}


function addXP(amount) {

  game.xp += amount;


  while (
    game.xp >= xpNeeded()
  ) {

    game.xp -= xpNeeded();

    game.level++;

    game.coins += 100;

    game.energy =
      Math.min(
        100,
        game.energy + 15
      );


    showToast(
      "⭐",
      `Level ${game.level}! +100 coins`
    );

  }

}


/* =========================
   ACTIVITIES
========================= */

const ACTIONS = {

  cafe: {

    title: "Moon Café",

    message:
      "You spend a peaceful afternoon at Moon Café. The warm lights make you feel strangely at home.",

    happiness: 12,

    energy: -8,

    coins: -10,

    xp: 12

  },


  library: {

    title: "Dream Library",

    message:
      "You discover a book about the history of Lunaria. You learn something you didn't know before.",

    happiness: 3,

    energy: -15,

    coins: 0,

    xp: 25

  },


  park: {

    title: "Starlight Park",

    message:
      "You sit beneath a flowering tree and watch the clouds drift by. Everything feels peaceful.",

    happiness: 10,

    energy: 20,

    coins: 0,

    xp: 8

  },


  art: {

    title: "Creative Corner",

    message:
      "You create something beautiful. Maybe one day, someone will discover your little masterpiece.",

    happiness: 8,

    energy: -12,

    coins: 25,

    xp: 22

  }

};


document
  .querySelectorAll(".action-card")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        performAction(
          button.dataset.action
        );

      }
    );

  });


function performAction(actionId) {

  const action =
    ACTIONS[actionId];

  if (!action) return;


  if (
    game.energy + action.energy < 0
  ) {

    showToast(
      "⚡",
      "You're too tired. Rest first!"
    );

    return;

  }


  game.energy =
    clamp(
      game.energy + action.energy,
      0,
      100
    );


  game.happiness =
    clamp(
      game.happiness + action.happiness,
      0,
      100
    );


  game.coins =
    Math.max(
      0,
      game.coins + action.coins
    );


  addXP(action.xp);


  game.activitiesToday++;


  addJournal(
    action.title,
    action.message
  );


  checkAchievements();


  saveGame();


  openDialogue(
    "✨",
    action.title,
    action.message
  );

}


/* =========================
   STORY
========================= */

document
  .querySelectorAll(".choice-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        chooseStory(
          button.dataset.choice
        );

      }
    );

  });


function chooseStory(choice) {

  if (game.storyChoice) {

    showToast(
      "📖",
      "You've already made this choice."
    );

    return;

  }


  game.storyChoice = choice;


  if (choice === "open") {

    game.coins += 50;

    game.happiness =
      clamp(
        game.happiness + 8,
        0,
        100
      );

    addXP(30);


    addJournal(
      "The Silver Letter",
      "You opened the mysterious letter. Inside was a tiny silver star and a message: 'Find the place where dreams begin.'"
    );


    document.getElementById(
      "storyText"
    ).textContent =
      "Inside the envelope is a tiny silver star and a mysterious message. Something tells you this is only the beginning.";


    showToast(
      "✉️",
      "You discovered something mysterious!"
    );

  }


  if (choice === "ignore") {

    game.energy =
      clamp(
        game.energy + 5,
        0,
        100
      );


    addXP(8);


    addJournal(
      "A Letter Left Behind",
      "You decided not to open the mysterious letter. Perhaps tomorrow will bring the answer."
    );


    document.getElementById(
      "storyText"
    ).textContent =
      "The silver envelope remains beneath your door. You wonder if you made the right decision.";


    showToast(
      "🌙",
      "The mystery remains..."
    );

  }


  checkAchievements();

  saveGame();

}


/* =========================
   FRIENDSHIPS
========================= */

const FRIEND_DATA = {

  aeri: {

    name: "Aeri",

    avatar: "🌙",

    messages: [

      "Aeri smiles quietly. 'It's nice seeing you again.'",

      "Aeri looks toward the moon. 'Do you ever feel like Lunaria remembers things we don't?'",

      "'I think you are becoming someone important here,' Aeri says softly."

    ]

  },


  leo: {

    name: "Leo",

    avatar: "☀️",

    messages: [

      "Leo waves excitedly. 'Hey! Wanna explore somewhere weird?'",

      "'I found a shortcut through the park!' Leo says proudly.",

      "Leo laughs. 'Okay, you're officially my favorite person today.'"

    ]

  },


  mira: {

    name: "Mira",

    avatar: "🌸",

    messages: [

      "Mira shows you a tiny sketchbook. 'I draw whenever I have too many thoughts.'",

      "'Your ideas are really interesting,' Mira says.",

      "Mira smiles. 'Maybe we should create something together someday.'"

    ]

  },


  kael: {

    name: "Kael",

    avatar: "🖤",

    messages: [

      "Kael looks at you for a moment. 'You're curious. That's dangerous here.'",

      "'Not everything in Lunaria is what it seems.'",

      "Kael lowers his voice. 'If you want answers, follow the stars.'"

    ]

  }

};


document
  .querySelectorAll(".talk-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        talkToFriend(
          button.dataset.friend
        );

      }
    );

  });


function talkToFriend(friendId) {

  const friend =
    FRIEND_DATA[friendId];

  if (!friend) return;


  const current =
    game.friendships[friendId];


  const message =
    friend.messages[
      Math.min(
        Math.floor(current / 30),
        friend.messages.length - 1
      )
    ];


  game.friendships[friendId] =
    Math.min(
      100,
      current + 10
    );


  game.happiness =
    clamp(
      game.happiness + 4,
      0,
      100
    );


  game.energy =
    clamp(
      game.energy - 5,
      0,
      100
    );


  addXP(10);


  game.activitiesToday++;


  addJournal(
    `Time with ${friend.name}`,
    message
  );


  checkAchievements();


  saveGame();


  openDialogue(
    friend.avatar,
    friend.name,
    message
  );

}


/* =========================
   FRIEND UI
========================= */

function updateFriendships() {

  Object.entries(
    game.friendships
  ).forEach(
    ([id, value]) => {

      const bar =
        document.getElementById(
          `${id}Bar`
        );

      const text =
        document.getElementById(
          `${id}Friendship`
        );


      if (bar) {

        bar.style.width =
          `${value}%`;

      }


      if (text) {

        text.textContent =
          `Friendship ${value} / 100`;

      }

    }
  );

}


/* =========================
   EXPLORE
========================= */

document
  .querySelectorAll(
    ".location-card:not(.locked)"
  )
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const location =
          card.dataset.location;

        exploreLocation(location);

      }
    );

  });


function exploreLocation(location) {

  const locations = {

    cafe: {

      title: "Moon Café",

      text:
        "The café is glowing with warm lights. Someone familiar might be here.",

      emoji: "☕"

    },

    forest: {

      title: "Whisper Forest",

      text:
        "The trees are unusually quiet. For a moment, you think you hear someone calling your name.",

      emoji: "🌲"

    },

    academy: {

      title: "Dream Academy",

      text:
        "The academy is filled with old books, strange paintings, and rooms you've never seen before.",

      emoji: "🏫"

    }

  };


  const data =
    locations[location];

  if (!data) return;


  game.energy =
    clamp(
      game.energy - 10,
      0,
      100
    );


  addXP(12);

  game.activitiesToday++;


  addJournal(
    `Explored ${data.title}`,
    data.text
  );


  checkAchievements();

  saveGame();


  openDialogue(
    data.emoji,
    data.title,
    data.text
  );

}


/* =========================
   JOURNAL
========================= */

function addJournal(title, text) {

  game.journal.unshift({

    day: game.day,

    title,

    text

  });


  if (game.journal.length > 30) {

    game.journal =
      game.journal.slice(0, 30);

  }

}


function renderJournal() {

  const list =
    document.getElementById(
      "journalList"
    );

  if (!list) return;


  list.innerHTML = "";


  game.journal.forEach(entry => {

    const item =
      document.createElement("article");

    item.className =
      "journal-entry";


    item.innerHTML = `

      <div class="journal-date">

        <strong>
          ${entry.day}
        </strong>

        <span>
          DAY
        </span>

      </div>


      <div class="journal-content">

        <h3>
          ${escapeHTML(entry.title)}
        </h3>

        <p>
          ${escapeHTML(entry.text)}
        </p>

      </div>

    `;


    list.appendChild(item);

  });

}


/* =========================
   ACHIEVEMENTS
========================= */

const ACHIEVEMENTS = [

  {

    id: "firstStep",

    icon: "🌱",

    title: "First Step",

    description:
      "Complete your first activity."

  },

  {

    id: "socialButterfly",

    icon: "💕",

    title: "Social Butterfly",

    description:
      "Reach 50 friendship with anyone."

  },

  {

    id: "creativeSoul",

    icon: "🎨",

    title: "Creative Soul",

    description:
      "Create art 3 times."

  },

  {

    id: "bookworm",

    icon: "📚",

    title: "Bookworm",

    description:
      "Reach level 3."

  },

  {

    id: "kindHeart",

    icon: "💗",

    title: "Kind Heart",

    description:
      "Help someone through a story choice."

  },

  {

    id: "mystery",

    icon: "🔮",

    title: "Dream Seeker",

    description:
      "Open the mysterious letter."

  }

];


function checkAchievements() {

  if (
    game.activitiesToday >= 1
  ) {

    game.achievements.firstStep =
      true;

  }


  if (
    Object.values(
      game.friendships
    ).some(
      value => value >= 50
    )
  ) {

    game.achievements.socialButterfly =
      true;

  }


  const artCount =
    game.journal.filter(
      item =>
        item.title === "Creative Corner"
    ).length;


  if (artCount >= 3) {

    game.achievements.creativeSoul =
      true;

  }


  if (game.level >= 3) {

    game.achievements.bookworm =
      true;

  }


  if (
    game.storyChoice === "open"
  ) {

    game.achievements.mystery =
      true;

  }


  if (
    game.storyChoice === "open" ||
    game.storyChoice === "ignore"
  ) {

    game.achievements.kindHeart =
      game.storyChoice === "open";

  }

}


function renderAchievements() {

  const list =
    document.getElementById(
      "achievementList"
    );

  if (!list) return;


  list.innerHTML = "";


  ACHIEVEMENTS.forEach(
    achievement => {

      const unlocked =
        game.achievements[
          achievement.id
        ];


      const card =
        document.createElement("article");


      card.className =
        `achievement ${
          unlocked
            ? "unlocked"
            : ""
        }`;


      card.innerHTML = `

        <div class="achievement-icon">
          ${achievement.icon}
        </div>

        <h3>
          ${achievement.title}
        </h3>

        <p>
          ${achievement.description}
        </p>

      `;


      list.appendChild(card);

    }
  );

}


/* =========================
   DIALOGUE
========================= */

const dialogueModal =
  document.getElementById(
    "dialogueModal"
  );

const dialogueAvatar =
  document.getElementById(
    "dialogueAvatar"
  );

const dialogueName =
  document.getElementById(
    "dialogueName"
  );

const dialogueTitle =
  document.getElementById(
    "dialogueTitle"
  );

const dialogueText =
  document.getElementById(
    "dialogueText"
  );


function openDialogue(
  avatar,
  title,
  text
) {

  dialogueAvatar.textContent =
    avatar;

  dialogueName.textContent =
    title.toUpperCase();

  dialogueTitle.textContent =
    title;

  dialogueText.textContent =
    text;


  dialogueModal.classList.add(
    "show"
  );

}


document
  .getElementById("closeDialogue")
  .addEventListener(
    "click",
    () => {

      dialogueModal.classList.remove(
        "show"
      );

    }
  );


document
  .getElementById(
    "dialogueContinue"
  )
  .addEventListener(
    "click",
    () => {

      dialogueModal.classList.remove(
        "show"
      );

    }
  );


dialogueModal.addEventListener(
  "click",
  event => {

    if (
      event.target === dialogueModal
    ) {

      dialogueModal.classList.remove(
        "show"
      );

    }

  }
);


/* =========================
   SAVE BUTTON
========================= */

document
  .getElementById("saveButton")
  .addEventListener(
    "click",
    () => {

      saveGame(true);

    }
  );


/* =========================
   DAILY RESET
========================= */

const today =
  new Date().toDateString();

const savedDate =
  localStorage.getItem(
    "dreamverseDate"
  );


if (
  savedDate !== today
) {

  if (savedDate) {

    game.day++;

    game.activitiesToday = 0;

    game.energy = 100;

    game.coins += 50;


    addJournal(
      "A New Day",
      "A new day begins in Lunaria. You feel ready for another little adventure."
    );

  }


  localStorage.setItem(
    "dreamverseDate",
    today
  );

  saveGame();

}


/* =========================
   TOAST
========================= */

let toastTimer;


function showToast(
  icon,
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );

  document.getElementById(
    "toastIcon"
  ).textContent =
    icon;

  document.getElementById(
    "toastText"
  ).textContent =
    message;


  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================
   HELPERS
========================= */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* =========================
   INITIALIZE
========================= */

checkAchievements();

updateUI();


setTimeout(
  () => {

    showToast(
      "🌙",
      `Welcome to Dreamverse, ${game.name}!`
    );

  },
  700
);
