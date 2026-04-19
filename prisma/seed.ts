import { ListingType, ProductCategory, PrismaClient, Role } from '@prisma/client';
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

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
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

  // ——— Essential Things: E-Commerce Shops ———

  const bizGrocery = await prisma.user.create({
    data: {
      email: 'agora@demo.lifelink',
      passwordHash,
      name: 'আগোরা সুপারশপ',
      phone: '+8801711000800',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'আগোরা সুপারশপ',
          description: 'দৈনন্দিন মুদি, তাজা শাক-সবজি ও গৃহস্থালি পণ্য।',
          verified: true,
        },
      },
    },
  });

  const bizTech = await prisma.user.create({
    data: {
      email: 'startech@demo.lifelink',
      passwordHash,
      name: 'স্টারটেক ইলেকট্রনিক্স',
      phone: '+8801711000801',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'স্টারটেক ইলেকট্রনিক্স',
          description: 'ল্যাপটপ, মোবাইল, গ্যাজেট ও এক্সেসরিজ।',
          verified: true,
        },
      },
    },
  });

  const bizClothing = await prisma.user.create({
    data: {
      email: 'aarong@demo.lifelink',
      passwordHash,
      name: 'আড়ং ফ্যাশন',
      phone: '+8801711000802',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'আড়ং ফ্যাশন',
          description: 'বাংলাদেশি ঐতিহ্যবাহী ও আধুনিক পোশাক।',
          verified: true,
        },
      },
    },
  });

  const bizBooks = await prisma.user.create({
    data: {
      email: 'rokomari@demo.lifelink',
      passwordHash,
      name: 'রকমারি বুকশপ',
      phone: '+8801711000803',
      role: Role.BUSINESS,
      businessProfile: {
        create: {
          organizationName: 'রকমারি বুকশপ',
          description: 'বাংলা ও ইংরেজি বই, স্টেশনারি ও শিক্ষা উপকরণ।',
          verified: true,
        },
      },
    },
  });

  await prisma.product.createMany({
    data: [
      // ——— মুদি / Grocery ———
      {
        name: 'মিনিকেট চাল ৫ কেজি',
        description: 'সরু দানা, সুগন্ধি মিনিকেট। পারিবারিক প্যাক।',
        price: 420,
        unit: 'packet',
        category: ProductCategory.GROCERY,
        stock: 150,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        sellerId: bizGrocery.id,
      },
      {
        name: 'সয়াবিন তেল ৫ লিটার',
        description: 'ফ্রেশ সয়াবিন তেল — রান্নার জন্য আদর্শ।',
        price: 780,
        unit: 'bottle',
        category: ProductCategory.GROCERY,
        stock: 80,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7f28b8a9e4f0?w=400&h=400&fit=crop',
        sellerId: bizGrocery.id,
      },
      {
        name: 'লাল চা (BOP) ৪০০ গ্রাম',
        description: 'ইস্পাহানি মিক্সড টি — সকালের এক কাপ তাজা চা।',
        price: 290,
        unit: 'packet',
        category: ProductCategory.GROCERY,
        stock: 200,
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
        sellerId: bizGrocery.id,
      },
      {
        name: 'ডিম (১২ পিস)',
        description: 'দেশি মুরগির ডিম — তাজা ফার্ম থেকে সরাসরি।',
        price: 180,
        unit: 'dozen',
        category: ProductCategory.GROCERY,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
        sellerId: bizGrocery.id,
      },
      {
        name: 'পেঁয়াজ ২ কেজি',
        description: 'দেশি পেঁয়াজ — পরিষ্কার ও শুকনো।',
        price: 120,
        unit: 'kg',
        category: ProductCategory.GROCERY,
        stock: 300,
        imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop',
        sellerId: bizGrocery.id,
      },
      {
        name: 'চিনি ১ কেজি',
        description: 'সাদা পরিশোধিত চিনি।',
        price: 125,
        unit: 'kg',
        category: ProductCategory.GROCERY,
        stock: 250,
        sellerId: bizGrocery.id,
      },

      // ——— ইলেকট্রনিক্স / Electronics ———
      {
        name: 'ওয়্যারলেস ইয়ারবাড (TWS)',
        description: 'ব্লুটুথ ৫.৩, নয়েজ ক্যান্সেলিং, ৩০ ঘণ্টা ব্যাটারি।',
        price: 1850,
        unit: 'piece',
        category: ProductCategory.ELECTRONICS,
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop',
        sellerId: bizTech.id,
      },
      {
        name: '১০,০০০ mAh পাওয়ারব্যাংক',
        description: 'ডুয়াল USB আউটপুট, ফাস্ট চার্জ সাপোর্ট, LED ইন্ডিকেটর।',
        price: 1200,
        unit: 'piece',
        category: ProductCategory.ELECTRONICS,
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
        sellerId: bizTech.id,
      },
      {
        name: 'USB-C হাব ৭-in-১',
        description: 'HDMI, USB 3.0, SD কার্ড রিডার, PD চার্জিং।',
        price: 2400,
        unit: 'piece',
        category: ProductCategory.ELECTRONICS,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1625723044792-44de16be1cce?w=400&h=400&fit=crop',
        sellerId: bizTech.id,
      },
      {
        name: 'মেকানিক্যাল কীবোর্ড (RGB)',
        description: 'ব্লু সুইচ, ফুল সাইজ, USB + ব্লুটুথ।',
        price: 3500,
        unit: 'piece',
        category: ProductCategory.ELECTRONICS,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop',
        sellerId: bizTech.id,
      },
      {
        name: 'ওয়েবক্যাম HD 1080p',
        description: 'অটো ফোকাস, বিল্ট-ইন মাইক, ক্লিপ মাউন্ট।',
        price: 2200,
        unit: 'piece',
        category: ProductCategory.ELECTRONICS,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop',
        sellerId: bizTech.id,
      },

      // ——— পোশাক / Clothing ———
      {
        name: 'পাঞ্জাবি — সাদা কটন (পুরুষ)',
        description: 'হাতে বোনা সুতি — ঈদ ও উৎসবে মানানসই।',
        price: 1650,
        unit: 'piece',
        category: ProductCategory.CLOTHING,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
        sellerId: bizClothing.id,
      },
      {
        name: 'জামদানি শাড়ি (তাঁত)',
        description: 'খাঁটি জামদানি — ঐতিহ্যবাহী মসলিন বুনন।',
        price: 4500,
        unit: 'piece',
        category: ProductCategory.CLOTHING,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
        sellerId: bizClothing.id,
      },
      {
        name: 'ক্যাজুয়াল টি-শার্ট (ইউনিসেক্স)',
        description: 'সফট কটন, ৪ রঙে পাওয়া যায়। M/L/XL সাইজ।',
        price: 450,
        unit: 'piece',
        category: ProductCategory.CLOTHING,
        stock: 120,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        sellerId: bizClothing.id,
      },
      {
        name: 'ডেনিম জিন্স (স্লিম ফিট)',
        description: 'স্ট্রেচ ডেনিম, গাঢ় নীল — ২৮-৩৬ ওয়েস্ট।',
        price: 1250,
        unit: 'piece',
        category: ProductCategory.CLOTHING,
        stock: 55,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        sellerId: bizClothing.id,
      },

      // ——— ঔষধ / Medicine ———
      {
        name: 'প্যারাসিটামল ৫০০ মিগ্রা (১০ ট্যাবলেট)',
        description: 'জ্বর ও ব্যথায় — প্রাপ্তবয়স্কদের জন্য।',
        price: 12,
        unit: 'strip',
        category: ProductCategory.MEDICINE,
        stock: 500,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
        sellerId: bizPharma.id,
      },
      {
        name: 'ভিটামিন সি ১০০০ মিগ্রা (৩০ ট্যাবলেট)',
        description: 'রোগ প্রতিরোধ ক্ষমতা বাড়ায়। দিনে ১ ট্যাবলেট।',
        price: 350,
        unit: 'bottle',
        category: ProductCategory.MEDICINE,
        stock: 200,
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop',
        sellerId: bizPharma.id,
      },
      {
        name: 'ফার্স্ট এইড কিট (বেসিক)',
        description: 'ব্যান্ডেজ, গজ, এন্টিসেপ্টিক, কাঁচি — পরিবারের জন্য।',
        price: 650,
        unit: 'kit',
        category: ProductCategory.MEDICINE,
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop',
        sellerId: bizPharma.id,
      },
      {
        name: 'হ্যান্ড স্যানিটাইজার ৫০০ মিলি',
        description: '৭০% অ্যালকোহল বেসড — পাম্প বোতল।',
        price: 180,
        unit: 'bottle',
        category: ProductCategory.MEDICINE,
        stock: 300,
        sellerId: bizPharma.id,
      },

      // ——— বই / Books ———
      {
        name: 'ফেলুদা সমগ্র (হার্ডকভার)',
        description: 'সত্যজিৎ রায় — সব কাহিনী এক খণ্ডে।',
        price: 850,
        unit: 'piece',
        category: ProductCategory.BOOKS,
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
        sellerId: bizBooks.id,
      },
      {
        name: 'প্রোগ্রামিং পাইথন (বাংলা)',
        description: 'শিক্ষানবিশদের জন্য — প্রজেক্ট সহ।',
        price: 420,
        unit: 'piece',
        category: ProductCategory.BOOKS,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
        sellerId: bizBooks.id,
      },
      {
        name: 'IELTS প্রিপারেশন গাইড (2026)',
        description: 'প্র্যাকটিস টেস্ট ও টিপস সহ সম্পূর্ণ গাইড।',
        price: 550,
        unit: 'piece',
        category: ProductCategory.BOOKS,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop',
        sellerId: bizBooks.id,
      },

      // ——— স্টেশনারি / Stationery ———
      {
        name: 'নোটবুক A4 (২০০ পাতা)',
        description: 'সাদা রুলড পেজ — বিশ্ববিদ্যালয় ও অফিস উপযোগী।',
        price: 120,
        unit: 'piece',
        category: ProductCategory.STATIONERY,
        stock: 200,
        imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
        sellerId: bizBooks.id,
      },
      {
        name: 'বলপয়েন্ট কলম সেট (৬ পিস)',
        description: 'নীল ও কালো — মসৃণ লেখা, গ্রিপ ডিজাইন।',
        price: 90,
        unit: 'set',
        category: ProductCategory.STATIONERY,
        stock: 300,
        sellerId: bizBooks.id,
      },

      // ——— ঘর ও রান্না / Home & Kitchen ———
      {
        name: 'স্টেইনলেস স্টিল পানির বোতল (১ লিটার)',
        description: 'ভ্যাকুয়াম ইনসুলেটেড — গরম/ঠান্ডা ১২ ঘণ্টা।',
        price: 550,
        unit: 'piece',
        category: ProductCategory.HOME_KITCHEN,
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        sellerId: bizGrocery.id,
      },
      {
        name: 'নন-স্টিক ফ্রাইং প্যান (২৬ সেমি)',
        description: 'সিরামিক কোটিং, কাঠের হাতল — ইন্ডাকশন সাপোর্ট।',
        price: 890,
        unit: 'piece',
        category: ProductCategory.HOME_KITCHEN,
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        sellerId: bizGrocery.id,
      },

      // ——— সৌন্দর্য / Beauty & Health ———
      {
        name: 'সানস্ক্রিন SPF 50+ (১০০ মিলি)',
        description: 'ওয়াটারপ্রুফ ফর্মুলা — দৈনিক ব্যবহারে নিরাপদ।',
        price: 480,
        unit: 'tube',
        category: ProductCategory.BEAUTY_HEALTH,
        stock: 90,
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
        sellerId: bizPharma.id,
      },
      {
        name: 'নারকেল তেল (ভার্জিন, ২০০ মিলি)',
        description: 'চুল ও ত্বকের যত্নে — কোল্ড প্রেসড।',
        price: 320,
        unit: 'bottle',
        category: ProductCategory.BEAUTY_HEALTH,
        stock: 120,
        sellerId: bizPharma.id,
      },
    ],
  });

  const count = await prisma.listing.count();
  const productCount = await prisma.product.count();
  // eslint-disable-next-line no-console
  console.log(
    `Seed complete: ${count} listings + ${productCount} products (ঢাকা-কেন্দ্রিক). সব অ্যাকাউন্টের ডেমো পাসওয়ার্ড: lifelink-demo`,
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
