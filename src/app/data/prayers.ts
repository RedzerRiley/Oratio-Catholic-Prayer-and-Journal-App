export const dailyPrayers = [
  {
    id: 'our-father',
    title: 'Our Father',
    latin: 'Pater Noster',
    category: 'Essential',
    text: `Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.`,
  },
  {
    id: 'hail-mary',
    title: 'Hail Mary',
    latin: 'Ave Maria',
    category: 'Essential',
    text: `Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`,
  },
  {
    id: 'glory-be',
    title: 'Glory Be',
    latin: 'Gloria Patri',
    category: 'Essential',
    text: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`,
  },
  {
    id: 'apostles-creed',
    title: "Apostles' Creed",
    latin: 'Symbolum Apostolorum',
    category: 'Essential',
    text: `I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; the third day He rose again from the dead; He ascended into heaven, and sits at the right hand of God, the Father Almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`,
  },
  {
    id: 'morning-offering',
    title: 'Morning Offering',
    latin: '',
    category: 'Daily',
    text: `O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen.`,
  },
  {
    id: 'angelus',
    title: 'The Angelus',
    latin: 'Angelus Domini',
    category: 'Daily',
    text: `V. The Angel of the Lord declared unto Mary.
R. And she conceived of the Holy Spirit.

Hail Mary...

V. Behold the handmaid of the Lord.
R. Be it done unto me according to thy word.

Hail Mary...

V. And the Word was made Flesh.
R. And dwelt among us.

Hail Mary...

V. Pray for us, O holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the Incarnation of Christ, Thy Son, was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ Our Lord. Amen.`,
  },
  {
    id: 'guardian-angel',
    title: 'Prayer to Guardian Angel',
    latin: 'Angele Dei',
    category: 'Daily',
    text: `Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.`,
  },
  {
    id: 'st-michael',
    title: 'Prayer to St. Michael',
    latin: '',
    category: 'Protection',
    text: `Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil; May God rebuke him, we humbly pray; And do thou, O Prince of the Heavenly Host, by the power of God, thrust into hell Satan and all evil spirits who wander through the world for the ruin of souls. Amen.`,
  },
  {
    id: 'memorare',
    title: 'Memorare',
    latin: '',
    category: 'Marian',
    text: `Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired with this confidence, I fly to thee, O Virgin of virgins, my Mother; to thee do I come; before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.`,
  },
  {
    id: 'act-of-contrition',
    title: 'Act of Contrition',
    latin: '',
    category: 'Essential',
    text: `O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve with the help of Thy grace to sin no more and to avoid the near occasion of sin. Amen.`,
  },
  {
    id: 'divine-mercy-chaplet',
    title: 'Chaplet of Divine Mercy',
    latin: 'Coronna della Divina Misericordia',
    category: 'Chaplet',
    text: `STEP 1 — Sign of the Cross
Using a regular Rosary, begin at the cross by making the Sign of the Cross.

✦ Optional Opening Prayer:
You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us.

✦ Repeat three times:
O Blood and Water, which gushed forth from the Heart of Jesus as a fountain of Mercy for us, I trust in You!

────────────────────────────
STEP 2 — On the three introductory beads, pray:
• Our Father
• Hail Mary
• Apostles' Creed

────────────────────────────
STEP 3 — Opening prayer of each decade
(Pray on the large Our Father bead before each decade)

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.

────────────────────────────
STEP 4 — Each of the 10 Hail Mary beads in a decade

For the sake of His sorrowful Passion, have mercy on us and on the whole world.

✦ Repeat Steps 3 and 4 for all 5 decades.

────────────────────────────
STEP 5 — Closing prayer (after all 5 decades, repeat 3 times)

Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.

✦ Optional Closing Prayer:
Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible, look kindly upon us, and increase Your mercy in us, that in difficult moments, we might not despair nor become despondent, but with great confidence, submit ourselves to Your holy will, which is Love and Mercy itself.

Amen.`,
  },
];

// ─────────────────────────────────────────────────────────────
// NOVENAS
// To add a new novena:
//   1. Add an entry to the `novenas` array below with all fields filled in
//   2. Add your image to public/images/<id>.png  (or .jpg)
//      — The `image` field should be '/images/<id>.png'
//      — For external URLs just paste the full https:// link instead
//   3. Add day-by-day prayers to the `prayers` array (9 strings, one per day)
// ─────────────────────────────────────────────────────────────
export type Novena = {
  id: string;
  title: string;
  description: string;
  days: number;
  patron: string;
  intention: string;
  /** Path under /public or full https:// URL */
  image: string;
  /** One prayer string per day (9 total) */
  prayers: string[];
};

export const novenas: Novena[] = [
  {
    id: 'divine-mercy',
    title: 'Divine Mercy Novena',
    description: 'Nine days of prayer to Jesus Christ',
    days: 9,
    patron: 'Jesus Christ',
    intention: 'For the souls in purgatory and sinners',
    image: '/images/divine-mercy.png',
    prayers: [
      `DAY 1 — All Mankind, Especially Sinners

Today bring to Me all mankind, especially all sinners, and immerse them in the ocean of My mercy. In this way you will console Me in the bitter grief into which the loss of souls plunges Me.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 2 — Souls of Priests and Religious

Today bring to Me the souls of priests and religious, and immerse them in My unfathomable mercy. It was they who gave Me the strength to endure My bitter Passion.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 3 — All Devout and Faithful Souls

Today bring to Me all devout and faithful souls, and immerse them in the ocean of My mercy. These souls brought Me consolation on the Way of the Cross.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 4 — Those Who Do Not Believe and Those Who Do Not Yet Know Jesus

Today bring to Me the pagans and those who do not yet know Me. I was thinking also of them during My bitter Passion, and their future zeal comforted My Heart.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 5 — Heretics and Schismatics

Today bring to Me the souls of those who have separated themselves from My Church, and immerse them in the ocean of My mercy. During My bitter Passion they tore at My Body and Heart, that is, My Church.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 6 — The Meek and Humble Souls and Children

Today bring to Me the meek and humble souls and the souls of little children, and immerse them in My mercy. These souls most closely resemble My Heart.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 7 — Souls Who Venerate and Glorify Divine Mercy

Today bring to Me the souls who especially venerate and glorify My mercy, and immerse them in My mercy. These souls sorrowed most over My Passion and entered most deeply into My spirit.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 8 — Souls in Purgatory

Today bring to Me the souls that are in the prison of Purgatory, and immerse them in the abyss of My mercy. Let the torrents of My Blood cool down their scorching flames. All these souls are greatly loved by Me.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
      `DAY 9 — Souls Who Have Become Lukewarm

Today bring to Me the souls who have become lukewarm, and immerse them in the abyss of My mercy. These souls wound My Heart most painfully. My Heart suffered the most dreadful loathing in the Garden of Olives because of them.

✦ Pray the Chaplet of Divine Mercy using the guide found in Daily Prayers.

Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world. Amen.`,
    ],
  },
  {
    id: 'sacred-heart',
    title: 'Sacred Heart of Jesus',
    description: 'Devotion to the Sacred Heart',
    days: 9,
    patron: 'Jesus Christ',
    intention: 'For spiritual renewal and devotion',
    image: '/images/sacred-heart.png',
    prayers: Array.from({ length: 9 }, (_, i) =>
      `O most holy Heart of Jesus, fountain of every blessing, I adore You, I love You, and with a lively sorrow for my sins, I offer You this poor heart of mine. Make me humble, patient, pure, and wholly obedient to Your will. Grant, good Jesus, that I may live in You and for You.\n\n(Day ${i + 1}) Protect me in the midst of danger; comfort me in my afflictions; give me health of body, assistance in my temporal needs, Your blessing on all that I do, and the grace of a holy death. Amen.`
    ),
  },
  {
    id: 'our-lady-perpetual-help',
    title: 'Our Lady of Perpetual Help',
    description: 'Novena to Mary, Mother of Perpetual Help',
    days: 9,
    patron: 'Blessed Virgin Mary',
    intention: 'For help in times of need',
    image: '/images/our-lady-perpetual-help.png',
    prayers: Array.from({ length: 9 }, (_, i) =>
      `O Mother of Perpetual Help, grant that I may ever invoke your most powerful name, which is the safeguard of the living and the salvation of the dying. O Purest Mary, O Sweetest Mary, let your name henceforth be ever on my lips.\n\n(Day ${i + 1}) Delay not, O Blessed Lady, to help me whenever I call on you, for, in all my needs, in all my temptations, I shall never cease to call on you, ever repeating your sacred name, Mary, Mary. Amen.`
    ),
  },
  {
    id: 'st-jude',
    title: 'St. Jude Novena',
    description: 'Patron of hopeless cases',
    days: 9,
    patron: 'St. Jude Thaddeus',
    intention: 'For difficult situations and lost causes',
    image: '/images/st-jude.png',
    prayers: Array.from({ length: 9 }, (_, i) =>
      `Most holy Apostle, St. Jude Thaddeus, faithful servant and friend of Jesus, the Church honors and invokes you universally, as the patron of hopeless cases, of things almost despaired of.\n\n(Day ${i + 1}) Pray for me, I am so helpless and alone. Please bring visible and speedy help where help is almost despaired of. Come to my assistance in this great need that I may receive the consolation and help of heaven as I work with my challenges. I will always honor you as my special and powerful patron and encourage devotion to you. Amen.`
    ),
  },
  {
    id: 'st-joseph',
    title: 'St. Joseph Novena',
    description: 'Novena to the foster father of Jesus',
    days: 9,
    patron: 'St. Joseph',
    intention: 'For families and workers',
    image: '/images/st-joseph.png',
    prayers: Array.from({ length: 9 }, (_, i) =>
      `Oh, St. Joseph, whose protection is so great, so strong, so prompt before the throne of God, I place in you all my interests and desires.\n\n(Day ${i + 1}) Oh, St. Joseph, do assist me by your powerful intercession and obtain for me from your Divine Son all spiritual blessings through Jesus Christ, Our Lord; so that having engaged here below your heavenly power, I may offer my thanksgiving and homage to the most loving of Fathers. Amen.`
    ),
  },
  {
    id: 'holy-spirit',
    title: 'Novena to the Holy Spirit',
    description: 'The original novena between Ascension and Pentecost',
    days: 9,
    patron: 'Holy Spirit',
    intention: 'For gifts of the Holy Spirit',
    image: '/images/holy-spirit.png',
    prayers: Array.from({ length: 9 }, (_, i) =>
      `Come, Holy Spirit, fill the hearts of Your faithful and kindle in them the fire of Your love. Send forth Your Spirit and they shall be created and You shall renew the face of the earth.\n\n(Day ${i + 1}) O God, who by the light of the Holy Spirit did instruct the hearts of the faithful, grant that by the same Holy Spirit we may be truly wise and ever rejoice in His consolations, through Christ Our Lord. Amen.`
    ),
  },
  {
    id: 'st-carlo',
    title: 'St. Carlo Acutis Novena',
    description: 'Novena to the patron of the internet and youth',
    days: 9,
    patron: 'St. Carlo Acutis',
    intention: 'For young people, the internet, and those seeking God in modern life',
    image: '/images/st-carlo.png',
    prayers: Array.from({ length: 9 }, (_, i) =>
      `Dear St. Carlo Acutis, you who used your gifts and talents in service of the Lord and the Gospel, intercede for us that we too may offer all that we are to God.\n\n(Day ${i + 1}) Help us to find God in the digital world and to use modern technology for His glory. Pray for all young people, that they may seek the Eucharist as their "highway to heaven" just as you did. May we, like you, proclaim that it is not we who should follow the trends of the world, but rather bring Christ into every age. Amen.`
    ),
  },

  // ── ADD NEW NOVENAS BELOW THIS LINE ──────────────────────────
  // Example:
  // {
  //   id: 'st-therese',
  //   title: 'St. Thérèse of Lisieux Novena',
  //   description: 'The Little Flower novena',
  //   days: 9,
  //   patron: 'St. Thérèse of Lisieux',
  //   intention: 'For missionaries and those who suffer',
  //   image: '/images/st-therese.png',
  //   prayers: Array.from({ length: 9 }, (_, i) => `Your prayer text here. Day ${i + 1}.`),
  // },
];

