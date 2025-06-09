'use client';

import { useState, useEffect } from 'react';

// 定义事件数据类型
interface Event {
  title: string;
  date: string;
  location: string;
  description: string;
  registrationLink: string;
  hostBy: string;
  category: string;
}

// 扩展事件类型，包含计算出的状态
interface EventWithStatus extends Event {
  status: string;
  startDate: Date;
  endDate?: Date;
  lumaEventId?: string;
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState<EventWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从Luma URL中提取事件ID
  const extractLumaEventId = (url: string): string | undefined => {
    try {
      // 匹配 lu.ma/xxx 格式的URL
      const match = url.match(/lu\.ma\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        return `evt-${match[1]}`;
      }
    } catch (error) {
      console.error('Error extracting Luma event ID:', error);
    }
    return undefined;
  };

  // 加载Luma checkout脚本
  useEffect(() => {
    const loadLumaScript = () => {
      // 检查脚本是否已经加载
      if (document.getElementById('luma-checkout')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'luma-checkout';
      script.src = 'https://embed.lu.ma/checkout-button.js';
      script.async = true;
      
      script.onload = () => {
        // 脚本加载完成后初始化checkout按钮
        if (window.luma) {
          window.luma.initCheckout();
        }
      };

      document.head.appendChild(script);
    };

    loadLumaScript();

    // 清理函数
    return () => {
      const script = document.getElementById('luma-checkout');
      if (script) {
        script.remove();
      }
    };
  }, []);

  // 解析中文日期字符串为Date对象
  const parseChineseDate = (dateStr: string): { startDate: Date; endDate?: Date } => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    try {
      // 处理日期范围格式：如 "2024年9月16-20日 10:00-17:00"
      if (dateStr.includes('-') && dateStr.match(/\d+-\d+日/)) {
        const rangeMatch = dateStr.match(/(\d+)年(\d+)月(\d+)-(\d+)日\s*(\d+):(\d+)-(\d+):(\d+)/);
        if (rangeMatch) {
          const [, year, month, startDay, endDay, startHour, startMin, endHour, endMin] = rangeMatch;
          const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(startDay), parseInt(startHour), parseInt(startMin));
          const endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(endDay), parseInt(endHour), parseInt(endMin));
          return { startDate, endDate };
        }
      }
      
