export default function ToolsPage() {
  const tools = [
    {
      name: "Kaia Faucet",
      description: "获取测试网代币",
      link: "#",
      icon: "💧"
    },
    {
      name: "Staking",
      description: "质押Kaia代币获取收益",
      link: "#",
      icon: "🔒"
    },
    {
      name: "Swap",
      description: "在Kaia生态系统中交换代币",
      link: "#",
      icon: "🔄"
    },
    {
      name: "Lending",
      description: "Kaia生态系统中的借贷服务",
      link: "#",
      icon: "💰"
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Kaia 工具与服务</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div key={tool.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <a
                href={tool.link}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                立即使用 →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 