// data
export const communityData = {
  title: "Our Community",
  subtitle: "Join thousands of passionate gamers",
  items: [
    { id: 1, photo: "/Ecosystem/Community/c1.jpg" },
    { id: 2, photo: "/Ecosystem/Community/c2.jpg" },
    { id: 3, photo: "/Ecosystem/Community/c3.jpg" },
    { id: 4, photo: "/Ecosystem/Community/c4.jpg" },
    { id: 5, photo: "/Ecosystem/Community/c6.jpg" },
    { id: 6, photo: "/Ecosystem/Community/c7.jpg" },
    { id: 7, photo: "/Ecosystem/Community/c8.jpg" },
    { id: 8, photo: "/Ecosystem/Community/c17.jpg" },
  ],
};

// card component
export function CommunityCard({ item, isFeatured = false }) {
  return (
    <div
      className={`relative h-full rounded-3xl overflow-hidden ${
        isFeatured ? "shadow-2xl shadow-purple-500/20" : ""
      }`}
      style={{
        backgroundImage: `url('${item.photo}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
          {item.id}
        </span>
      </div>
    </div>
  );
}