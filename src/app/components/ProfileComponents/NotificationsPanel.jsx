export default function NotificationsPanel() {
  return (
   <div className="rounded-xl overflow-hidden h-full flex flex-col min-h-[200px] md:min-h-[280px]">
      <div className="bg-[#111018] border-b border-[#2d1b4e] px-4 py-3">
        <h3 className="text-sm font-medium text-gray-200 text-center">Notifications</h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10 bg-[#08070f]">
        <svg className="w-11 h-11 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <p className="text-sm text-gray-400">No notifications yet</p>
        <p className="text-sm text-purple-500">Stay sharp, action's coming.</p>
      </div>
    </div>
  )
}