export const rosaryMysteries = {
  joyful: [
    { title: 'The Annunciation', meditation: 'The angel Gabriel announces to Mary that she will be the Mother of God.' },
    { title: 'The Visitation', meditation: 'Mary visits her cousin Elizabeth, who is with child.' },
    { title: 'The Nativity', meditation: 'Jesus is born in Bethlehem.' },
    { title: 'The Presentation', meditation: 'Mary and Joseph present Jesus in the Temple.' },
    { title: 'Finding in the Temple', meditation: 'Mary and Joseph find the child Jesus in the Temple.' },
  ],
  luminous: [
    { title: 'The Baptism of Jesus', meditation: 'Jesus is baptized in the Jordan River.' },
    { title: 'The Wedding at Cana', meditation: 'Jesus performs His first miracle at the wedding feast.' },
    { title: 'Proclamation of the Kingdom', meditation: 'Jesus proclaims the coming of the Kingdom of God.' },
    { title: 'The Transfiguration', meditation: 'Jesus is transfigured on Mount Tabor.' },
    { title: 'Institution of the Eucharist', meditation: 'Jesus institutes the Eucharist at the Last Supper.' },
  ],
  sorrowful: [
    { title: 'The Agony in the Garden', meditation: 'Jesus prays in the Garden of Gethsemane.' },
    { title: 'The Scourging at the Pillar', meditation: 'Jesus is scourged by the Roman soldiers.' },
    { title: 'The Crowning with Thorns', meditation: 'Jesus is crowned with thorns and mocked.' },
    { title: 'The Carrying of the Cross', meditation: 'Jesus carries His cross to Calvary.' },
    { title: 'The Crucifixion', meditation: 'Jesus dies on the cross for our sins.' },
  ],
  glorious: [
    { title: 'The Resurrection', meditation: 'Jesus rises from the dead on Easter Sunday.' },
    { title: 'The Ascension', meditation: 'Jesus ascends into Heaven.' },
    { title: 'The Descent of the Holy Spirit', meditation: 'The Holy Spirit descends upon the Apostles at Pentecost.' },
    { title: 'The Assumption of Mary', meditation: 'Mary is assumed body and soul into Heaven.' },
    { title: 'The Coronation of Mary', meditation: 'Mary is crowned Queen of Heaven and Earth.' },
  ],
};

