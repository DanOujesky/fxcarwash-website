import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: "asc" } });

  if (news.length === 0) {
    console.log("Žádné novinky v databázi.");
    return;
  }

  const timestamps = news.map((n) => n.createdAt);
  const reversed = [...timestamps].reverse();

  for (let i = 0; i < news.length; i++) {
    await prisma.news.update({
      where: { id: news[i].id },
      data: { createdAt: reversed[i] },
    });
    console.log(`${news[i].title} → ${reversed[i].toISOString()}`);
  }

  console.log("Hotovo — pořadí novinky bylo otočeno.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
