import { PrismaClient } from "@prisma/client";

// Initialize PrismaClient with explicit configuration for ES modules
const prisma = new PrismaClient();

async function updateFeaturedPost() {
  console.log("Starting featured post update process...");

  try {
    // 1. Reset current featured posts
    await prisma.post.updateMany({
      where: { featured: true },
      data: { featured: false },
    });

    console.log("Reset current featured posts");

    // 2. Find candidate posts
    // Criteria: Published posts with good engagement (likes/views), not featured recently
    // You can customize this query based on your schema and requirements
    const candidates = await prisma.post.findMany({
      where: {
        published: true,
        // Add other criteria as needed
      },
      orderBy: [
        // Prioritize posts with higher engagement
        { likes: "desc" },
        { views: "desc" },
        // Add recency as a factor
        { createdAt: "desc" },
      ],
      take: 10, // Get top 10 candidates
      include: {
        author: true,
      },
    });

    if (candidates.length === 0) {
      console.log("No suitable candidates found for featuring");
      return;
    }

    // 3. Select one post randomly from the top candidates
    const randomIndex = Math.floor(
      Math.random() * Math.min(candidates.length, 5)
    ); // Random from top 5
    const selectedPost = candidates[randomIndex];

    // 4. Update the selected post to be featured
    await prisma.post.update({
      where: { id: selectedPost.id },
      data: { featured: true },
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

// Run the function
updateFeaturedPost()
  .then(() => {
    console.log("Featured post update completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
