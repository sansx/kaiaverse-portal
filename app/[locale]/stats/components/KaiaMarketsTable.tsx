"use client";

import { useState, useMemo } from "react";
import { formatNumber } from "./StatsOverview";
import { FaSort, FaSortUp, FaSortDown, FaChevronDown } from "react-icons/fa";

interface TickerData {
  base: string;
  target: string;
  market: {
    name: string;
    identifier: string;
    has_trading_incentive: boolean;
  };
  last: number | null;
  volume: number;
  converted_last: {
    btc: number;
    eth: number;
    usd: number;
  };
  converted_volume: {
    btc: number;
    eth: number;
    usd: number;
  };
  trust_score: string | null;
  bid_ask_spread_percentage: number | null;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string | null;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url: string;
  token_info_url: string | null;
  coin_id: string;
  target_coin_id: string;
}

interface KaiaMarketsTableProps {
  tickers: TickerData[];
  totalVolume: number;
}

type SortField = 'exchange' | 'pair' | 'price' | 'spread' | 'volume' | 'volumePercent' | 'lastUpdated';
type SortDirection = 'asc' | 'desc' | null;

const TrustScoreBadge = ({ score }: { score: string }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-2 h-2 rounded-full ${
          score.toLowerCase() === "green"
            ? "bg-green-500"
            : score.toLowerCase() === "yellow"
            ? "bg-yellow-500"
            : score.toLowerCase() === "red"
            ? "bg-red-500"
            : "bg-gray-500"
        }`}
      />
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 60) {
    return `${diffMins}m`;
  } else if (diffMins < 24 * 60) {
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const SortButton = ({ 
  field, 
  currentField, 
  direction, 
  onClick, 
  children,
  align = 'left'
}: { 
  field: SortField;
  currentField: SortField | null;
  direction: SortDirection;
  onClick: (field: SortField) => void;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}) => {
  const isActive = currentField === field;
  
  return (
    <button
      onClick={() => onClick(field)}
      className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
        align === 'right' ? 'justify-end' : 
        align === 'center' ? 'justify-center' : 
        'justify-start'
      }`}
    >
      {children}
      {isActive ? (
        direction === 'asc' ? (
          <FaSortUp className="w-3 h-3 text-blue-600" />
        ) : (
          <FaSortDown className="w-3 h-3 text-blue-600" />
        )
      ) : (
        <FaSort className="w-3 h-3 text-gray-400" />
      )}
    </button>
  );
};

export default function KaiaMarketsTable({
  tickers,
  totalVolume,
}: KaiaMarketsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // 排序逻辑
  const sortedTickers = useMemo(() => {
    if (!sortField || !sortDirection) return tickers;

    return [...tickers].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'exchange':
          aValue = a.market?.name || '';
          bValue = b.market?.name || '';
          break;
        case 'pair':
          aValue = `${a.base}/${a.target}`;
          bValue = `${b.base}/${b.target}`;
          break;
        case 'price':
          aValue = a.last || 0;
          bValue = b.last || 0;
          break;
        case 'spread':
          aValue = a.bid_ask_spread_percentage || 0;
          bValue = b.bid_ask_spread_percentage || 0;
          break;
        case 'volume':
          aValue = a.converted_volume?.usd || 0;
          bValue = b.converted_volume?.usd || 0;
          break;
        case 'volumePercent':
          aValue = totalVolume > 0 ? (a.converted_volume?.usd || 0) / totalVolume : 0;
          bValue = totalVolume > 0 ? (b.converted_volume?.usd || 0) / totalVolume : 0;
          break;
        case 'lastUpdated':
          aValue = new Date(a.last_fetch_at || 0).getTime();
          bValue = new Date(b.last_fetch_at || 0).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });
  }, [tickers, sortField, sortDirection, totalVolume]);

  // 分页逻辑
  const totalPages = Math.ceil(sortedTickers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedTickers.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // 重置到第一页
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // 重置到第一页
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Kaia Markets</h3>
        
        {/* 每页显示数量选择 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* 表格 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '60px' }}>
                #
              </th>
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>
                <SortButton field="exchange" currentField={sortField} direction={sortDirection} onClick={handleSort}>
                  Exchange
                </SortButton>
              </th>
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>
                <SortButton field="pair" currentField={sortField} direction={sortDirection} onClick={handleSort}>
                  Pair
                </SortButton>
              </th>
              <th className="px-3 py-2 text-right text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>
                <SortButton field="price" currentField={sortField} direction={sortDirection} onClick={handleSort} align="right">
                  Price
                </SortButton>
              </th>
              <th className="px-3 py-2 text-right text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '80px' }}>
                <SortButton field="spread" currentField={sortField} direction={sortDirection} onClick={handleSort} align="right">
                  Spread
                </SortButton>
              </th>
              <th className="px-3 py-2 text-right text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '140px' }}>
                <SortButton field="volume" currentField={sortField} direction={sortDirection} onClick={handleSort} align="right">
                  24h Volume
                </SortButton>
              </th>
              <th className="px-3 py-2 text-right text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>
                <SortButton field="volumePercent" currentField={sortField} direction={sortDirection} onClick={handleSort} align="right">
                  Volume %
                </SortButton>
              </th>
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '80px' }}>
                <SortButton field="lastUpdated" currentField={sortField} direction={sortDirection} onClick={handleSort}>
                  Updated
                </SortButton>
              </th>
              <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider" style={{ width: '80px' }}>
                Trust
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((ticker, index) => {
              const globalIndex = startIndex + index + 1;
              const volumePercentage = totalVolume > 0 
                ? (ticker.converted_volume?.usd || 0) / totalVolume * 100 
                : 0;

              return (
                <tr key={`${ticker.market.identifier}-${ticker.base}-${ticker.target}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 font-medium" style={{ width: '60px' }}>
                    {globalIndex}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap" style={{ width: '120px' }}>
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {ticker.market?.name || '-'}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap" style={{ width: '120px' }}>
                    <a
                      href={ticker.trade_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate block"
                    >
                      {ticker.base && ticker.target ? `${ticker.base}/${ticker.target}` : '-'}
                    </a>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-left text-sm font-bold text-gray-900" style={{ width: '100px' }}>
                    {ticker.last != null ? `$${formatNumber(ticker.last, 4)}` : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-left text-sm font-medium text-gray-700" style={{ width: '80px' }}>
                    {ticker.bid_ask_spread_percentage != null 
                      ? `${ticker.bid_ask_spread_percentage.toFixed(2)}%` 
                      : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-left text-sm font-bold text-gray-900" style={{ width: '140px' }}>
                    {ticker.converted_volume?.usd != null 
                      ? `$${ticker.converted_volume.usd.toLocaleString('en-US')}` 
                      : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-800" style={{ width: '100px' }}>
                    {ticker.converted_volume?.usd != null && totalVolume > 0
                      ? `${volumePercentage.toFixed(2)}%`
                      : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 font-medium" style={{ width: '80px' }}>
                    {ticker.last_fetch_at ? formatDate(ticker.last_fetch_at) : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap" style={{ width: '80px' }}>
                    {ticker.trust_score ? (
                      <TrustScoreBadge score={ticker.trust_score} />
                    ) : (
                      <div className="flex justify-center">
                        <span className="text-sm text-gray-400 font-medium">-</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedTickers.length)} of {sortedTickers.length}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            
            {/* 页码按钮 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else {
                if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
              }
              
              if (page < 1 || page > totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 