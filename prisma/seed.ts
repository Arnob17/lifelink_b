import {
  ListingType,
  PrismaClient,
  Role,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('lifelink-demo', 10);

  await prisma.listing.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.user.deleteMany();

  const userAlice = await prisma.user.create({
    data: {
      email: 'alice@demo.lifelink',
      passwordHash,
      name: 'Alice Rahman',
      phone: '+1-555-0101',
      role: Role.USER,
    },
  });

  const userBob = await prisma.user.create({
    data: {
      email: 'bob@demo.lifelink',
      passwordHash,
      name: 'Bob Chen',
      phone: '+1-555-0102',
      role: Role.USER,
    },
  });

  const userCharlie = await prisma.user.create({
    data: {
      email: 'charlie@demo.lifelink',
      passwordHash,
      name: 'Charlie Okonkwo',
      phone: '+1-555-0103',
      role: Role.USER,
    },
  });

  const userDana = await prisma.user.create({
    data: {
      email: 'dana@demo.lifelink',
      passwordHash,
      name: 'Dana Park',
      phone: '+1-555-0104',
      role: Role.USER,
    },
  });

  const bizBlood = await prisma.user.create({
    data: {
      email: 'centralblood@demo.lifelink',
      passwordHash,
      name: 'Central Blood Services',
      phone: '+1-555-0200',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'Central Blood Services',
          description: 'Regional blood collection and distribution.',
          verified: true,
        },
      },
    },
  });

  const bizHealth = await prisma.user.create({
    data: {
      email: 'riverside@demo.lifelink',
      passwordHash,
      name: 'Riverside Health Network',
      phone: '+1-555-0300',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'Riverside Health Network',
          description: 'Clinics, pharmacy, and community programs.',
          verified: true,
        },
      },
    },
  });

  const bizEdu = await prisma.user.create({
    data: {
      email: 'brightpath@demo.lifelink',
      passwordHash,
      name: 'BrightPath Learning',
      phone: '+1-555-0400',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'BrightPath Learning',
          description: 'After-school tutoring and adult education.',
          verified: false,
        },
      },
    },
  });

  const bizNews = await prisma.user.create({
    data: {
      email: 'citypulse@demo.lifelink',
      passwordHash,
      name: 'CityPulse Media',
      phone: '+1-555-0500',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'CityPulse Media',
          description: 'Independent civic newsroom.',
          verified: true,
        },
      },
    },
  });

  const bizJobs = await prisma.user.create({
    data: {
      email: 'harborworks@demo.lifelink',
      passwordHash,
      name: 'HarborWorks Staffing',
      phone: '+1-555-0600',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'HarborWorks Staffing',
          description: 'Healthcare and logistics hiring partner.',
          verified: true,
        },
      },
    },
  });

  // Base coordinates: San Francisco downtown (+ Oakland / Berkeley for map spread)
  const baseLat = 37.7749;
  const baseLng = -122.4194;
  const oakLat = 37.8044;
  const oakLng = -122.2712;
  const berkLat = 37.8716;
  const berkLng = -122.2728;

  await prisma.listing.createMany({
    data: [
      {
        type: ListingType.BLOOD_DONOR,
        title: 'Blood donor — O+',
        description: 'Available evenings and weekends for emergency support.',
        address: 'Mission District, San Francisco',
        latitude: baseLat + 0.01,
        longitude: baseLng - 0.02,
        contactPhone: userAlice.phone ?? undefined,
        metadata: { bloodGroup: 'O+', available: true },
        ownerId: userAlice.id,
      },
      {
        type: ListingType.BLOOD_DONOR,
        title: 'Blood donor — A-',
        description: 'Rare donor — please coordinate through LifeLink.',
        address: 'SoMa, San Francisco',
        latitude: baseLat - 0.008,
        longitude: baseLng + 0.015,
        contactPhone: userBob.phone ?? undefined,
        metadata: { bloodGroup: 'A-', available: true },
        ownerId: userBob.id,
      },
      {
        type: ListingType.BLOOD_DONOR,
        title: 'Blood donor — B+',
        description: 'Weekend availability; can travel within 15 km for urgent need.',
        address: 'Nob Hill, San Francisco',
        latitude: baseLat + 0.005,
        longitude: baseLng + 0.011,
        contactPhone: userCharlie.phone ?? undefined,
        metadata: { bloodGroup: 'B+', available: true },
        ownerId: userCharlie.id,
      },
      {
        type: ListingType.BLOOD_DONOR,
        title: 'Blood donor — AB+',
        description: 'Universal plasma donor — coordinate through LifeLink only.',
        address: 'North Beach, San Francisco',
        latitude: baseLat - 0.006,
        longitude: baseLng - 0.014,
        contactPhone: userDana.phone ?? undefined,
        metadata: { bloodGroup: 'AB+', available: true },
        ownerId: userDana.id,
      },
      {
        type: ListingType.BLOOD_BANK,
        title: 'Central Blood Services — Van Ness',
        description: 'Whole blood and platelet donations. Walk-ins welcome.',
        address: '1200 Van Ness Ave, San Francisco',
        latitude: baseLat + 0.006,
        longitude: baseLng + 0.004,
        contactEmail: 'donate@centralblood.demo',
        contactPhone: '+1-555-1200',
        metadata: {
          stock: { 'O+': 'high', 'A+': 'medium', 'B+': 'low', 'AB+': 'medium' },
        },
        ownerId: bizBlood.id,
      },
      {
        type: ListingType.BLOOD_BANK,
        title: 'Central Blood Services — Mission Pop-up',
        description: 'Weekend mobile collection unit.',
        address: '16th St & Valencia, San Francisco',
        latitude: baseLat - 0.012,
        longitude: baseLng - 0.01,
        contactPhone: '+1-555-1201',
        metadata: { stock: { 'O+': 'medium', 'O-': 'low' } },
        ownerId: bizBlood.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'Riverside Community Clinic',
        description: 'Primary care, vaccinations, and chronic care management.',
        address: '450 Market St, San Francisco',
        latitude: baseLat + 0.003,
        longitude: baseLng - 0.006,
        contactPhone: '+1-555-3100',
        metadata: { hours: 'Mon–Sat 8a–8p', languages: ['EN', 'ES', 'ZH'] },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'Harbor Urgent Care',
        description: 'Urgent care with on-site labs.',
        address: '88 Spear St, San Francisco',
        latitude: baseLat - 0.004,
        longitude: baseLng + 0.02,
        contactPhone: '+1-555-3101',
        metadata: { waitTimeMins: 25 },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'Riverside Pharmacy — Castro',
        description: 'Prescriptions, OTC, and vaccine appointments.',
        address: '400 Castro St, San Francisco',
        latitude: baseLat - 0.015,
        longitude: baseLng - 0.018,
        contactPhone: '+1-555-3200',
        metadata: { delivery: true },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'Harbor Night Pharmacy',
        description: '24/7 pharmacy window.',
        address: '1 Ferry Building, San Francisco',
        latitude: baseLat + 0.018,
        longitude: baseLng + 0.012,
        contactPhone: '+1-555-3201',
        metadata: { open247: true },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'Ms. Lina Kapoor — AP Chemistry',
        description: '10+ years classroom experience; small group sessions.',
        address: 'Online + Sunset District',
        latitude: baseLat + 0.02,
        longitude: baseLng - 0.022,
        contactEmail: 'lina@brightpath.demo',
        metadata: { subjects: ['Chemistry', 'Physics'], rateUsd: 65 },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'Mr. Diego Morales — ESL & Literacy',
        description: 'Community college instructor; evening cohorts.',
        address: 'Tenderloin Learning Hub',
        latitude: baseLat + 0.009,
        longitude: baseLng + 0.008,
        contactPhone: '+1-555-4100',
        metadata: { subjects: ['ESL', 'Literacy'], cohort: 'evening' },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.JOB,
        title: 'Registered Nurse — Night Shift',
        description: 'ICU step-down unit; union hospital; signing bonus.',
        address: 'San Francisco Medical Center',
        latitude: baseLat - 0.007,
        longitude: baseLng - 0.014,
        contactEmail: 'careers@harborworks.demo',
        metadata: { salaryRange: '$118k–$142k', shift: 'night', license: 'RN' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'Community Health Driver',
        description: 'Deliver supplies between clinics; CDL preferred.',
        address: 'Bay Area routes',
        latitude: baseLat + 0.011,
        longitude: baseLng + 0.019,
        contactEmail: 'drivers@harborworks.demo',
        metadata: { salaryRange: '$28–$34/hr', type: 'full-time' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.NEWS,
        title: 'City rolls out winter shelter expansion',
        description:
          'Officials add 400 beds across three neighborhoods as cold fronts approach.',
        address: 'City Hall, San Francisco',
        latitude: baseLat + 0.002,
        longitude: baseLng + 0.001,
        metadata: { category: 'housing', readingMins: 4 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'Blood supply stabilizes after donor drive',
        description:
          'Hospitals report improved platelet inventory following weekend campaign.',
        address: 'Regional health desk',
        latitude: baseLat - 0.002,
        longitude: baseLng + 0.003,
        metadata: { category: 'health', readingMins: 3 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'New transit passes for students',
        description:
          'Unified pass pilot launches next month for high school commuters.',
        address: 'Transit agency HQ',
        latitude: baseLat + 0.014,
        longitude: baseLng - 0.011,
        metadata: { category: 'transit', readingMins: 5 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.BLOOD_BANK,
        title: 'East Bay Regional Blood Center',
        description: 'Platelets and rare-type registry; appointments preferred.',
        address: 'Oakland, CA',
        latitude: oakLat,
        longitude: oakLng,
        contactPhone: '+1-555-1202',
        contactEmail: 'appointments@eastbayblood.demo',
        metadata: { stock: { 'O+': 'high', 'B-': 'medium', 'AB-': 'low' } },
        ownerId: bizBlood.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'Lake Merritt Family Health',
        description: 'Pediatrics, prenatal, and diabetes education.',
        address: 'Oakland, CA',
        latitude: oakLat + 0.008,
        longitude: oakLng - 0.012,
        contactPhone: '+1-555-3102',
        metadata: { hours: 'Mon–Fri 7a–7p' },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'Telegraph Pharmacy & Wellness',
        description: 'Compounding and travel vaccines.',
        address: 'Berkeley, CA',
        latitude: berkLat,
        longitude: berkLng,
        contactPhone: '+1-555-3202',
        metadata: { delivery: false },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.JOB,
        title: 'Medical Lab Technician',
        description: 'Certified MLT for outpatient lab; day shift.',
        address: 'Berkeley, CA',
        latitude: berkLat - 0.004,
        longitude: berkLng + 0.006,
        contactEmail: 'labs@harborworks.demo',
        metadata: { salaryRange: '$34–$41/hr', license: 'MLT' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'Dr. Amira Hassan — Mathematics (IB)',
        description: 'IB and AP math; small groups and exam prep.',
        address: 'Berkeley + online',
        latitude: berkLat + 0.006,
        longitude: berkLng - 0.008,
        contactEmail: 'amira@brightpath.demo',
        metadata: { subjects: ['Math', 'Statistics'], rateUsd: 80 },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.NEWS,
        title: 'Free flu shots expand at neighborhood pharmacies',
        description:
          'County partners with retail pharmacies for walk-in immunization weeks.',
        address: 'Public health bulletin',
        latitude: oakLat - 0.01,
        longitude: oakLng + 0.015,
        metadata: { category: 'health', readingMins: 2 },
        ownerId: bizNews.id,
      },
    ],
  });

  const count = await prisma.listing.count();
  // eslint-disable-next-line no-console
  console.log(
    `Seed complete: ${count} listings. Demo password for all accounts: lifelink-demo`,
  );
  // eslint-disable-next-line no-console
  console.log('Demo users: alice, bob, charlie @demo.lifelink + business accounts in seed.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
