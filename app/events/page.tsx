'use client';

import { useState } from 'react';

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const events = [
    {
      title: "Kaia 开发者大会 2023",
      date: "2023年12月15日",
      location: "线上",
      description: "探讨Kaia最新技术发展和应用场景",
      registrationLink: "#",
      status: "completed"
    },
    {
      title: "Kaia 黑客松",
      date: "2024年5月1日",
      location: "全球",
      description: "48小时编程马拉松，构建创新的Kaia应用",
      registrationLink: "#",
      status: "upcoming"
    },
    {
      title: "社区 AMA",
      date: "2024年4月20日",
      location: "Discord",
      description: "与Kaia核心团队交流",
      registrationLink: "#",
      status: "upcoming"
    },
    {
      title: "Kaia DeFi 研讨会",
      date: "2024年3月15日 - 2024年3月20日",
      location: "线上",
      description: "深入探讨Kaia DeFi生态系统的发展方向",
      registrationLink: "#",
      status: "in_process"
    },
    {
      title: "Kaia 生态项目路演",
      date: "2023年11月30日",
      location: "新加坡",
      description: "优秀项目展示与投资对接",
      registrationLink: "#",
      status: "completed"
    },
    {
      title: "Kaia 技术工作坊",
      date: "2024年3月18日 - 2024年3月25日",
      location: "线上",
      description: "面向开发者的深度技术培训",
      registrationLink: "#",
      status: "in_process"
    }
  ];

  const filters = [
    { id: 'all', name: '全部活动' },
    { id: 'in_process', name: '进行中' },
    { id: 'upcoming', name: '即将开始' },
    { id: 'completed', name: '已结束' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-gray-600';
      case 'in_process':
        return 'text-green-600';
      case 'upcoming':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已结束';
      case 'in_process':
        return '进行中';
      case 'upcoming':
        return '即将开始';
      default:
        return status;
    }
  };

  const filteredEvents = events.filter(event => 
    activeFilter === 'all' || event.status === activeFilter
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Kaia 活动日历</h1>
          <div className="flex space-x-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <span className={`text-sm font-medium ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">📅 {event.date}</p>
                  <p className="text-gray-600 mb-2">📍 {event.location}</p>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                </div>
                <a
                  href={event.registrationLink}
                  className={`px-4 py-2 rounded-md ${
                    event.status === 'completed'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                  onClick={(e) => {
                    if (event.status === 'completed') {
                      e.preventDefault();
                    }
                  }}
                >
                  {event.status === 'completed' ? '活动已结束' : '报名参加'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 