import Link from "next/link";

// data
export const gamesData = {
  title: "Our Games",
  subtitle: "Compete in your favorite titles",
  items: [
    {
      id: 1,
      name: "Z Inception",
      photo: "/Ecosystem/Games/zinception.jpg",
      link: "https://drive.google.com/file/d/1a0PfwyBeGXXJAvE5wRGG_7wey0y5JCzX/view",
    },
    {
      id: 2,
      name: "Beyblade",
      photo: "/Ecosystem/Games/Beyblade.png",
      link: "https://gamejolt.com/games/bayblade_demo/274742",
    },
    {
      id: 3,
      name: "Dhaka Racing Sim",
      photo: "/Ecosystem/Games/DhakaRacingSim.jpg",
      link: "https://www.facebook.com/reel/2260993467662799",
    },
    {
      id: 4,
      name: "Exo Discover",
      photo: "/Ecosystem/Games/discover.png",
      link: "https://imtiazahmeddipto.itch.io/exo-descover",
    },
    {
      id: 5,
      name: "Arcade Game",
      photo: "/Ecosystem/Games/ArcadeGame.jpeg",
      link: "https://play.google.com/store/apps/details?id=asia.ifarmer.farmers&pcampaignid=web_share",
    },
    {
      id: 6,
      name: "Unknown Surge",
      photo: "/Ecosystem/Games/unknownsurge.png",
      link: "https://store.steampowered.com/app/1132450/Unknown_Surge/",
    },
  ],
};

// card component
export function GameCard({ item, isFeatured = false }) {
  return (
    <Link
      href={item.link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div
        className={`relative h-full rounded-3xl overflow-hidden ${
          isFeatured ? "shadow-2xl shadow-purple-500/20" : ""
        }`}
      >
        {/* Game Image */}
        <img
          src={item.photo}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-contain object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <h4 className="text-white font-semibold text-lg">{item.name}</h4>
        </div>
      </div>
    </Link>
  );
}