export default function EventsPage() {
  const events = [
    {
      title: "Kaia 开发者大会",
      date: "2024年4月15日",
      location: "线上",
      description: "探讨Kaia最新技术发展和应用场景",
      registrationLink: "#"
    },
    {
      title: "Kaia 黑客松",
      date: "2024年5月1日",
      location: "全球",
      description: "48小时编程马拉松，构建创新的Kaia应用",
      registrationLink: "#"
    },
    {
      title: "社区 AMA",
      date: "2024年4月20日",
      location: "Discord",
      description: "与Kaia核心团队交流",
      registrationLink: "#"
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Kaia 活动日历</h1>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-2">📅 {event.date}</p>
                  <p className="text-gray-600 mb-2">📍 {event.location}</p>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                </div>
                <a
                  href={event.registrationLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  报名参加
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 