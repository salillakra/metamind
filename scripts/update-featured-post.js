import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateFeaturedPost() {
  console.log("Starting featured post update process...");

  try {
    // Reset current featured posts
    await prisma.post.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });

    console.log("Reset current featured posts");

    const candidates = await prisma.post.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [{ createdAt: "desc" }],
      take: 20, 
      include: {
        author: true,
        PostStats: true,
      },
    });

    candidates.sort((a, b) => {
      const aStats = a.PostStats[0] || { views: 0, likes: 0 };
      const bStats = b.PostStats[0] || { views: 0, likes: 0 };

      if (bStats.views !== aStats.views) {
        return bStats.views - aStats.views; // descending
      }

      return bStats.likes - aStats.likes; // descending
    });

    // Take only the top 10 after sorting
    const topCandidates = candidates.slice(0, 10);

    if (topCandidates.length === 0) {
      console.log("No suitable candidates found for featuring");
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * Math.min(topCandidates.length, 5)
    );
    const selectedPost = topCandidates[randomIndex];

    await prisma.post.update({
      where: { id: selectedPost.id },
      data: { isFeatured: true },
    });

    console.log(
      `New featured post set: "${selectedPost.title}" by ${selectedPost.author.firstName} ${selectedPost.author.lastName}`
    );
  } catch (error) {
    console.error("Error updating featured post:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateFeaturedPost()
  .then(() => {
    console.log("Featured post update completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