      // 处理单日时间范围格式：如 "2024年11月11日 15:00-19:00"
      const timeRangeMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日\s*(\d+):(\d+)-(\d+):(\d+)/);
      if (timeRangeMatch) {
        const [, year, month, day, startHour, startMin, endHour, endMin] = timeRangeMatch;
        const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(startHour), parseInt(startMin));
        const endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(endHour), parseInt(endMin));
        return { startDate, endDate };
      }
      
      // 处理单一时间格式：如 "2024年12月12日 18:00"
      const singleTimeMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日\s*(\d+):(\d+)/);
      if (singleTimeMatch) {
        const [, year, month, day, hour, min] = singleTimeMatch;
        const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(min));
        return { startDate };
      }
      
      // 处理只有日期的格式：如 "2025年4月7日 17:30"
      const dateOnlyMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
      if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return { startDate };
      }
      
    } catch (error) {
      console.error('Date parsing error:', error, 'for date string:', dateStr);
    }
    
    // 如果解析失败，返回当前时间
    return { startDate: now };
  };

  // 根据时间计算活动状态
  const calculateEventStatus = (startDate: Date, endDate?: Date): string => {
    const now = new Date();
    
    if (endDate) {
      // 有结束时间的活动
      if (now < startDate) {
        return '即将开始';
      } else if (now >= startDate && now <= endDate) {
        return '进行中';
      } else {
        return '已结束';
      }
    } else {
      // 只有开始时间的活动
      if (now < startDate) {
        return '即将开始';
      } else {
        return '已结束';
      }
    }
  };

  // 从JSON文件加载活动数据
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/kaia_events_cn.json');
        if (!response.ok) {
          throw new Error('Failed to load events data');
        }
        const eventsData: Event[] = await response.json();
        
        // 为每个活动计算状态和解析日期
        const eventsWithStatus: EventWithStatus[] = eventsData.map(event => {
          const { startDate, endDate } = parseChineseDate(event.date);
          const status = calculateEventStatus(startDate, endDate);
          const lumaEventId = extractLumaEventId(event.registrationLink);
          
          return {
            ...event,
            status,
            startDate,
            endDate,
            lumaEventId
          };
        });
        
        // 按开始时间排序（最新的在前）
        eventsWithStatus.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
        
        setEvents(eventsWithStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // 重新初始化Luma按钮（当事件数据更新后）
  useEffect(() => {
    if (events.length > 0) {
      // 延迟执行以确保DOM已更新
      setTimeout(() => {
        if (window.luma) {
          window.luma.initCheckout();
        }
      }, 100);
    }
  }, [events]);

  const filters = [
    { id: 'all', name: '全部活动' },
    { id: 'upcoming', name: '即将开始' },
    { id: 'in_progress', name: '进行中' },
    { id: 'completed', name: '已结束' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已结束':
        return 'text-gray-600';
      case '进行中':
        return 'text-green-600';
      case '即将开始':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    return status;
  };

  // 状态映射函数
  const mapStatusForFilter = (status: string) => {
    switch (status) {
      case '已结束':
        return 'completed';
      case '进行中':
        return 'in_progress';
      case '即将开始':
        return 'upcoming';
      default:
        return 'other';
    }
  };

  const filteredEvents = events.filter(event => 
    activeFilter === 'all' || mapStatusForFilter(event.status) === activeFilter
  );

  // 渲染注册按钮
  const renderRegistrationButton = (event: EventWithStatus) => {
    const isDisabled = event.status === '已结束';
    
    // 如果活动已结束，显示查看详情按钮
    if (isDisabled) {
      return (
        <a
          href={event.registrationLink}
          className="ml-4 px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          查看详情
        </a>
      );
    }
    
    // 如果有Luma事件ID，使用Luma checkout按钮
    if (event.lumaEventId) {
      return (
        <button
          className="ml-4 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          type="button"
          data-luma-action="checkout"
          data-luma-event-id={event.lumaEventId}
        >
          {event.status === '进行中' ? '正在进行' : '报名参加'}
        </button>
      );
    }
    
    // 否则使用普通链接按钮
    return (
      <a
        href={event.registrationLink}
        className={`ml-4 px-4 py-2 rounded-md ${
          event.status === '进行中'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-colors`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {event.status === '进行中' ? '正在进行' : '报名参加'}
      </a>
    );
  };

  // 加载状态显示
  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">正在加载活动数据...</div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">加载活动数据失败: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题和筛选器 */}
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

        {/* 两列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：活动列表 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <div 
                  key={`${event.title}-${index}`} 
                  className={`rounded-lg shadow-md p-6 ${
                    event.status === '已结束' 
                      ? 'bg-gray-50 border-l-4 border-gray-400' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-xl font-semibold ${
                          event.status === '已结束' ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {event.title}
                        </h3>
                        <span className={`text-sm font-medium ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                        {event.lumaEventId && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Luma
                          </span>
                        )}
                        {event.status === '已结束' && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                            过往活动
                          </span>
                        )}
                      </div>
                      <p className={`mb-2 ${
                        event.status === '已结束' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        📅 {event.date}
                      </p>
                      <p className={`mb-2 ${
                        event.status === '已结束' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        📍 {event.location}
                      </p>
                      <p className={`mb-2 ${
                        event.status === '已结束' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        🏢 {event.hostBy}
                      </p>
                      <p className={`mb-4 ${
                        event.status === '已结束' ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {event.description}
                      </p>
                      <div className="inline-block">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === '已结束' 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.category}
                        </span>
                      </div>
                    </div>
                    {renderRegistrationButton(event)}
                  </div>
                </div>
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">暂无符合条件的活动</p>
              </div>
            )}
          </div>

          {/* 右侧：Luma日历嵌入 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">未来活动日历</h2>
                <div className="w-full">
                  <iframe
                    src="https://lu.ma/embed/calendar/cal-Zxd3NPs07srlXc3/events"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    style={{ 
                      border: '1px solid #bfcbda88', 
                      borderRadius: '4px',
                      minWidth: '300px'
                    }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                    title="Kaia Events Calendar"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  点击日历中的活动查看详情
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 扩展Window接口以包含luma对象
declare global {
  interface Window {
    luma?: {
      initCheckout: () => void;
    };
  }
} 