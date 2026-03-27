/**
 * ╔══════════════════════════════════════════════════════════════╗
 *  PARTY DATA  ·  Edit this file to customize your entire site
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  HOW IT WORKS
 *  ─────────────────────────────────────────────────────────────
 *  • guests[]   → defines every person. Used in the Guests page
 *                 AND as the reveal in the Facts slideshow.
 *                 Each guest has a unique `id`.
 *
 *  • facts[]    → each fact links to a guest via `guestId`.
 *                 The id must exactly match one from guests[].
 *
 *  • jeopardy{} → independent game board with categories,
 *                 clues, point values, and team names.
 *
 *  PHOTOS
 *  ─────────────────────────────────────────────────────────────
 *  Drop photo files into the /public/photos folder.
 *  Reference them as  "photos/filename.jpg"
 *  Leave photo as ""  to show a silhouette placeholder instead.
 */

const PARTY_DATA = {

  // ── SITE CONFIG ─────────────────────────────────────────────
  site: {
    title: "The Clark & Liu Spectacular ✨",
    subtitle: "March 27, 2026  ·  Welcome to the new place!",
  },


  // ── GUESTS ──────────────────────────────────────────────────
  //  id     → unique key (used to link facts to guests)
  //  name   → shown on guests page & revealed in facts
  //  photo  → "photos/filename.jpg"  or  ""  for placeholder
  //  PHOTOS: drop files into /public/photos/ with these names:
  //  ephraim.jpg · kate.jpg · henry.jpg · aadhya.jpg · seveo.jpg
  //  kristin.jpg · nathan.jpg · matt.jpg · jamiie.jpg
  guests: [
    { id: "ephraim", name: "Ephraim Boomer",      photo: "photos/ephraim.png"  },
    { id: "kate",    name: "Kate Cho",             photo: "photos/kate.jpeg"    },
    { id: "henry",   name: "Henry Palmer",         photo: "photos/henry.png"                    },
    { id: "aadhya",  name: "Aadhya Siva",          photo: "photos/aadhya.jpg"   },
    { id: "seveo",   name: "Seve Reyes",            photo: "photos/seveo.jpeg"   },
    { id: "kristin", name: "Kristin Fang",         photo: "photos/kristin.png"                    },
    { id: "nathan",  name: "Nathan Nguyen",         photo: "photos/nathan.jpeg"  },
    { id: "matt",    name: "Matt Hui",              photo: "photos/matt.jpeg"    },
    { id: "jamiie",  name: "Jamie Han",             photo: "photos/jamie.jpeg"   },
    { id: "jocelyn", name: "Jocelyn Chern",          photo: "photos/jocelyn.jpeg"                    },
    { id: "rose",    name: "Rose Griffin",            photo: "photos/rose.jpeg"    },
  ],


  // ── FACTS SLIDESHOW ─────────────────────────────────────────
  //  fact     → the clue shown to the group (they guess who it is)
  //  guestId  → must exactly match an id from the guests list above
  facts: [
    {
      fact: "Triplet.",
      guestId: "ephraim",
    },
    {
      fact: "Ex-VP of Los Salseros.",
      guestId: "ephraim",
    },
    {
      fact: "I once had a carton of eggs where 11 out of 12 were double yolks.",
      guestId: "kate",
    },
    {
      fact: "I once had the 14th highest Subway Surfers score in the US.",
      guestId: "kate",
    },
    {
      fact: "I have 3 fake teeth.",
      guestId: "henry",
    },
    {
      fact: "I swam 28 miles nonstop around Manhattan.",
      guestId: "henry",
    },
    {
      fact: "I was once chased by a killer clown in NYC.",
      guestId: "aadhya",
    },
    {
      fact: "I fell asleep in a tree my first night of uni spring break.",
      guestId: "aadhya",
    },
    {
      fact: "I was supposed to be a twin but I absorbed my twin lol.",
      guestId: "seveo",
    },
    {
      fact: "I have 3 dogs!",
      guestId: "seveo",
    },
    {
      fact: "I pierced my own ears with a safety pin...",
      guestId: "kristin",
    },
    {
      fact: "I've traveled to over 20 countries!!!",
      guestId: "kristin",
    },
    {
      fact: "One time in a work email I had a Peter Pan picture on my signature, but when I sent the email the image showed up as \"Peter Pan Image | Hot Sex Picture\" — we refer to this situation as an HSP moment.",
      guestId: "nathan",
    },
    {
      fact: "My family owns a boba store called Tastea.",
      guestId: "nathan",
    },
    {
      fact: "I spent 2 weeks in the Amazon rainforest.",
      guestId: "matt",
    },
    {
      fact: "I have flown a plane before.",
      guestId: "matt",
    },
    {
      fact: "I once bodyslammed into Billie Eilish on accident and spilled an entire bucket of popcorn all over her. She did not call security. Was actually hella chill about it. Unfazed, even. I did, however, cry myself to sleep later that night.",
      guestId: "jamiie",
    },
    {
      fact: "I thought I saw a whole family of sharks so I screeched \"SHARKS OMFG\" and told everyone to get out of the water — the lifeguards made everyone evacuate and closed the beach for hours. It turned out to be a dolphin pod minding their business. I have not been back to that beach since.",
      guestId: "jamiie",
    },
    {
      fact: "I was in an American Girl Doll fashion show when I was younger.",
      guestId: "rose",
    },
    {
      fact: "I have met both of my soccer idols - David Beckham and Mia Hamm.",
      guestId: "rose",
    },
    {
      fact: "I did ballet for 12 years and now my dogs are ruined for life.",
      guestId: "jocelyn",
    },
    {
      fact: "I have 20/20 vision, no cavities, and never broken a bone, but I have vitamin D deficiency...??!??!",
      guestId: "jocelyn",
    },
  ],


  // ── JEOPARDY ────────────────────────────────────────────────
  //  teams        → team names shown on the scoreboard (2–4 recommended)
  //  pointValues  → dollar amounts per row, from top to bottom
  //  categories   → each has a name + a clues array
  //                 clues[0] = top row (lowest points)
  //                 clues[N] = bottom row (highest points)
  //  question     → the clue read aloud (what Jeopardy calls "the answer")
  //  answer       → the correct response (what Jeopardy calls "the question")
  jeopardy: {
    teams: ["Team Couch", "Team Kitchen"],
    pointValues: [200, 400, 600, 800, 1000],
    categories: [
      {
        name: "Bite Me (food or drink)",
        clues: [
          { question: "If you are ordering your fries or burger \"Animal Style,\" you are waiting in the inevitably long drive-thru line at this legendary California fast-food chain.", answer: "In-N-Out Burger" },
          { question: "This earthy, finely ground green tea powder has largely replaced standard espresso for Gen Z's morning caffeine fix, often ordered iced with oat milk.", answer: "Matcha" },
          { question: "Despite its aggressive heavy-metal branding and the slogan \"Murder Your Thirst,\" this highly popular beverage brand strictly sells canned water and iced tea.", answer: "Liquid Death" },
          { question: "Known for its highly coveted stars, this prestigious fine-dining rating system was actually originally created by a French tire company to encourage people to drive further and wear out their tires.", answer: "Michelin Guide" },
          { question: "Named after the American pharmacist who created it in 1912, this is the official scientific scale used to measure the exact heat and pungency of chili peppers.", answer: "Scoville Scale" },
        ],
      },
      {
        name: "The Showbiz",
        clues: [
          { question: "California declared February 8, 2026, a state holiday in honor of this Puerto Rican superstar, who made history headlining the Super Bowl LX halftime show at Levi's Stadium.", answer: "Bad Bunny" },
          { question: "This pop powerhouse and Wicked star recently took up residence in a massive Hollywood Hills mansion when she's not defying gravity on screen.", answer: "Ariana Grande" },
          { question: "He dramatically ripped off his mask at Comic-Con, revealing that he is returning to the MCU not as Iron Man, but as Doctor Doom in 2026's Avengers: Doomsday.", answer: "Robert Downey Jr." },
          { question: "Fresh off winning Best New Artist at the 2026 Grammys, this British neo-soul singer is bringing The Art of Loving tour to North American arenas this summer.", answer: "Olivia Dean" },
          { question: "Earning him a 2026 Oscar nomination for Best Actor, Timothée Chalamet swapped his sandworm-riding gear to star in this fast-paced A24 film directed by Josh Safdie.", answer: "Marty Supreme" },
        ],
      },
      {
        name: "Corporate Lingo",
        clues: [
          { question: "A polite conversational killer that roughly translates to: \"I don't have the answer right now, and I am praying we both forget about this by tomorrow.\"", answer: "Let's Circle Back" },
          { question: "Please stop arguing with me in front of the entire team.", answer: "Let's Take This Offline" },
          { question: "A gentle way of asking: \"Are you going to have a complete breakdown if I assign you this task?\"", answer: "What's your Bandwidth?" },
          { question: "Management speak for: \"Let's just do the absolute easiest tasks first so it looks like we are actually being productive.\"", answer: "Low Hanging Fruit" },
          { question: "This vintage piece of executive MBA jargon is still used in slide decks to describe the magical, invisible force that happens when teams are in complete alignment.", answer: "Synergy" },
        ],
      },
      {
        name: '"L.A." Locals',
        clues: [
          { question: "Known as \"The Brow,\" this 6'10\" superstar forms the other half of the Lakers' dynamic duo and helped secure the 2020 NBA Championship.", answer: "Anthony Davis" },
          { question: "In 1932, this pioneering aviator became the first woman to fly solo nonstop across the Atlantic Ocean, years before her mysterious and heavily theorized disappearance.", answer: "Amelia Earhart" },
          { question: "Taking home five awards at the 2026 Grammys—he officially surpassed Jay-Z to become the most-awarded rapper in Grammy history.", answer: "Kendrick Lamar" },
          { question: "The best-selling fiction writer of all time, this British author is responsible for creating iconic literary detectives like Hercule Poirot and Miss Marple.", answer: "Agatha Christie" },
          { question: "Played by Benedict Cumberbatch in The Imitation Game, this brilliant British mathematician cracked the Nazi Enigma code and is widely considered the father of computer science.", answer: "Alan Turing" },
        ],
      },
      {
        name: "Mixed Bag",
        clues: [
          { question: "Composed of sodium and chlorine, this common kitchen seasoning is famously the only rock regularly consumed by humans.", answer: "Salt" },
          { question: "In 2006, this icy celestial body at the outer edge of our solar system was controversially demoted to a \"dwarf planet.\"", answer: "Pluto" },
          { question: "Translating literally to \"empty orchestra\" in Japanese, this popular late-night activity involves grabbing a microphone and belting out hits to pre-recorded tracks.", answer: "Karaoke" },
          { question: "Before getting her \"driver's license\" and spilling her GUTS on two massive pop-rock albums, this superstar got her start acting in a hit Disney+ series.", answer: "Olivia Rodrigo" },
          { question: "In web development, receiving an HTTP status code of exactly this number indicates a general \"Bad Request,\" while adding a \"4\" to the end gives you the infamous \"Not Found\" error.", answer: "400" },
        ],
      },
    ],
  },
};

export default PARTY_DATA;
