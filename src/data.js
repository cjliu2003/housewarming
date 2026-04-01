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
    { id: "caleb",   name: "Caleb Liu",               photo: "photos/caleb.png"    },
    { id: "james",   name: "James Clark",             photo: "photos/james.jpeg"   },
    { id: "hayden",  name: "Hayden Gibson",            photo: "photos/hayden.jpeg"  },
    { id: "kimberly",name: "Kimberly Wang",            photo: ""                    },
    { id: "prital",  name: "Prital",                  photo: ""                    },
    { id: "tyler",   name: "Tyler",                   photo: ""                    },
    { id: "logan",   name: "Logan",                    photo: "photos/logan.jpeg"   },
    { id: "hairam",  name: "Hairam Ramos",             photo: "photos/hairam.jpeg"  },
    { id: "meagan",  name: "Meagan Campbell",          photo: ""                    },
    { id: "jessica", name: "Jessica Le",               photo: ""                    },
    { id: "trenton", name: "Trenton",                  photo: ""                    },
    { id: "lucas",   name: "Lucas",                    photo: ""                    },
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
    {
      fact: "I got a C in my songwriting class becauase I forgot to turn in my final",
      guestId: "caleb",
    },
    {
      fact: "I got 4 tubs of apple sauce for christmas one year cause I love applesauce",
      guestId: "caleb",
    },
    {
      fact: "I can dance salsa.",
      guestId: "hairam",
    },
    {
      fact: "I am great at naming flags.",
      guestId: "hairam",
    },
    {
      fact: "White boy has some Thai in him.",
      guestId: "hayden",
    },
    {
      fact: "I know how to safely make a gasoline explosion.",
      guestId: "hayden",
    }
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
    categories: [
      {
        name: "Bite Me (food or drink)",
        type: "trivia",
        clues: [
          { question: "This earthy, finely ground green tea powder has largely replaced standard espresso for Gen Z's morning caffeine fix, often ordered iced with oat milk.", answer: "Matcha" },
          { question: "Despite its aggressive heavy-metal branding and the slogan \"Murder Your Thirst,\" this highly popular beverage brand strictly sells canned water and iced tea.", answer: "Liquid Death" },
          { question: "Known for its highly coveted stars, this prestigious fine-dining rating system was actually originally created by a French tire company to encourage people to drive further and wear out their tires.", answer: "Michelin Guide" },
          { question: "Named after the American pharmacist who created it in 1912, this is the official scientific scale used to measure the exact heat and pungency of chili peppers.", answer: "Scoville Scale" },
          { question: "Despite its association with ancient European empires, this iconic tableside dish was actually invented in 1924 in Tijuana, Mexico, by an Italian immigrant catering to Americans dodging Prohibition.", answer: "Caesar Salad" },
          { question: "This geometric, cheese-dusted snack was famously invented in the early 1960s at Casa de Fritos, a restaurant located inside Disneyland, as a way to upcycle stale tortillas.", answer: "Doritos" },
          { question: "Before settling on its famous \"31 Flavors\" branding in 1953, this iconic ice cream chain was originally two separate shops in Glendale and Pasadena named Snowbird and Burton's.", answer: "Baskin-Robbins" },
          { question: "Due to its low moisture content, high acidity, and a specific enzyme deposited by its creators, archaeologists have discovered 3,000-year-old pots of this edible substance preserved in ancient Egyptian tombs.", answer: "Honey" },
        ],
      },
      {
        name: "Corporate Lingo",
        type: "trivia",
        clues: [
          { question: "A polite conversational killer that roughly translates to: \"I don't have the answer right now, and I am praying we both forget about this by tomorrow.\"", answer: "Let's Circle Back / Let's Table This" },
          { question: "Please stop arguing with me in front of the entire team.", answer: "Let's Take This Offline" },
          { question: "A gentle way of asking: \"Are you going to have a complete breakdown if I assign you this task?\"", answer: "What's your Bandwidth?" },
          { question: "Management speak for: \"Let's just do the absolute easiest tasks first so it looks like we are actually being productive.\"", answer: "Low Hanging Fruit" },
          { question: "This vintage piece of executive MBA jargon is still used in slide decks to describe the magical, invisible force that happens when teams are in complete alignment.", answer: "Synergy" },
          { question: "This two-word phrase is used by executives to describe making significant, measurable progress on a project, metaphorically referencing the dial on an instrument gauge.", answer: "Move the Needle" },
          { question: "Often thrown around during strategy sessions, this celestial term refers to a company's ultimate, unwavering, top-tier priority or guiding vision.", answer: "North Star" },
          { question: "A meeting to align...", answer: "(Quick) Sync" },
        ],
      },
      {
        name: "The Showbiz",
        type: "trivia",
        clues: [
          { question: "California declared February 8, 2026, a state holiday in honor of this Puerto Rican superstar, who made history headlining the Super Bowl LX halftime show at Levi's Stadium.", answer: "Bad Bunny" },
          { question: "Season One of The White Lotus was shot at which real-life resort in Hawaii?", answer: "Four Seasons Resort Maui at Wailea" },
          { question: "What is Rihanna's real name?", answer: "Robyn Fenty" },
          { question: "Fresh off winning Best New Artist at the 2026 Grammys, this British neo-soul singer is bringing The Art of Loving tour to North American arenas this summer.", answer: "Olivia Dean" },
          { question: "Earning him a 2026 Oscar nomination for Best Actor, Timothée Chalamet swapped his sandworm-riding gear to star in this fast-paced A24 film directed by Josh Safdie.", answer: "Marty Supreme" },
          { question: "Gary Rydstrom's iconic sound design for the T-Rex roar in Jurassic Park was actually a composite of three animals: an alligator, a tiger, and the squeal of this surprising infant mammal.", answer: "Baby Elephant" },
          { question: "In 2026, this legendary director officially achieved EGOT status when he won his first Grammy Award for producing the documentary Music by John Williams.", answer: "Steven Spielberg" },
          { question: "Winning Best Original Song at the 2026 Oscars, the smash hit \"Golden\" made history as the first song from this specific musical genre to take home the Academy Award.", answer: "K-pop" },
        ],
      },
      //  ── GUESSING ROUNDS ── Round 4: first fact from each person. Round 5: second fact.
      {
        name: "Who Am I? — Round 1",
        type: "guess",
        clues: [
          { fact: "Triplet.", guestId: "ephraim" },
          { fact: "I once had a carton of eggs where 11 out of 12 were double yolks.", guestId: "kate" },
          { fact: "I spent 2 weeks in the Amazon rainforest.", guestId: "matt" },
          { fact: "I did ballet for 12 years and now my dogs are ruined for life.", guestId: "jocelyn" },
          { fact: "I can dance salsa.", guestId: "hairam" },
          { fact: "My siblings accidentally slammed my pinky in a door when I was 1 and completely flattened it.", guestId: "james" },
          { fact: "I was in an American Girl Doll fashion show when I was younger.", guestId: "rose" },
          { fact: "White boy has some Thai in him.", guestId: "hayden" },
          { fact: "I was once chased by a killer clown in NYC.", guestId: "aadhya" },
          { fact: "I got a C in my songwriting class becauase I forgot to turn in my final", guestId: "caleb" },
          { fact: "I have 3 fake teeth.", guestId: "henry" },
          { fact: "I pierced my own ears with a safety pin...", guestId: "kristin" },
          { fact: "I was supposed to be a twin but I absorbed my twin lol.", guestId: "seveo" },
          { fact: "I was in a rock band in elementary school that was featured on our local news 🤩", guestId: "logan" },
          { fact: "I once bodyslammed into Billie Eilish on accident and spilled an entire bucket of popcorn all over her. She did not call security. Was actually hella chill about it. Unfazed, even. I did, however, cry myself to sleep later that night.", guestId: "jamiie" },
          { fact: "I can name every president!", guestId: "tyler" },
          { fact: "My family owns a boba store called Tastea.", guestId: "nathan" },
        ],
      },
      {
        name: "Who Am I? — Round 2",
        type: "guess",
        clues: [
          { fact: "I've traveled to over 20 countries!!!", guestId: "kristin" },
          { fact: "I have 3 dogs!", guestId: "seveo" },
          { fact: "One time in a work email I had a Peter Pan picture on my signature, but when I sent the email the image showed up as \"Peter Pan Image | Hot Sex Picture\" — we refer to this situation as an HSP moment.", guestId: "nathan" },
          { fact: "I fell asleep in a tree my first night of uni spring break.", guestId: "aadhya" },
          { fact: "I swam 28 miles nonstop around Manhattan.", guestId: "henry" },
          { fact: "I thought I saw a whole family of sharks so I screeched \"SHARKS OMFG\" and told everyone to get out of the water — the lifeguards made everyone evacuate and closed the beach for hours. It turned out to be a dolphin pod minding their business. I have not been back to that beach since.", guestId: "jamiie" },
          { fact: "I got 4 tubs of apple sauce for christmas one year cause I love applesauce", guestId: "caleb" },
          { fact: "I have met both of my soccer idols - David Beckham and Mia Hamm.", guestId: "rose" },
          { fact: "In first grade, I hid in a cubby so that I didn't have to walk to the library with my class. It worked and they left without me.", guestId: "james" },
          { fact: "Ex-VP of Los Salseros.", guestId: "ephraim" },
          { fact: "I have 20/20 vision, no cavities, and never broken a bone, but I have vitamin D deficiency...??!??!", guestId: "jocelyn" },
          { fact: "I have flown a plane before.", guestId: "matt" },
          { fact: "I am great at naming flags.", guestId: "hairam" },
          { fact: "I once had the 14th highest Subway Surfers score in the US.", guestId: "kate" },
          { fact: "I have the entirety of Hamilton memorized, start to finish", guestId: "logan" },
          { fact: "I know how to safely make a gasoline explosion.", guestId: "hayden" },
          { fact: "I fought a trashcan at 3am once", guestId: "tyler" },
        ],
      },
    ],
  },
};

export default PARTY_DATA;
