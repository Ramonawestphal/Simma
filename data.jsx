// Simma — static data: cooks, sessions, learners, chat.

// Photo URLs — passed straight through, no local copies.
const HOST_PHOTOS = [
  "https://plus.unsplash.com/premium_photo-1675034345146-99e96fd1a000?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1663429122432-c2769373768f?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587040273238-9ba47c714796?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1625690988276-0a7b0cdf3d5d?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1176&auto=format&fit=crop",
];

const LEARNER_PHOTOS = [
  "https://images.unsplash.com/photo-1725866546799-4cc16f6cba23?q=80&w=749&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1662850886700-4ec19bd30d11?q=80&w=764&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520998116484-6eeb2f72b5b9?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520423465871-0866049020b7?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583596608816-20dc8b46fced?q=80&w=687&auto=format&fit=crop",
];

const FOOD_PHOTOS = {
  table:    "https://plus.unsplash.com/premium_photo-1728412897842-06f0fc4c2ec6?q=80&w=1245&auto=format&fit=crop",
  pom:      "https://images.unsplash.com/photo-1646077978608-65ed63765302?q=80&w=1170&auto=format&fit=crop",
  appleCake:"https://plus.unsplash.com/premium_photo-1694336203192-c9e7f2891b95?q=80&w=765&auto=format&fit=crop",
  lasagna:  "https://plus.unsplash.com/premium_photo-1723770033472-0b0452d98225?q=80&w=1097&auto=format&fit=crop",
  gozleme:  "https://images.unsplash.com/photo-1588765907995-47867ce30312?q=80&w=1074&auto=format&fit=crop",
  bao:      "https://plus.unsplash.com/premium_photo-1664647949561-45a3555fb736?q=80&w=687&auto=format&fit=crop",
  burek:    "https://images.unsplash.com/photo-1617806501736-fc7cab7c05bf?q=80&w=1170&auto=format&fit=crop",
};

// ─── Cooks (hosts) ───────────────────────────────────────────────────────────

const COOKS = [
  {
    id: "lena",
    name: "Lena",
    surname: "Lachman",
    age: 78,
    photo: HOST_PHOTOS[0],
    neighborhood: "Overschie",
    city: "Rotterdam",
    cuisine: "Surinamese",
    signature: "Pom",
    rating: 4.9,
    reviews: 14,
    bio: "Came to Rotterdam in 1972 with her mother's recipe book in a biscuit tin. Cooks pom every birthday in her family — and now wants to pass it on.",
    tagColor: "#B14A2C",
  },
  {
    id: "mirza",
    name: "Mirza",
    surname: "Hadžić",
    age: 71,
    photo: HOST_PHOTOS[1],
    neighborhood: "Delfshaven",
    city: "Rotterdam",
    cuisine: "Bosnian",
    signature: "Burek",
    rating: 4.8,
    reviews: 9,
    bio: "Grew up in Bihać, where burek was Sunday morning, not a recipe. Will teach you to roll the dough thin enough to read a newspaper through.",
    tagColor: "#2D6E70",
  },
  {
    id: "carl",
    name: "Carl",
    surname: "van Dijk",
    age: 69,
    photo: HOST_PHOTOS[2],
    neighborhood: "Hillegersberg",
    city: "Rotterdam",
    cuisine: "Dutch",
    signature: "Ona's appletaart",
    rating: 4.7,
    reviews: 6,
    bio: "Has been baking his grandmother Ona's apple tart every Sunday since 1968. Heavy on the cinnamon, light on the sugar — the way she always insisted.",
    tagColor: "#A66A2C",
  },
  {
    id: "giovanna",
    name: "Giovanna",
    surname: "Romano",
    age: 76,
    photo: HOST_PHOTOS[3],
    neighborhood: "Kralingen",
    city: "Rotterdam",
    cuisine: "Italian",
    signature: "Lasagna alla bolognese",
    rating: 5.0,
    reviews: 22,
    bio: "Left Bologna in 1968 to follow a Dutch musician. Still makes her ragù in a copper pot, simmered for five hours — never less.",
    tagColor: "#7A3A2C",
  },
  {
    id: "fatma",
    name: "Fatma",
    surname: "Kaya",
    age: 44,
    photo: HOST_PHOTOS[4],
    neighborhood: "Hillegersberg",
    city: "Rotterdam",
    cuisine: "Turkish",
    signature: "Gözleme",
    rating: 4.9,
    reviews: 18,
    bio: "Grew up watching her mother roll dough thin enough to see daylight through. Bakes gözleme in a cast-iron pan on the third floor of a Rotterdam apartment block — the smell carries all the way down the stairwell.",
    tagColor: "#C58A2C",
  },
  {
    id: "mike",
    name: "Mike",
    surname: "Lin",
    age: 38,
    photo: HOST_PHOTOS[5],
    neighborhood: "Crooswijk",
    city: "Rotterdam",
    cuisine: "Cantonese",
    signature: "Char siu bao",
    rating: 4.8,
    reviews: 11,
    bio: "Born in Hong Kong, learned bao at his grandfather's Kowloon stall. Runs pop-ups across Rotterdam. Will teach you the pinch — the one that makes the bun smile when it steams.",
    tagColor: "#5E6E2D",
  },
];

