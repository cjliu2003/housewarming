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
 *  Drop photo files into the /photos folder next to index.html.
 *  Reference them as  "photos/filename.jpg"
 *  Leave photo as ""  to show a silhouette placeholder instead.
 */

const PARTY_DATA = {

  // ── SITE CONFIG ─────────────────────────────────────────────
  site: {
    title: "Caleb's Housewarming 🏠",
    subtitle: "March 27, 2026  ·  Welcome to the new place!",
  },


  // ── GUESTS ──────────────────────────────────────────────────
  //  id     → unique key (used to link facts to guests)
  //  name   → shown on guests page & revealed in facts
  //  photo  → "photos/filename.jpg"  or  ""  for placeholder
  //  PHOTOS: drop files into /photos with these names:
  //  ephraim.jpg · kate.jpg · henry.jpg · aadhya.jpg · seveo.jpg
  //  kristin.jpg · nathan.jpg · matt.jpg · jamiie.jpg
  guests: [
    { id: "ephraim", name: "Ephraim Boomer",     photo: "photos/ephraim.jpg" },
    { id: "kate",    name: "Kate Cho",            photo: "photos/kate.jpg"    },
    { id: "henry",   name: "Henry Palmer",        photo: "photos/henry.jpg"   },
    { id: "aadhya",  name: "Aadhya Siva",         photo: "photos/aadhya.jpg"  },
    { id: "seveo",   name: "Seveo Reyes",          photo: "photos/seveo.jpg"   },
    { id: "kristin", name: "Kristin Fangg",       photo: "photos/kristin.jpg" },
    { id: "nathan",  name: "Nathan Trung Nguyen",  photo: "photos/nathan.jpg"  },
    { id: "matt",    name: "Matt Phui",            photo: "photos/matt.jpg"    },
    { id: "jamiie",  name: "Jamiie Han",           photo: "photos/jamiie.jpg"  },
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
    pointValues: [100, 200, 300, 400, 500],
    categories: [
      {
        name: "About Caleb",
        clues: [
          { question: "The city where Caleb was born.",                              answer: "Springfield"                  },
          { question: "Caleb's college major.",                                      answer: "Computer Science"             },
          { question: "Caleb's all-time favorite movie.",                            answer: "The Matrix"                   },
          { question: "Number of countries Caleb has visited.",                      answer: "12"                           },
          { question: "Caleb's secret skill that always surprises people.",          answer: "Speed-solving a Rubik's cube" },
        ],
      },
      {
        name: "The New House",
        clues: [
          { question: "Number of bedrooms.",                                         answer: "3"                            },
          { question: "The first piece of furniture Caleb bought.",                  answer: "A couch"                      },
          { question: "The neighborhood the house is in.",                           answer: "Midtown"                      },
          { question: "How long Caleb searched before finding this house.",          answer: "8 months"                     },
          { question: "The feature Caleb brags about most to guests.",              answer: "The chef's kitchen"            },
        ],
      },
      {
        name: "Friend Lore",
        clues: [
          { question: "The school where most of this group first met.",              answer: "State University"             },
          { question: "The trip that turned acquaintances into real friends.",       answer: "Spring Break in Cancún"       },
          { question: "The inside joke that has been going for 5+ years.",          answer: "The parking garage incident"  },
          { question: "The group's most embarrassing Halloween costume year.",       answer: "The Spice Boys (2019)"        },
          { question: "How many people are in the original friend group.",           answer: "7"                            },
        ],
      },
      {
        name: "Pop Culture",
        clues: [
          { question: "The TV show everyone in this room has rewatched.",            answer: "The Office"                   },
          { question: "The meme era that defined this group's humor.",               answer: "2016–2018 Vine era"           },
          { question: "The movie that made at least one person cry in theaters.",    answer: "Avengers: Endgame"            },
          { question: "The band everyone was obsessed with in middle school.",       answer: "Fall Out Boy"                 },
          { question: "The song that played at every pre-game 2018–2020.",           answer: "Sicko Mode"                   },
        ],
      },
      {
        name: "Tonight's Party",
        clues: [
          { question: "Tonight's signature drink.",                                  answer: "The Housewarming Mule"        },
          { question: "The first game played at this party.",                        answer: "Jeopardy!"                    },
          { question: "Caleb's stated rule about shoes in the new house.",           answer: "No shoes past the entryway"   },
          { question: "The housewarming gift Caleb actually needed most.",           answer: "A good set of towels"         },
          { question: "Caleb's most controversial DJ choice of the evening.",        answer: "All Taylor Swift hour"        },
        ],
      },
    ],
  },
};
