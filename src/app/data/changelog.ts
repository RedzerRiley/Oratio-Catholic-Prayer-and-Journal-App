// ─────────────────────────────────────────────────────────────────
// CHANGELOG
// To add a new version:
//   1. Add a new entry to the TOP of the `versions` array
//   2. Set `latest: true` on the new entry and `latest: false` on all others
//   3. The "What's New" popup will automatically show for users who
//      haven't seen this version yet (stored in Firestore per user)
// ─────────────────────────────────────────────────────────────────

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  latest: boolean;
  changes: {
    category: 'New' | 'Improved' | 'Fixed' | 'Removed';
    items: string[];
  }[];
};

export const versions: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: 'April 4, 2026',
    title: 'Updated Divine Mercy Novena, Chaplet, & A Confession Guide 🕊️',
    description: 'Added the Chaplet of Divine Mercy with a full step-by-step guide, enriched novena day prayers, and deeper integration between the Daily Prayers and Novenas. And also added a new guidance section for confession preparation.',
    latest: true,
    changes: [
      {
        category: 'New',
        items: [
          'Chaplet of Divine Mercy — full step-by-step guide added to Daily Prayers with its own Chaplet category',
          'Divine Mercy Novena Prayers — each of the 9 days now features the proper St. Faustina intention for that day alongside the chaplet prayers',
          'Pray the Chaplet button — a dedicated button on the Divine Mercy Novena detail screen links directly to the Chaplet guide in Daily Prayers and auto-opens it',
          'Added a guidance section for confession.',
        ],
      },
      {
        category: 'Improved',
        items: [
          'Daily Prayers categories — added a new "Chaplet" filter tab so chaplet prayers are easy to find',
          'Novena day prayers — Divine Mercy Novena now uses the authentic 9-day intentions revealed to St. Faustina instead of generic text',
        ],
      },
    ],
  },
  {
    version: '1.1.0',
    date: 'March 31, 2026',
    title: 'Animations & Polish ✨',
    description: 'Added beautiful animations, soothing chimes, and quality-of-life improvements across the app.',
    latest: false,
    changes: [
      {
        category: 'New',
        items: [
          'Novena Reset — added a subtle reset button to clear your novena progress and start over',
          'Prayer Animations & Sounds — added delightful particle animations and soothing bell chimes when completing daily prayers, rosaries, and novenas',
          'What\'s New Access — added a dedicated "?" button on the Home screen header to view the latest updates anytime',
        ],
      },
      {
        category: 'Improved',
        items: [
          'Novena Images — upgraded the hero image layout with a blurred background fill technique so all images fit perfectly without stretching or cropping',
          'Daily Prayers Design — updated the header to match the app\'s rounded design language with a flush search bar',
          'Update Popup — the What\'s New popup now reliably shows for returning users on login (once per session)',
        ],
      },
      {
        category: 'Fixed',
        items: [
          'Visual Glitches — fixed an issue with the new animations creating a white dot by properly clipping particles to the button bounds',
        ],
      },
    ],
  },
  {
    version: '1.0.0',
    date: 'March 19, 2026',
    title: 'Initial Release 🎉',
    description: 'Oratio is here — your personal Catholic companion for daily prayer, devotion, and spiritual growth.',
    latest: false,
    changes: [
      {
        category: 'New',
        items: [
          'Daily Prayers — browse and pray essential Catholic prayers with a beautiful slide-up reader',
          'Holy Rosary — full step-by-step interactive guided Rosary with all four mysteries, auto-selected by day',
          'Rosary counter — track how many times you have prayed the Rosary with milestone celebrations',
          'Novenas — nine-day prayer journeys with date-locked daily progression',
          'St. Carlo Acutis Novena — dedicated novena to the first millennial saint',
          'Confession Journal — privately prepare for the Sacrament of Reconciliation with categorized entries',
          'Examination of Conscience — guided reflection based on the Ten Commandments',
          'Mass Attendance Tracker — log your Sunday Mass attendance with streak counter',
          'Sunday reminder — automatic prompt every Sunday to log your church attendance',
          'User accounts — sign up with Email/Password or Google',
          'Profile page — change your display name, profile photo, and password',
          'Daily Bible verse — rotating verse of the day from Sacred Scripture',
          'Personalized greeting — time-based greeting with your first name',
          'Cloud sync — all data securely stored in Firebase, accessible on any device',
        ],
      },
    ],
  },
];

export const latestVersion = versions.find(v => v.latest) ?? versions[0];