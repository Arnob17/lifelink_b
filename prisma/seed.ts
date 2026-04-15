import { ListingType, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** ঢাকা কেন্দ্র — ফ্রন্টএন্ডের ডিফল্টের সাথে মিল রেখে */
const DHAKA_LAT = 23.810331;
const DHAKA_LNG = 90.412521;

/** ~১ কিমি জুড়ে ছড়িয়ে দিতে ছোট অফসেট */
function at(dx: number, dy: number) {
  return {
    latitude: DHAKA_LAT + dx,
    longitude: DHAKA_LNG + dy,
  };
}

async function main() {
  const passwordHash = await bcrypt.hash('lifelink-demo', 10);

  await prisma.listing.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.feedPost.deleteMany();
  await prisma.user.deleteMany();

  const userAlice = await prisma.user.create({
    data: {
      email: 'alice@demo.lifelink',
      passwordHash,
      name: 'আয়েশা রহমান',
      phone: '+8801711000101',
      role: Role.USER,
    },
  });

  const userBob = await prisma.user.create({
    data: {
      email: 'bob@demo.lifelink',
      passwordHash,
      name: 'করিম হাসান',
      phone: '+8801711000102',
      role: Role.USER,
    },
  });

  const userCharlie = await prisma.user.create({
    data: {
      email: 'charlie@demo.lifelink',
      passwordHash,
      name: 'চার্লি আহমেদ',
      phone: '+8801711000103',
      role: Role.USER,
    },
  });

  const userDana = await prisma.user.create({
    data: {
      email: 'dana@demo.lifelink',
      passwordHash,
      name: 'দীপা সেনগুপ্ত',
      phone: '+8801711000104',
      role: Role.USER,
    },
  });

  const userEti = await prisma.user.create({
    data: {
      email: 'eti@demo.lifelink',
      passwordHash,
      name: 'এতি চৌধুরী',
      phone: '+8801711000105',
      role: Role.USER,
    },
  });

  const bizBlood = await prisma.user.create({
    data: {
      email: 'bloodlink@demo.lifelink',
      passwordHash,
      name: 'ব্লাডলিংক বাংলাদেশ',
      phone: '+8801711000200',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'ব্লাডলিংক বাংলাদেশ',
          description: 'রক্ত সংগ্রহ ও বিতরণ নেটওয়ার্ক।',
          verified: true,
        },
      },
    },
  });

  const bizHealth = await prisma.user.create({
    data: {
      email: 'shastho@demo.lifelink',
      passwordHash,
      name: 'স্বাস্থ্য প্লাজা গ্রুপ',
      phone: '+8801711000300',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'স্বাস্থ্য প্লাজা গ্রুপ',
          description: 'ক্লিনিক, ডায়াগনostic ও ফার্মেসি চেইন।',
          verified: true,
        },
      },
    },
  });

  const bizEdu = await prisma.user.create({
    data: {
      email: 'pathshala@demo.lifelink',
      passwordHash,
      name: 'পাঠশালা একাডেমি',
      phone: '+8801711000400',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'পাঠশালা একাডেমি',
          description: 'বোর্ড, ভর্তি ও স্কিল ট্রেনিং।',
          verified: true,
        },
      },
    },
  });

  const bizNews = await prisma.user.create({
    data: {
      email: 'lifelink.news@demo.lifelink',
      passwordHash,
      name: 'লাইফলিংক নিউজ ডেস্ক',
      phone: '+8801711000500',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'লাইফলিংক নিউজ ডেস্ক',
          description: 'স্বাস্থ্য, রক্ত ও সমাজসেবা বিষয়ক নিজস্ব বুলেটিন।',
          verified: true,
        },
      },
    },
  });

  const bizJobs = await prisma.user.create({
    data: {
      email: 'jobsbd@demo.lifelink',
      passwordHash,
      name: 'চাকরির বাজার BD',
      phone: '+8801711000600',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'চাকরির বাজার BD',
          description: 'হাসপাতাল, লজিস্টিক্স ও আইটি নিয়োগ পার্টনার।',
          verified: true,
        },
      },
    },
  });

  const bizPharma = await prisma.user.create({
    data: {
      email: 'oshudh@demo.lifelink',
      passwordHash,
      name: 'ঔষধ নেটওয়ার্ক লিমিটেড',
      phone: '+8801711000700',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'ঔষধ নেটওয়ার্ক লিমিটেড',
          description: '২৪ ঘণ্টা ফার্মেসি ও হোম ডেলিভারি।',
          verified: true,
        },
      },
    },
  });

  const p = (dx: number, dy: number) => at(dx, dy);

  await prisma.listing.createMany({
    data: [
      // ——— রক্তদাতা ———
      {
        type: ListingType.BLOOD_DONOR,
        title: 'রক্তদাতা — O+ (ধানমন্ডি)',
        description:
          'জরুরি প্রয়োজনে সন্ধ্যা ও সপ্তাহান্তে যোগাযোগযোগ্য। লাইফলিংকের মাধ্যমে যোগাযোগ করুন।',
        address: 'ধানমন্ডি ১৫, ঢাকা',
        ...p(0.008, -0.012),
        contactPhone: userAlice.phone ?? undefined,
        metadata: { bloodGroup: 'O+', available: true },
        ownerId: userAlice.id,
      },
      {
        type: ListingType.BLOOD_DONOR,
        title: 'রক্তদাতা — A- (গুলশান)',
        description: 'বিরল গ্রুপ — শুধু যাচাইকৃত অনুরোধে সাড়া দেব।',
        address: 'গুলশান ২, ঢাকা',
        ...p(0.022, 0.018),
        contactPhone: userBob.phone ?? undefined,
        metadata: { bloodGroup: 'A-', available: true },
        ownerId: userBob.id,
      },
      {
        type: ListingType.BLOOD_DONOR,
        title: 'রক্তদাতা — B+ (মিরপুর)',
        description: 'সপ্তাহান্তে উপলব্ধ; ১৫ কিমি এর মধ্যে জরুরি যাতায়াত সম্ভব।',
        address: 'মিরপুর ১০, ঢাকা',
        ...p(-0.018, -0.025),
        contactPhone: userCharlie.phone ?? undefined,
        metadata: { bloodGroup: 'B+', available: true },
        ownerId: userCharlie.id,
      },
      {
        type: ListingType.BLOOD_DONOR,
        title: 'রক্তদাতা — AB+ (উত্তরা)',
        description: 'প্লাজমা দানে আগ্রহী; সমন্বয় লাইফলিংকের মাধ্যমে।',
        address: 'উত্তরা সেক্টর ৭, ঢাকা',
        ...p(0.035, -0.008),
        contactPhone: userDana.phone ?? undefined,
        metadata: { bloodGroup: 'AB+', available: true },
        ownerId: userDana.id,
      },
      {
        type: ListingType.BLOOD_DONOR,
        title: 'রক্তদাতা — O- (মোহাম্মদপুর)',
        description: 'সার্বজনীন দাতা — হাসপাতাল রেফারেন্স সহ যোগাযোগ করুন।',
        address: 'মোহাম্মদপুর, ঢাকা',
        ...p(-0.012, -0.018),
        contactPhone: userEti.phone ?? undefined,
        metadata: { bloodGroup: 'O-', available: true },
        ownerId: userEti.id,
      },

      // ——— রক্তব্যাংক ———
      {
        type: ListingType.BLOOD_BANK,
        title: 'কুয়েত মৈত্রী হাসপাতাল — ব্লাড ব্যাংক',
        description: 'সম্পূর্ণ রক্ত ও প্লাটিলেট; ওয়াক-ইন ও অ্যাপয়েন্টমেন্ট।',
        address: 'সেগুনবাগিচা, ঢাকা',
        ...p(0.005, 0.006),
        contactEmail: 'blood@kuwaitmoitri.demo',
        contactPhone: '+8802222220001',
        metadata: {
          stock: { 'O+': 'high', 'A+': 'medium', 'B+': 'medium', 'AB+': 'low' },
        },
        ownerId: bizBlood.id,
      },
      {
        type: ListingType.BLOOD_BANK,
        title: 'ঢাকা মেডিকেল কলেজ হাসপাতাল — ব্লাড ব্যাংক',
        description: '২৪/৭ জরুরি রক্ত; রেজিস্ট্রি ও ক্রসম্যাচ।',
        address: 'বকশীবাজার, ঢাকা',
        ...p(-0.006, 0.014),
        contactPhone: '+8802222220002',
        metadata: { stock: { 'O+': 'high', 'O-': 'medium', 'B-': 'low' } },
        ownerId: bizBlood.id,
      },
      {
        type: ListingType.BLOOD_BANK,
        title: 'স্কয়ার হাসপাতাল — ব্লাড সেন্টার',
        description: 'অ্যাপয়েন্টমেন্ট প্রাধান্য; প্লাটিলেট ডোনেশন।',
        address: 'পanthaPath, ঢাকা',
        ...p(0.012, -0.01),
        contactEmail: 'blood@squarehospital.demo',
        contactPhone: '+8802222220003',
        metadata: { stock: { 'A+': 'high', 'AB+': 'medium' } },
        ownerId: bizBlood.id,
      },
      {
        type: ListingType.BLOOD_BANK,
        title: 'ল্যাব এইড ডায়াগনostic — ব্লাড ইউনিট',
        description: 'মোবাইল কালেকশন ক্যাম্প সাপ্তাহিক।',
        address: 'ধানমন্ডি ২৭, ঢাকা',
        ...p(0.006, -0.016),
        contactPhone: '+8802222220004',
        metadata: { stock: { 'O+': 'medium', 'B+': 'high' } },
        ownerId: bizBlood.id,
      },

      // ——— ক্লিনিক ———
      {
        type: ListingType.CLINIC,
        title: 'আপোলো হাসপাতাল ঢাকা — আউটডোর',
        description: 'প্রাথমিক চিকিৎসা, টিকাদান ও ক্রনিক কেয়ার ফলোআপ।',
        address: 'বসুন্ধরা, ঢাকা',
        ...p(0.028, 0.022),
        contactPhone: '+8802988776655',
        metadata: { hours: 'সপ্তাহে ৭ দিন ৮টা–৮টা', languages: ['BN', 'EN'] },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'ইবনে সিনা ডায়াগনostic — ধানমন্ডি',
        description: 'কনসালটেশন ও ডায়াগনostic এক ছাদের নিচে।',
        address: 'ধানমন্ডি ৯/এ, ঢাকা',
        ...p(0.004, -0.014),
        contactPhone: '+8802988776656',
        metadata: { hours: 'শনি–বৃহ ৮টা–১০টা' },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'পপুলার মেডিকেল কলেজ হাসপাতাল — OPD',
        description: 'জেনারেল ও স্পেশালিস্ট OPD; ল্যাব অন-সাইট।',
        address: 'মিরপুর রোড, ঢাকা',
        ...p(-0.014, -0.012),
        contactPhone: '+8802988776657',
        metadata: { waitTimeMins: 30 },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'উন্মেদ কমিউনিটি ক্লিনিক (গুলশান)',
        description: 'প্রসব পূর্ববর্তী যত্ন, শিশু স্বাস্থ্য ও ডায়াবেটিস শিক্ষা।',
        address: 'গুলশান ১, ঢাকা',
        ...p(0.02, 0.012),
        contactPhone: '+8802988776658',
        metadata: { hours: 'সোম–শুক্র ৯টা–৬টা' },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'মহাখালী জেনারেল হাসপাতাল — জরুরি বিভাগ',
        description: 'জরুরি সেবা ও ট্রমা ফার্স্ট রেসপন্স।',
        address: 'মহাখালী, ঢাকা',
        ...p(0.015, 0.008),
        contactPhone: '+8802988776659',
        metadata: { category: 'urgent' },
        ownerId: bizHealth.id,
      },
      {
        type: ListingType.CLINIC,
        title: 'ল্যাবজেড হেলথ — উত্তরা ব্রাঞ্চ',
        description: 'ফ্যামিলি মেডিসিন ও হেলথ চেকআপ প্যাকেজ।',
        address: 'উত্তরা সেক্টর ৪, ঢাকা',
        ...p(0.032, -0.014),
        contactPhone: '+8802988776660',
        metadata: { delivery: false },
        ownerId: bizHealth.id,
      },

      // ——— ফার্মেসি ———
      {
        type: ListingType.PHARMACY,
        title: 'ল্যাব এইড ফার্মেসি — পanthaPath',
        description: 'প্রেসক্রিপশন, OTC ও টিকা অ্যাপয়েন্টমেন্ট।',
        address: 'পanthaPath, ঢাকা',
        ...p(0.01, -0.008),
        contactPhone: '+8802988777701',
        metadata: { delivery: true, open247: false },
        ownerId: bizPharma.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'অক্সিজেন ফার্মেসি — ধানমন্ডি',
        description: 'রাত ১২টা পর্যন্ত খোলা; হোম ডেলিভারি ঢাকা মেট্রো।',
        address: 'ধানমন্ডি ৩২, ঢাকা',
        ...p(0.007, -0.02),
        contactPhone: '+8802988777702',
        metadata: { delivery: true },
        ownerId: bizPharma.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'সুপারশপ ফার্মেসি — বনানী',
        description: 'ট্রাভেল ভ্যাকসিন ও কম্পাউন্ডিং।',
        address: 'বনানী ১১, ঢাকা',
        ...p(0.018, 0.016),
        contactPhone: '+8802988777703',
        metadata: { delivery: false },
        ownerId: bizPharma.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'হেলথকেয়ার ফার্মেসি — মিরপুর',
        description: '২৪/৭ উইন্ডো; জরুরি ওষুধ স্টক।',
        address: 'মিরপুর ২, ঢাকা',
        ...p(-0.016, -0.02),
        contactPhone: '+8802988777704',
        metadata: { open247: true },
        ownerId: bizPharma.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'মেডিনোভা ফার্মেসি — উত্তরা',
        description: 'ক্রনিক কেয়ার রিফিল ও ইন্সুলিন কুল চেইন।',
        address: 'উত্তরা সেক্টর ১৩, ঢাকা',
        ...p(0.038, -0.02),
        contactPhone: '+8802988777705',
        metadata: { delivery: true },
        ownerId: bizPharma.id,
      },
      {
        type: ListingType.PHARMACY,
        title: 'লাইফ লাইন ফার্মেসি — মোহাম্মদপুর',
        description: 'জেনেরিক ও ব্র্যান্ডেড ওষুধ; ক্যাশলেস পার্টনারশিপ।',
        address: 'মোহাম্মদপুর বাস স্ট্যান্ড, ঢাকা',
        ...p(-0.01, -0.022),
        contactPhone: '+8802988777706',
        metadata: { delivery: true },
        ownerId: bizPharma.id,
      },

      // ——— চাকরি ———
      {
        type: ListingType.JOB,
        title: 'স্টাফ নার্স — নাইট শিফট (ICU স্টেপ-ডাউন)',
        description:
          'বেসরকারি হাসপাতাল; ২ বছরের অভিজ্ঞতা; BNC রেজিস্ট্রেশন বাধ্যতামূলক। সাইনিং বোনাস।',
        address: 'গুলশান, ঢাকা',
        ...p(0.019, 0.014),
        contactEmail: 'nurse@jobsbd.demo',
        metadata: {
          salaryRange: '৳৪৫,০০০–৳৬৫,০০০',
          shift: 'night',
          license: 'RN',
        },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'মেডিকেল ল্যাব টেকনিশিয়ান (MLT)',
        description: 'আউটপেশেন্ট ল্যাব; দিনের শিফট; সার্টিফিকেট MLT।',
        address: 'ধানমন্ডি, ঢাকা',
        ...p(0.005, -0.011),
        contactEmail: 'lab@jobsbd.demo',
        metadata: { salaryRange: '৳২৮,০০০–৳৩৮,০০০', license: 'MLT' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'কমিউনিটি হেলথ ড্রাইভার',
        description: 'ক্লিনিকগুলোর মধ্যে সরঞ্জাম ও নমুনা পরিবহন; লাইসেন্স ড্রাইভার অগ্রাধিকার।',
        address: 'ঢাকা মেট্রো রুট',
        ...p(0.002, 0.018),
        contactEmail: 'fleet@jobsbd.demo',
        metadata: { salaryRange: '৳২২,০০০–৳২৮,০০০', type: 'full-time' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'ফার্মেসি টেকনিশিয়ান',
        description: 'চেইন ফার্মেসিতে ওষুধ ডিসপেন্স ও ইনভেন্টরি।',
        address: 'বনানী, ঢাকা',
        ...p(0.016, 0.02),
        contactEmail: 'pharma@jobsbd.demo',
        metadata: { salaryRange: '৳১৮,০০০–৳২৫,০০০' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'জুনিয়র ফুলস্ট্যাক ডেভেলপার (React + Nest)',
        description: 'হেলথ টেক স্টার্টআপ; রিমোট হাইব্রিড ঢাকা।',
        address: 'বসুন্ধরা সিটি এরিয়া, ঢাকা',
        ...p(0.025, 0.01),
        contactEmail: 'dev@jobsbd.demo',
        metadata: { salaryRange: '৳৪০,০০০–৳৭০,০০০', type: 'full-time' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'ডাটা এন্ট্রি অপারেটর (পার্ট টাইম)',
        description: 'স্বাস্থ্য ক্যাম্পের রেকর্ড ডিজিটাইজেশন; ঘণ্টায় ভিত্তিক।',
        address: 'মিরপুর, ঢাকা',
        ...p(-0.015, -0.016),
        contactEmail: 'data@jobsbd.demo',
        metadata: { salaryRange: '৳৮,০০০–৳১২,০০০/মাস', type: 'part-time' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'হোম কেয়ার নার্সিং অ্যাসিস্ট্যান্ট',
        description: 'বয়স্ক রোগীর বাড়িতে সেবা; প্রশিক্ষণ দেওয়া হবে।',
        address: 'উত্তরা, ঢাকা',
        ...p(0.034, -0.012),
        contactEmail: 'homecare@jobsbd.demo',
        metadata: { salaryRange: '৳১৫,০০০–৳২২,০০০' },
        ownerId: bizJobs.id,
      },
      {
        type: ListingType.JOB,
        title: 'মেডিকেল রিসিপশনিস্ট / ফ্রন্ট ডেস্ক',
        description: 'ইংরেজি-বাংলা দক্ষতা; EMR সফটওয়্যার ট্রেনিং।',
        address: 'মহাখালী, ঢাকা',
        ...p(0.014, 0.006),
        contactEmail: 'frontdesk@jobsbd.demo',
        metadata: { salaryRange: '৳১৪,০০০–৳২০,০০০' },
        ownerId: bizJobs.id,
      },

      // ——— শিক্ষক ———
      {
        type: ListingType.TEACHER,
        title: 'মিসেস ফারহানা — এসএসসি/এইচএসসি রসায়ন',
        description: '১২ বছরের শ্রেণিকক্ষ অভিজ্ঞতা; ছোট গ্রুপ ও অনলাইন।',
        address: 'ধানমন্ডি + অনলাইন',
        ...p(0.006, -0.013),
        contactEmail: 'chemistry@pathshala.demo',
        metadata: { subjects: ['রসায়ন', 'পদার্থ'], rateBdt: 800 },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'মি. রাফি — গণিত ও আইবি প্রস্তুতি',
        description: 'আইবি ও এপি ম্যাথ; পরীক্ষার মডেল টেস্ট।',
        address: 'গুলশান + অনলাইন',
        ...p(0.021, 0.011),
        contactPhone: '+8801711004401',
        metadata: { subjects: ['গণিত', 'পরিসংখ্যান'], rateBdt: 1200 },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'ড. নাজিয়া — ইংরেজি ও আইএলটস',
        description: 'বিশ্ববিদ্যালয় শিক্ষক; সন্ধ্যা কোহর্ট।',
        address: 'বনানী লার্নিং হাব',
        ...p(0.017, 0.019),
        contactEmail: 'ielts@pathshala.demo',
        metadata: { subjects: ['ইংরেজি', 'IELTS'], cohort: 'evening' },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'মি. সাকিব — প্রোগ্রামিং (Python, Web)',
        description: 'বুটক্যাম্প স্টাইল; প্রজেক্ট ভিত্তিক।',
        address: 'উত্তরা টেক হাব',
        ...p(0.036, -0.016),
        contactPhone: '+8801711004402',
        metadata: { subjects: ['Python', 'Web'], rateBdt: 1500 },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'মিসেস শর্মিলা — বায়োলজি (মেডিকেল এন্ট্রান্স)',
        description: 'মেডিকেল ভর্তি পরীক্ষার জন্য কনসেপ্ট + MCQ।',
        address: 'মিরপুর',
        ...p(-0.017, -0.014),
        contactEmail: 'bio@pathshala.demo',
        metadata: { subjects: ['জীববিজ্ঞান'], rateBdt: 900 },
        ownerId: bizEdu.id,
      },
      {
        type: ListingType.TEACHER,
        title: 'মি. তানভীর — BCS ও সরকারি চাকরি প্রস্তুতি',
        description: 'বাংলা, ইংরেজি, সাধারণ জ্ঞান মডিউল।',
        address: 'মোহাম্মদপুর কোচিং সেন্টার',
        ...p(-0.011, -0.019),
        contactPhone: '+8801711004403',
        metadata: { subjects: ['BCS', 'GK'], cohort: 'morning' },
        ownerId: bizEdu.id,
      },

      // ——— লাইফলিংক নিউজ ডেস্ক (NEWS) ———
      {
        type: ListingType.NEWS,
        title: 'ঢাকায় শীতকালীন রক্তদান ক্যাম্প — রেকর্ড অংশগ্রহণ',
        description:
          'গত সপ্তাহে তিনটি জোনে আয়োজিত ক্যাম্পে হাজারের বেশি ইউনিট সংগ্রহ; হাসপাতালগুলোতে প্লাটিলেট চাহিদা কমেছে বলে জানিয়েছে স্বাস্থ্য অধিদপ্তর।',
        address: 'স্বাস্থ্য ভবন, ঢাকা',
        ...p(0.003, 0.004),
        metadata: { category: 'রক্ত', readingMins: 4 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'ফার্মেসি চেইন ও হোম ডেলিভারি — নতুন নির্দেশিকা খসড়া',
        description:
          'ঔষধ বিতরণে ডিজিটাল প্রেসক্রিপশন যাচাই ও কুল চেইন মেনে চলার বিষয়ে খসড়া নির্দেশিকা জনমতের জন্য প্রকাশ।',
        address: 'ঔষধ প্রশাসন অধিদপ্তর',
        ...p(0.004, -0.005),
        metadata: { category: 'নীতি', readingMins: 5 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'স্কুলজুড়ে ফ্রি ফ্লু শট — পাইলট শুরু ঢাকা উত্তরে',
        description:
          'নির্বাচিত স্কুলে ওয়াক-ইন ইমিউনাইজেশন সপ্তাহ; অভিভাবক সম্মতি ফর্ম অনলাইন।',
        address: 'সিটি কর্পোরেশন, উত্তর',
        ...p(0.03, -0.01),
        metadata: { category: 'স্বাস্থ্য', readingMins: 3 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'মহাখালী–এয়ারপোর্ট রুটে অ্যাম্বুলেন্স লেন — ট্রায়াল',
        description:
          'জরুরি রোগী পরিবহনের জন্য নির্দিষ্ট সময়ে ডেডিকেটেড লেন চালু; ট্রাফিক পুলিশের সাথে সমন্বয়।',
        address: 'ঢাকা ট্রাফিক পুলিশ',
        ...p(0.013, 0.009),
        metadata: { category: 'ট্রান্সপোর্ট', readingMins: 4 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'কমিউনিটি ক্লিনিকে ডায়াবেটিস স্ক্রিনিং — ১০ হাজার রোগী',
        description:
          'লাইফলিংক অংশীদার ক্লিনিকগুলোতে তিন মাসে রেকর্ড সংখ্যক স্ক্রিনিং; রেফারেল হার ১২%।',
        address: 'সমাজসেবা অঙ্গন, ঢাকা',
        ...p(-0.008, 0.011),
        metadata: { category: 'স্বাস্থ্য', readingMins: 3 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'নার্স নিয়োগ মেলা — আগামী শুক্রবার বসুন্ধরা',
        description:
          '১৫+ হাসপাতাল ও ডায়াগনostic চেইন এক ছাদের নিচে ইন্টারভিউ স্লট; রেজিস্ট্রেশন লাইফলিংক ড্যাশবোর্ড।',
        address: 'বসুন্ধরা আন্তর্জাতিক সম্মেলন কেন্দ্র',
        ...p(0.026, 0.018),
        metadata: { category: 'চাকরি', readingMins: 2 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'শিক্ষক নিবন্ধন — যাচাই ব্যাজ পাইলট শুরু',
        description:
          'পাঠশালা একাডেমিসহ অংশীদার প্রতিষ্ঠানে শিক্ষক প্রোফাইল যাচাই ব্যাজ; অভিভাবকদের জন্য রিভিউ সিস্টেম।',
        address: 'লাইফলিংক প্ল্যাটফর্ম নোটিশ',
        ...p(0.001, -0.003),
        metadata: { category: 'শিক্ষা', readingMins: 3 },
        ownerId: bizNews.id,
      },
      {
        type: ListingType.NEWS,
        title: 'মিরপুরে মোবাইল ব্লাড ডোনেশন ভ্যান — সাপ্তাহিক রুট',
        description:
          'শনিবার সকালে নির্দিষ্ট পয়েন্টে ভ্যান; অ্যাপয়েন্টমেন্ট লিংক সোশ্যাল মিডিয়ায় প্রকাশ।',
        address: 'মিরপুর ১০',
        ...p(-0.019, -0.022),
        metadata: { category: 'রক্ত', readingMins: 2 },
        ownerId: bizNews.id,
      },
    ],
  });

  await prisma.feedPost.createMany({
    data: [
      {
        authorId: userAlice.id,
        title: 'আজকের রক্তদান ক্যাম্পে যোগ দিলে কী হবে?',
        content:
          'প্রথমবার গেলে রেজিস্ট্রেশন ও স্ক্রিনিং নিয়ে ভয় পাবেন না — স্বেচ্ছাসেবকরা সব ধাপ বুঝিয়ে দেন। আমার অভিজ্ঞতা: গুলশান কমিউনিটি সেন্টারে লাইন ছিল, তবে ৪০ মিনিটের মধ্যে শেষ।',
      },
      {
        authorId: userBob.id,
        content:
          'রেডিট-স্টাইল টিপ: চাকরির পোস্টে ঠিকানা ও BNC নম্বর একসাথে দিলে রিক্রুটাররা দ্রুত ফিল্টার করতে পারে। লাইফলিংকে টেমপ্লেট বানিয়ে রাখুন।',
      },
      {
        authorId: userCharlie.id,
        title: 'ফার্মেসি খোঁজার সময় যা দেখি',
        content:
          'রাতে জরুরি ওষুধের জন্য ২৪/৭ ট্যাগ থাকলে মানচিত্রে সবুজ বেশি দেখা যায়। ক্লোজড হলে রিভিউতে সময় লিখে দিন — পরের জন সহজ হয়।',
      },
    ],
  });

  const count = await prisma.listing.count();
  // eslint-disable-next-line no-console
  console.log(
    `Seed complete: ${count} listings (ঢাকা-কেন্দ্রিক). সব অ্যাকাউন্টের ডেমো পাসওয়ার্ড: lifelink-demo`,
  );
  // eslint-disable-next-line no-console
  console.log(
    'ডেমো ইউজার: alice, bob, charlie, dana, eti @demo.lifelink + ব্যবসায়ী অ্যাকাউন্ট।',
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
