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
    version: '1.0.0',
    date: 'March 19, 2026',
    title: 'Initial Release 🎉',
    description: 'Oratio is here — your personal Catholic companion for daily prayer, devotion, and spiritual growth.',
    latest: true,
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

  // ── ADD NEW VERSIONS ABOVE THIS LINE ─────────────────────────
  // Example:
  // {
  //   version: '1.1.0',
  //   date: 'April 1, 2026',
  //   title: 'Spring Update 🌸',
  //   description: 'New features and improvements for the Easter season.',
  //   latest: true,   ← set this to true, set 1.0.0 latest to false
  //   changes: [
  //     {
  //       category: 'New',
  //       items: ['Push notifications for daily prayer reminders'],
  //     },
  //     {
  //       category: 'Improved',
  //       items: ['Faster loading times across all pages'],
  //     },
  //   ],
  // },
];

export const latestVersion = versions.find(v => v.latest) ?? versions[0];