export const bibleQuotes = [
  {
    id: 1,
    text: 'For God so loved the world that he gave his only Son, so that everyone who believes in him might not perish but might have eternal life.',
    reference: 'John 3:16',
    category: 'Love',
  },
  {
    id: 2,
    text: 'I can do all things through him who strengthens me.',
    reference: 'Philippians 4:13',
    category: 'Strength',
  },
  {
    id: 3,
    text: 'The Lord is my shepherd; there is nothing I lack.',
    reference: 'Psalm 23:1',
    category: 'Peace',
  },
  {
    id: 4,
    text: 'Be strong and steadfast; have no fear or dread of them, for it is the LORD, your God, who marches with you; he will never fail you or forsake you.',
    reference: 'Deuteronomy 31:6',
    category: 'Courage',
  },
  {
    id: 5,
    text: 'Trust in the LORD with all your heart, on your own intelligence do not rely.',
    reference: 'Proverbs 3:5',
    category: 'Faith',
  },
  {
    id: 6,
    text: 'Come to me, all you who labor and are burdened, and I will give you rest.',
    reference: 'Matthew 11:28',
    category: 'Peace',
  },
  {
    id: 7,
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    reference: 'Philippians 4:6',
    category: 'Peace',
  },
  {
    id: 8,
    text: 'Love is patient, love is kind. It is not jealous, it is not pompous, it is not inflated, it is not rude.',
    reference: '1 Corinthians 13:4',
    category: 'Love',
  },
  {
    id: 9,
    text: 'The LORD is close to the brokenhearted, saves those whose spirit is crushed.',
    reference: 'Psalm 34:18',
    category: 'Comfort',
  },
  {
    id: 10,
    text: 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.',
    reference: 'Matthew 7:7',
    category: 'Faith',
  },
  {
    id: 11,
    text: 'For I know well the plans I have in mind for you, says the LORD, plans for your welfare, not for woe! plans to give you a future full of hope.',
    reference: 'Jeremiah 29:11',
    category: 'Hope',
  },
  {
    id: 12,
    text: 'We know that all things work for good for those who love God, who are called according to his purpose.',
    reference: 'Romans 8:28',
    category: 'Faith',
  },
  {
    id: 13,
    text: 'Do not fear: I am with you; do not be anxious: I am your God. I will strengthen you, I will help you, I will uphold you with my victorious right hand.',
    reference: 'Isaiah 41:10',
    category: 'Courage',
  },
  {
    id: 14,
    text: 'Your word is a lamp for my feet, a light for my path.',
    reference: 'Psalm 119:105',
    category: 'Wisdom',
  },
  {
    id: 15,
    text: 'I command you: be firm and steadfast! Do not fear nor be dismayed, for the LORD, your God, is with you wherever you go.',
    reference: 'Joshua 1:9',
    category: 'Courage',
  },
  {
    id: 16,
    text: 'We love because he first loved us.',
    reference: '1 John 4:19',
    category: 'Love',
  },
  {
    id: 17,
    text: 'Do not conform yourselves to this age but be transformed by the renewal of your mind, that you may discern what is the will of God, what is good and pleasing and perfect.',
    reference: 'Romans 12:2',
    category: 'Wisdom',
  },
  {
    id: 18,
    text: 'God is our refuge and our strength, an ever-present help in distress.',
    reference: 'Psalm 46:2',
    category: 'Strength',
  },
  {
    id: 19,
    text: 'But seek first the kingdom of God and his righteousness, and all these things will be given you besides.',
    reference: 'Matthew 6:33',
    category: 'Faith',
  },
  {
    id: 20,
    text: 'Faith is the realization of what is hoped for and evidence of things not seen.',
    reference: 'Hebrews 11:1',
    category: 'Faith',
  },
  {
    id: 21,
    text: 'For we walk by faith, not by sight.',
    reference: '2 Corinthians 5:7',
    category: 'Faith',
  },
  {
    id: 22,
    text: 'May the God of hope fill you with all joy and peace in believing, so that you may abound in hope by the power of the holy Spirit.',
    reference: 'Romans 15:13',
    category: 'Hope',
  },
  {
    id: 23,
    text: 'But if any of you lacks wisdom, he should ask God who gives to all generously and ungrudgingly, and he will be given it.',
    reference: 'James 1:5',
    category: 'Wisdom',
  },
  {
    id: 24,
    text: 'Cast all your worries upon him because he cares for you.',
    reference: '1 Peter 5:7',
    category: 'Comfort',
  },
  {
    id: 25,
    text: 'This is the day the LORD has made; let us rejoice in it and be glad.',
    reference: 'Psalm 118:24',
    category: 'Joy',
  },
  {
    id: 26,
    text: 'For by grace you have been saved through faith, and this is not from you; it is the gift of God.',
    reference: 'Ephesians 2:8',
    category: 'Faith',
  },
  {
    id: 27,
    text: 'And over all these put on love, that is, the bond of perfection.',
    reference: 'Colossians 3:14',
    category: 'Love',
  },
  {
    id: 28,
    text: 'The LORD’s acts of mercy are not exhausted, his compassion is not spent; They are renewed each morning—great is your faithfulness!',
    reference: 'Lamentations 3:22-23',
    category: 'Hope',
  },
  {
    id: 29,
    text: 'You have been told, O mortal, what is good, and what the LORD requires of you: Only to do justice and to love goodness, and to walk humbly with your God.',
    reference: 'Micah 6:8',
    category: 'Wisdom',
  },
  {
    id: 30,
    text: 'Rejoice in the Lord always. I shall say it again: rejoice!',
    reference: 'Philippians 4:4',
    category: 'Joy',
  }
];