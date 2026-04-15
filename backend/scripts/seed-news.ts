import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const newsData = [
  {
    title: "Zahájení výstavby mycího centra",
    text: "Projekt výstavby mycího centra v Horní Bříze začal v průběhu roku 2024, kdy jsme se intenzivně věnovali výběru kvalitního a spolehlivého partnera pro realizaci výstavby. Tímto partnerem se pro nás stala společnost MY WASH Technology s.r.o. Stavební práce přímo na místě začaly v létě 2025 a již koncem srpna se podařilo dokončit a kompletně připravit základy. Už to pro Vás chystáme!",
    imagePath: JSON.stringify(["car-news-image-2.jpg", "car-news-image-1.jpg"]),
  },
  {
    title: "Práce finišují. Plán dokončení: prosinec 2025",
    text: "Vše běží dle plánu a v prosinci 2025 bychom měli mít kompletně hotovo. Čeká nás dodávka samotné konstrukce mycího centra a její napojení na sítě. Finalizujeme také úpravy okolí, které bychom Vám rádi zpříjemnili. O termínu otevření Vás budeme brzy informovat.",
    imagePath: JSON.stringify(["IMG_2523.jpg", "image_3.jpg", "image_1.jpg", "image_2.jpg", "image_5.jpg"]),
  },
  {
    title: "Otevření se blíží",
    text: "Už finišujeme, ladíme poslední detaily a testujeme kvalitu mytí pro 100% spokojenost našich budoucích zákazníků. Předběžný termín otevření mycího centra je 17.12.2025.",
    imagePath: JSON.stringify(["Image-10.jpg", "Image-12.jpg", "Image-16.jpg", "Image-13.jpg", "Image-15.jpg"]),
  },
  {
    title: "Máme otevřeno!",
    text: "Po týdnu zkušebního provozu máme otevřeno pro všechny zákazníky nonstop. Můžete u nás platit v hotovosti i platební kartou. Mycí centrum je vybaveno měničkou peněz. K dispozici je výkonný vysavač a možnost doplnění nemrznoucí směsi do ostřikovačů ( -20 °C).",
    imagePath: JSON.stringify(["IMG_3217.jpg", "IMG_3167.jpg", "IMG_3250.jpg", "IMG_3184.jpg", "IMG_3174.jpg"]),
  },
  {
    title: "Online nákup a dobití fx karet",
    text: "Již brzy pro vás spustíme možnost nakoupit si online zvýhodněné věrnostní fx karty.",
    imagePath: JSON.stringify(["1776272729683-y1h4pjp964h.JPG", "1776272729706-rd6pc4kpojn.JPG"]),
  },
  {
    title: "Slavnostní otevření mycího centra v sobotu 18.4.2026 od 10 hodin",
    text: "Přijeďte se k nám podívat, klobásy z grilu a nápoje zdarma pro všechny zákazníky do vyčerpání zásob. Rádi se s vámi setkáme osobně. Těšíme se na vás!",
    imagePath: JSON.stringify(["1776272938327-5v7bcag6ntk.JPG", "1776272975127-3vkfliyaau5.JPG"]),
  },
];

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.error("Žádný admin uživatel nenalezen v databázi!");
    process.exit(1);
  }
  console.log(`Používám admin účet: ${admin.email}`);

  const existing = await prisma.news.count();
  if (existing > 0) {
    console.log(`V databázi již existuje ${existing} novinek, přeskakuji.`);
    process.exit(0);
  }

  for (const item of newsData) {
    await prisma.news.create({
      data: { ...item, creatorId: admin.id },
    });
    console.log(`Vytvořeno: ${item.title}`);
  }

  console.log("Hotovo!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
