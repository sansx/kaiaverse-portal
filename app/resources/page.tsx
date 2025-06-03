export default function ResourcesPage() {
  const resources = [
    {
      category: "开发文档",
      items: [
        {
          title: "快速开始指南",
          description: "从这里开始了解如何使用Kaia进行开发",
          link: "#"
        },
        {
          title: "API文档",
          description: "详细的API参考文档",
          link: "#"
        },
        {
          title: "SDK文档",
          description: "各种编程语言的SDK使用指南",
          link: "#"
        }
      ]
    },
    {
      category: "社区资源",
      items: [
        {
          title: "Discord社区",
          description: "加入我们的Discord社区进行交流",
          link: "#"
        },
        {
          title: "开发者论坛",
          description: "技术讨论和问题解答",
          link: "#"
        },
        {
          title: "Github仓库",
          description: "查看和贡献代码",
          link: "#"
        }
      ]
    },
    {
      category: "学习资源",
      items: [
        {
          title: "教程中心",
          description: "学习如何构建Kaia应用的教程集合",
          link: "#"
        },
        {
          title: "示例项目",
          description: "参考实现的示例项目",
          link: "#"
        },
        {
          title: "视频教程",
          description: "观看视频学习Kaia开发",
          link: "#"
        }
      ]
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Kaia 资源中心</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.title} className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <a
                      href={item.link}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      访问资源 →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 