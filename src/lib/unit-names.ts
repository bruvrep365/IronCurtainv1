import { UnitType, Faction } from './types';

const ORDINALS = [
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
  '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th',
  '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th',
  '31st', '32nd', '33rd', '34th', '35th', '36th', '37th', '38th', '39th', '40th',
  '41st', '42nd', '43rd', '44th', '45th', '46th', '47th', '48th', '49th', '50th',
];

const USA_DESCRIPTORS: Record<UnitType, string[]> = {
  infantry: ['Infantry', 'Rifle', 'Mountain', 'Airborne', 'Marine'],
  armor: ['Armored', 'Tank', 'Cavalry', 'Mechanized'],
  air: ['Air Wing', 'Fighter Wing', 'Bomb Wing', 'Tactical Wing'],
  navy: ['Fleet', 'Naval', 'Amphibious', 'Carrier Group'],
};

const USA_PREFIXES = ['', '', '', 'Guards', 'National Guard', 'Reserve'];

const USSR_DESCRIPTORS: Record<UnitType, string[]> = {
  infantry: ['Rifle', 'Motorized Rifle', 'Guards Rifle', 'Mountain', 'Air Assault'],
  armor: ['Tank', 'Guards Tank', 'Mechanized', 'Armored'],
  air: ['Air Army', 'Fighter', 'Bomber', 'Ground Attack'],
  navy: ['Fleet', 'Naval', 'Submarine', 'Amphibious'],
};

const USSR_HONORS = ['', '', '', 'Guards', 'Red Banner', 'Order of Lenin', 'Order of Suvorov'];

const NATO_COUNTRY_NAMES: Record<string, string> = {
  usa: 'US', canada: 'Canadian', uk: 'British', france: 'French', italy: 'Italian',
  west_germany: 'US', japan: 'JSDF', south_korea: 'ROK', turkey: 'Turkish',
  greece: 'Hellenic', norway: 'Norwegian', denmark: 'Danish', australia: 'Australian',
  new_zealand: 'NZ', taiwan: 'ROC', philippines: 'Philippine', thailand: 'Thai',
  malaysia: 'Malayan', singapore: 'Singapore', netherlands: 'Dutch', belgium: 'Belgian',
};

const WARSAW_COUNTRY_NAMES: Record<string, string> = {
  ussr: 'Soviet', east_germany: 'NVA', poland: 'Polish', czechoslovakia: 'Czechoslovak',
  hungary: 'Hungarian', romania: 'Romanian', bulgaria: 'Bulgarian', albania: 'Albanian',
  china: 'PLA', north_korea: 'KPA', mongolia: 'Mongolian', vietnam: 'PAVN',
  laos: 'Laotian', cambodia: 'Khmer', cuba: 'Cuban', kazakhstan: 'Kazakh',
  uzbekistan: 'Uzbek', turkmenistan: 'Turkmen',
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let counter = 0;
function nextOrdinal(): string {
  const o = ORDINALS[counter % ORDINALS.length];
  counter++;
  return o;
}

export function generateUnitName(type: UnitType, countryId: string, owner: Faction): string {
  const ordinal = nextOrdinal();

  if (owner === 'usa') {
    const countryPrefix = NATO_COUNTRY_NAMES[countryId] || 'Allied';
    const descriptor = pick(USA_DESCRIPTORS[type]);
    const prefix = pick(USA_PREFIXES);
    const suffix = type === 'infantry' || type === 'armor' ? 'Division' : type === 'air' ? 'Wing' : 'Flotilla';

    const parts = [ordinal, prefix, descriptor, suffix].filter(Boolean);
    if (countryPrefix !== 'US') {
      return `${countryPrefix} ${parts.join(' ')}`.replace(/\s+/g, ' ').trim();
    }
    return parts.join(' ');
  } else {
    const countryPrefix = WARSAW_COUNTRY_NAMES[countryId] || 'Soviet';
    const descriptor = pick(USSR_DESCRIPTORS[type]);
    const honor = pick(USSR_HONORS);
    const suffix = type === 'infantry' || type === 'armor' ? 'Division' : type === 'air' ? 'Army' : 'Flotilla';

    const parts = [ordinal, honor, descriptor, suffix].filter(Boolean);
    if (countryPrefix !== 'Soviet') {
      return `${countryPrefix} ${parts.join(' ')}`.replace(/\s+/g, ' ').trim();
    }
    return parts.join(' ');
  }
}