// ─── Sessions ────────────────────────────────────────────────────────────────

const SESSIONS = [
  {
    id: "pom-lena",
    cookId: "lena",
    dish: "Pom",
    dishSub: "Surinamese cassava bake",
    image: FOOD_PHOTOS.pom,
    date: "Sat 24 May",
    time: "14:00 — 18:00",
    location: "Lena's kitchen · Overschie",
    spotsLeft: 2,
    maxSpots: 4,
    joinedLearnerIds: [0, 3],
    match: 94,
    matchBreakdown: { cuisine: 92, distance: 88, availability: 74 },
    matchReason: "You told us you'd like to learn Surinamese cooking — and Lena's kitchen is a fifteen-minute walk from yours.",
    storyShort: "My daughter called recently to say she missed pom — so I dug out my mother's old schrift again.",
    storyLong: "My mother made pom every birthday in Paramaribo. When I came to the Netherlands in 1972, I brought her recipe schrift with me in a biscuit tin. My daughter called recently to say she missed it — so I pulled the schrift out again. There's a little too much sugar in it, but that's how she wrote it down. I'd like to give it to someone young who doesn't yet know the right way.",
    ingredients: {
      fresh: [
        { name: "Cassava root", amount: "500 g" },
        { name: "Chicken thighs", amount: "400 g" },
        { name: "Tomatoes", amount: "3" },
        { name: "Celery", amount: "1 bunch" },
      ],
      pantry: [
        { name: "Celery salt", amount: "" },
        { name: "Maggi seasoning", amount: "1 bottle" },
        { name: "Sunflower oil", amount: "100 ml" },
      ],
    },
    cookBrings: "oven dish, foil, spices from the cabinet",
  },
  {
    id: "lasagna-giovanna",
    cookId: "giovanna",
    dish: "Lasagna alla bolognese",
    dishSub: "Five-hour ragù",
    image: FOOD_PHOTOS.lasagna,
    date: "Sun 25 May",
    time: "11:00 — 17:00",
    location: "Giovanna's kitchen · Kralingen",
    spotsLeft: 1,
    maxSpots: 3,
    joinedLearnerIds: [1, 5],
    match: 89,
    matchBreakdown: { cuisine: 90, distance: 82, availability: 95 },
    matchReason: "You've saved two Italian recipes already, and your Sundays are usually free.",
    storyShort: "My ragù simmers for five hours. The day you make it, you make nothing else.",
    storyLong: "I left Bologna in 1968 with a small suitcase and the address of a Dutch musician. Forty years later, the only thing I never changed was the ragù. Five hours, copper pot, milk in at the end — never less. The day you make it, you make nothing else. That's the rule.",
    ingredients: {
      fresh: [
        { name: "Beef chuck", amount: "500 g" },
        { name: "Pork shoulder", amount: "300 g" },
        { name: "Carrots", amount: "2" },
        { name: "Celery stalks", amount: "2" },
        { name: "Yellow onion", amount: "1" },
        { name: "Whole milk", amount: "300 ml" },
      ],
      pantry: [
        { name: "Tomato passata", amount: "500 ml" },
        { name: "Dry red wine", amount: "200 ml" },
        { name: "Lasagna sheets", amount: "1 box" },
        { name: "Parmigiano", amount: "200 g" },
      ],
    },
    cookBrings: "the copper pot, the lasagna dish, a glass of wine to drink while you wait",
  },
  {
    id: "appletaart-carl",
    cookId: "carl",
    dish: "Ona's appletaart",
    dishSub: "Dutch apple tart, Sunday recipe",
    image: FOOD_PHOTOS.appleCake,
    date: "Fri 23 May",
    time: "10:00 — 13:00",
    location: "Carl's kitchen · Hillegersberg",
    spotsLeft: 3,
    maxSpots: 4,
    joinedLearnerIds: [2],
    match: null,
    storyShort: "Sunday afternoons in 1958 smelled of cinnamon. I still bake it the same way Ona did — slightly less sugar than the cookbook says.",
    storyLong: "My grandmother Ona baked this every Sunday afternoon from 1958 until she couldn't anymore. The recipe is from her mother. Heavy on the cinnamon, light on the sugar — she insisted the apple should still taste like apple. I have her enamel pie tin. You can use it if you like.",
    ingredients: {
      fresh: [
        { name: "Goudreinet apples", amount: "1 kg" },
        { name: "Butter (cold)", amount: "200 g" },
        { name: "Egg", amount: "1" },
        { name: "Lemon", amount: "1" },
      ],
      pantry: [
        { name: "Self-rising flour", amount: "300 g" },
        { name: "Light brown sugar", amount: "150 g" },
        { name: "Cinnamon", amount: "2 tsp" },
        { name: "Raisins", amount: "100 g" },
      ],
    },
    cookBrings: "the enamel pie tin, whipped cream for after",
  },
  {
    id: "burek-mirza",
    cookId: "mirza",
    dish: "Burek",
    dishSub: "Bosnian rolled phyllo with beef",
    image: FOOD_PHOTOS.burek,
    date: "Sun 1 Jun",
    time: "10:00 — 14:00",
    location: "Mirza's kitchen · Delfshaven",
    spotsLeft: 3,
    maxSpots: 4,
    joinedLearnerIds: [4],
    match: 81,
    matchBreakdown: { cuisine: 78, distance: 92, availability: 70 },
    matchReason: "Mirza cooks in your neighborhood at a time your calendar usually has free.",
    storyShort: "The rolling is everything. My father rolled it thin enough to read the newspaper through.",
    storyLong: "Where I grew up in Bihać, burek wasn't a dish — it was Sunday morning. The rolling is everything. My father rolled the dough on the kitchen table so thin you could read the newspaper through it. I'll teach you, but be warned: this is a day for people who aren't in a hurry.",
    ingredients: {
      fresh: [
        { name: "Beef mince", amount: "400 g" },
        { name: "Yellow onions", amount: "2" },
      ],
      pantry: [
        { name: "Bread flour", amount: "500 g" },
        { name: "Sunflower oil", amount: "200 ml" },
        { name: "Salt & pepper", amount: "" },
      ],
    },
    cookBrings: "the rolling pin, the round baking tray, yoghurt for after",
  },
  {
    id: "gozleme-fatma",
    cookId: "fatma",
    dish: "Gözleme",
    dishSub: "Turkish stuffed flatbread",
    image: FOOD_PHOTOS.gozleme,
    date: "Wed 28 May",
    time: "15:00 — 18:00",
    location: "Fatma's kitchen · Hillegersberg",
    spotsLeft: 4,
    maxSpots: 4,
    joinedLearnerIds: [],
    match: null,
    storyShort: "We used to make it on a saç in my grandmother's garden. Here, the cast-iron pan does just as well.",
    storyLong: "We used to make gözleme on a saç over a wood fire, in my grandmother's garden outside Konya. Here in Rotterdam I do it in a cast-iron pan — just as good, and the whole apartment smells of it for hours. I like teaching people that the dough rewards patience.",
    ingredients: { fresh: [], pantry: [] },
    cookBrings: "rolling pin, cast-iron pan, glass of çay",
  },
  {
    id: "bao-mike",
    cookId: "mike",
    dish: "Char siu bao",
    dishSub: "Steamed pork buns",
    image: FOOD_PHOTOS.bao,
    date: "Sat 7 Jun",
    time: "12:00 — 16:00",
    location: "Mei's kitchen · Crooswijk",
    spotsLeft: 2,
    maxSpots: 4,
    joinedLearnerIds: [],
    match: null,
    storyShort: "The pinch is the secret. When you pinch right, the bun smiles when it steams.",
    storyLong: "I grew up between Hong Kong and Vancouver, learning at my grandfather's bao stall in Kowloon. I've worked in three kitchens since. The dough is easy. The filling is easy. The pinch is the secret — when you pinch right, the bun smiles when it steams.",
    ingredients: { fresh: [], pantry: [] },
    cookBrings: "bamboo steamer, dipping sauce, tea",
  },
];

