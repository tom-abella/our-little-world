// Edit unlock dates, captions and photo paths to make this yours.
// Set UNLOCK_ALL_STAGES to true to preview locked months early.
export const UNLOCK_ALL_STAGES = false;

export const STAGES = [
  {
    id: 0,
    title: "Prologue: Before It All",
    gateLabel: "Prologue",
    unlockDate: "2026-11-02",
    unlockedOverride: true,
    theme: "greenfield",
    memories: [
      {
        id: "mem-0-1",
        title: "Walking in Greenfield",
        date: "Before November 2026",
        location: "Greenfield, Pasay",
        caption:
          "Dumating sa point na gusto mo na ako tumigil at patigilin na napunta sa dun pala mag sisimula ang lahat. I know, at sa paglalakad natin din kita mas lalong nakilala.",
        imageUrl: "/images/prologue-photo1.jpg",
        x: 480,
        y: 310,
      },
      {
        id: "mem-0-2",
        title: "Coffee Date",
        date: "Before November 2026",
        location: "Starbucks near your condo",
        caption:
          "There are so many coffee dates ang napuntahan natin and it became a part na ng routine natin na after kumain nag kakape.",
        imageUrl: "/images/prologue-photo2.jpg",
        landmark: "cafe",
        x: 190,
        y: 220,
      },
      {
        id: "mem-0-3",
        title: "Cinema Date",
        date: "Before November 2026",
        location: "The cinema",
        caption:
          "Madalas horror movies ang pinapanood natin kasi hindi ka pala mahilig manood ng marvels but we both enjoyed the experience kasi madalas kang nagugulat at natatakot hahaha.",
        imageUrl: "/images/prologue-photo3.jpg",
        landmark: "cinema",
        x: 380,
        y: 220,
      },
      {
        id: "mem-0-4",
        title: "Samgyupsal Date",
        date: "Before November 2026",
        location: "Soban K-Town Grill in Mega Mall",
        caption:
          "We eat at your favorite samgyupsal place. Kahit na may iba kang memories na kumain dun, Happy pa rin ako kasi this time ako na ang kasama mo and we even call pa si Dad mo para asarin ng 'Nagkaon kana lab? sabay pakita sakin. Haha.",
        imageUrl: "/images/prologue-photo4.jpg",
        landmark: "samgyupsal",
        x: 300,
        y: 460,
      },
      {
        id: "mem-0-5",
        title: "Asking Your Bestfriend for Advice",
        date: "Before November 2026",
        location: "Over text",
        caption:
          "Before we were official, I messaged your bestfriend to ask for advice. I wanted to know what you liked, what made you laugh, and how not to mess things up. She told me to stop overthinking and just be myself. I still have the screenshots — best advice I ever got.",
        imageUrl: "/images/prologue-phone.svg",
        landmark: "phone",
        x: 450,
        y: 450,
      },
      {
        id: "mem-0-6",
        title: "Meeting Mark for the First Time",
        date: "Before November 2026",
        location: "Greenfield park path, Pasay",
        caption:
          "Happy ako na nag meet na kayo ni mark at dumating sa point na napaopen up na sya satin na para bang ang tagal tagal nyo na magkakilala hahaha. ",
        imageUrl: "/images/prologue-photo6.jpg",
        landmark: "sidewalk",
        x: 620,
        y: 356,
      },
      {
        id: "mem-0-7",
        title: "Movie Night at the Airbnb",
        date: "Before November 2026",
        location: "The Airbnb",
        caption:
          "Actually, hindi ko talaga expected na dadating tayo sa point na mag aairbnb para manood lang ng movie, ito pa yung after natin manood tru google meet and decided the next is magkasama na. We watch movies, watch documentaries, and many more. Dumating pa sa point na almost every week tapos diretso pasok nalang kinabukasan hahaha.",
        imageUrl: "/images/prologue-photo7.jpg",
        landmark: "apartment",
        x: 800,
        y: 220,
      },
      {
        id: "mem-0-8",
        title: "Holding Hands after away?",
        date: "Before November 2026",
        location: "After long walk in greenfield",
        caption:
          "Ito yung time na sinulit ko na talaga na kasama kita at ayaw ko na bitawan yung kamay mo kasi natatakot ako na baka last na yun. But after this, palagi na tayong may ganitong moments hahaha.",
        imageUrl: "/images/prologue-photo8.jpg",
        x: 600,
        y: 460,
      },
    ],
  },
  {
    id: 1,
    title: "Month 1: Where It Started",
    unlockDate: "2026-12-02",
    // Opened early for now. Remove this line to restore the Dec 2 monthsary lock.
    unlockedOverride: true,
    theme: "baguio",
    memories: [
      {
        id: "mem-1-flowers",
        title: "Flowers for Each Other",
        date: "November 2026",
        location: "Our first month",
        caption:
          "Binigyan kita ng purple tulips, tapos binigyan mo rin ako ng blue flower. First time kong makatanggap ng flower, babe, at ang saya ko na sayo pa nanggaling. Thank you kasi pinaramdam mo na special din ako. Hindi ko makakalimutan itong exchange natin.",
        imageUrl: "/images/month1-flowers.svg",
        x: 1040,
        y: 490,
      },
      {
        id: "mem-1-1",
        title: "First Baguio Trip",
        date: "November 2026",
        location: "Baguio, Philippines",
        caption:
          "First travel at vacation natin together. Ang saya lang na kasama kita sa Baguio—sa mahabang biyahe, malamig na hangin, at mga lakad natin. Kahit saan pa tayo mapunta, basta kasama kita babe, masaya na ako.",
        imageUrl: "/images/month1-photo1.jpg",
        landmark: "sign",
        x: 230,
        y: 300,
      },
      {
        id: "mem-1-2",
        title: "First Date as a Couple",
        date: "November 2026",
        location: "Somewhere in Pasay",
        caption:
          "First date natin as a couple. Hindi na lang kita nililigawan—tayo na talaga. Ang saya lang isipin na yung mga dating lakad natin, may kasunod na bagong memories bilang tayo.",
        imageUrl: "/images/month1-photo2.jpg",
        x: 780,
        y: 290,
      },
      {
        id: "mem-1-3",
        title: "First Photobooth",
        date: "November 2026",
        location: "A photobooth",
        caption:
          "First photobooth natin together. Ang cute lang na may ganito tayong remembrance ng first month natin. Kahit ano pang pose natin, ang saya kong makita na magkatabi tayo sa pictures.",
        imageUrl: "/images/month1-photo3.jpg",
        landmark: "photobooth",
        x: 400,
        y: 390,
      },
      {
        id: "mem-1-4",
        title: "First Coffee Date as a Couple",
        date: "November 2026",
        location: "A café",
        caption:
          "Dati nagkakape na tayo together, pero ito, official na tayong magkasama. Same na coffee date, pero iba pala sa feeling kapag girlfriend na kita. More kape at kwentuhan pa with you, babe.",
        imageUrl: "/images/month1-photo4.jpg",
        landmark: "cafe",
        x: 600,
        y: 220,
      },
      {
        id: "mem-1-5",
        title: "First Sundo at Your Work",
        date: "November 2026",
        location: "Studio iKwaMe",
        caption:
          "First time kitang sunduin sa Studio iKwaMe. Ang saya lang na pagkatapos ng work mo, ako yung makakasama mo pauwi sa Sheriden. Simpleng sundo lang, pero special sakin kasi ikaw yung sinusundo ko.",
        imageUrl: "/images/month1-photo5.jpg",
        x: 1165,
        y: 220,
      },
      {
        id: "mem-1-6",
        title: "Magkasama for Almost Two Weeks",
        date: "November 2026",
        location: "Everywhere, for a while",
        caption:
          "Halos two weeks tayong magkasama, babe. Ang saya na mas marami tayong time para makilala pa ang isa’t isa at gumawa ng memories together. Nasanay akong kasama ka, kaya syempre gusto ko pa ng mas marami pang araw na ganito.",
        imageUrl: "/images/month1-photo6.jpg",
        x: 650,
        y: 430,
      },
      {
        id: "mem-1-facetime",
        title: "Our FaceTime Calls",
        date: "November 2026",
        location: "FaceTime",
        caption: "Kapag hindi tayo magkasama, buti na lang may FaceTime. Kahit sa screen lang muna kita makita, masaya na ako. Iba pa rin kapag katabi kita, pero habang hindi pa pwede, dito muna tayo magkukwentuhan, babe.",
        imageUrl: "/images/month1-facetime.jpg",
        landmark: "videocall",
        x: 980,
        y: 395,
      },
    ],
  },
  {
    id: 2,
    title: "Month 2: Little Adventures",
    unlockDate: "2027-01-02",
    theme: "park",
    memories: [
      {
        id: "mem-2-1",
        title: "Swing Set Rivals",
        date: "December 2, 2026",
        location: "Riverside Park",
        caption:
          "You said you could swing higher. You were right. I have chosen to be gracious about it, because I am a gracious man.",
        imageUrl: "/images/month2-photo1.jpg",
        x: 200,
        y: 260,
      },
      {
        id: "mem-2-2",
        title: "Duck Diplomacy",
        date: "December 2, 2026",
        location: "The Pond",
        caption:
          "We came with half a loaf of bread and left with eight new friends. One of them was definitely plotting something.",
        imageUrl: "/images/month2-photo2.jpg",
        x: 660,
        y: 450,
      },
      {
        id: "mem-2-3",
        title: "The Good Bench",
        date: "December 2, 2026",
        location: "Riverside Park",
        caption:
          "There is a bench with the exact right view of the water. We found it by accident and now it is ours. Please do not tell anyone about it.",
        imageUrl: "/images/month2-photo3.jpg",
        x: 470,
        y: 250,
      },
      {
        id: "mem-2-4",
        title: "Golden Hour",
        date: "December 2, 2026",
        location: "South Lawn",
        caption:
          "You took a photo of me squinting into the sun. It is objectively terrible. It might be my favourite photo of myself.",
        imageUrl: "/images/month2-photo4.jpg",
        x: 360,
        y: 470,
      },
    ],
  },
  {
    id: 3,
    title: "Month 3: Night Drive",
    unlockDate: "2027-02-02",
    theme: "night",
    memories: [
      {
        id: "mem-3-1",
        title: "Engine Idle",
        date: "January 2, 2027",
        location: "Maple Street",
        caption:
          "We sat in the car outside my place for twenty minutes with the engine running and the radio low, inventing reasons not to say goodnight.",
        imageUrl: "/images/month3-photo1.jpg",
        x: 220,
        y: 320,
      },
      {
        id: "mem-3-2",
        title: "City Lights",
        date: "January 2, 2027",
        location: "Hilltop Overlook",
        caption:
          "You said the city looked small from up there. I said everything looks small except this. You laughed and I felt very clever for about a week.",
        imageUrl: "/images/month3-photo2.jpg",
        x: 480,
        y: 170,
      },
      {
        id: "mem-3-3",
        title: "One More Song",
        date: "January 2, 2027",
        location: "The Long Road Home",
        caption:
          "The last song finished right as we pulled up. We stayed for the silence. Then you played it again.",
        imageUrl: "/images/month3-photo3.jpg",
        x: 760,
        y: 300,
      },
    ],
  },
];

export function isStageUnlocked(stage) {
  return (
    UNLOCK_ALL_STAGES ||
    stage.unlockedOverride === true ||
    new Date() >= new Date(`${stage.unlockDate}T00:00:00`)
  );
}

export function formatUnlockDate(unlockDate) {
  return new Date(`${unlockDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
