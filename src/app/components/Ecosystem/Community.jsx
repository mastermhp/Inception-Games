export const communityData = {
  title: "Our Community",
  subtitle: "Join thousands of passionate gamers",
  items: [
    { id: 1, photo: "/Ecosystem/Community/c1.jpg" },
    { id: 2, photo: "/Ecosystem/Community/c2.jpg" },
    { id: 3, photo: "/Ecosystem/Community/c3.jpg" },
    { id: 4, photo: "/Ecosystem/Community/c4.jpg" },
    { id: 5, photo: "/Ecosystem/Community/c6.JPG" },
    { id: 6, photo: "/Ecosystem/Community/c7.JPG" },
    { id: 7, photo: "/Ecosystem/Community/c8.JPG" },
    { id: 8, photo: "/Ecosystem/Community/c17.jpg" },
  ],
};

// card component
export function CommunityCard({ item, isFeatured = false }) {
  return (
    <div
      className={`relative h-full rounded-2xl sm:rounded-3xl overflow-hidden ${
        isFeatured ? "shadow-2xl shadow-purple-500/20" : ""
      }`}
      style={{
        backgroundImage: `url('${item.photo}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: isFeatured ? "300px" : "200px",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
        <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold">
          {item.id}
        </span>
      </div>
    </div>
  );
}