// ─── Recent learners (community) ─────────────────────────────────────────────

const LEARNERS = [
  { id: 0, name: "Ramona",   age: 21, neighborhood: "Centrum",      photo: "ramona.jpg",       learning: "Surinamese" },
  { id: 1, name: "Noah",     age: 24, neighborhood: "Noord",        photo: LEARNER_PHOTOS[1], learning: "Italian" },
  { id: 2, name: "Sanne",    age: 31, neighborhood: "Kralingen",    photo: LEARNER_PHOTOS[2], learning: "Dutch baking" },
  { id: 3, name: "Mira",     age: 26, neighborhood: "Delfshaven",   photo: LEARNER_PHOTOS[3], learning: "Surinamese" },
  { id: 4, name: "Eva",      age: 22, neighborhood: "West",         photo: LEARNER_PHOTOS[4], learning: "Bosnian" },
  { id: 5, name: "Mateo",    age: 29, neighborhood: "Hillegersberg",photo: LEARNER_PHOTOS[5], learning: "Italian" },
];

// ─── Filters ─────────────────────────────────────────────────────────────────

const FILTERS = ["Nearby", "This week", "Surinamese", "Italian", "Turkish", "Bosnian", "Dutch", "Cantonese", "Vegetarian"];

// ─── Chat with the assistant ─────────────────────────────────────────────────

const CHAT = [
  {
    day: "Friday 23 May",
    messages: [
      { role: "ai", text: "Hi Jamila — tomorrow you're cooking with Lena. Don't forget the cassava root; the big Asian grocer on Mathenesserweg always has it fresh." },
      { role: "ai", text: "Want me to send the full shopping list again, just in case?" },
      { role: "user", text: "Already sorted, thanks!" },
      { role: "ai", text: "Lovely. Lena mentioned she'd love an extra bunch of celery — the smell of it brings her back home, she said." },
    ],
  },
  {
    day: "Sunday 25 May",
    messages: [
      { role: "ai", text: "Good morning, Jamila — how was yesterday with Lena?" },
      { role: "user", text: "It was wonderful. I even came home with a piece of pom for my partner." },
      { role: "ai", text: "Lena said almost exactly the same thing — she told me you were a thoughtful student." },
      { role: "ai", text: "Would you like me to save her recipe into your heritage archive? You can always come back to it, and Lena gets a small note when you cook it again." },
      {
        role: "ai-actions",
        actions: [
          { label: "Yes, save it", primary: true },
          { label: "Keep it private", primary: false },
        ],
      },
    ],
  },
];

window.SESSIONS = SESSIONS;
window.COOKS = COOKS;
window.LEARNERS = LEARNERS;
window.FILTERS = FILTERS;
window.CHAT = CHAT;
window.FOOD_PHOTOS = FOOD_PHOTOS;
